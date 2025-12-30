const fetch = require('node-fetch');

async function fetchPublicHolidays(year) {
  const url = `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch holidays for ${year}: ${response.statusText}`);
    }
    const data = await response.json();
    return Object.keys(data).map(date => new Date(date));
  } catch (error) {
    console.error(`Error fetching public holidays for ${year}:`, error.message);
    return [];
  }
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isPublicHoliday(date, publicHolidays) {
  const dateStr = date.toISOString().split('T')[0];
  return publicHolidays.some(holiday => {
    const holidayStr = holiday.toISOString().split('T')[0];
    return holidayStr === dateStr;
  });
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthName(date) {
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return months[date.getMonth()];
}

async function calculateDaysOff(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) {
    throw new Error('Start date must be before or equal to end date');
  }

  const years = new Set();
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    years.add(d.getFullYear());
  }

  const publicHolidays = [];
  for (const year of years) {
    const holidays = await fetchPublicHolidays(year);
    publicHolidays.push(...holidays);
  }

  const monthlyBreakdown = {};
  let totalDays = 0;
  let totalWeekends = 0;
  let totalPublicHolidays = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const monthKey = getMonthKey(d);
    
    if (!monthlyBreakdown[monthKey]) {
      monthlyBreakdown[monthKey] = {
        month: getMonthName(d),
        year: d.getFullYear(),
        totalDays: 0,
        weekends: 0,
        publicHolidays: 0,
        workingDays: 0
      };
    }

    monthlyBreakdown[monthKey].totalDays++;
    totalDays++;

    if (isWeekend(d)) {
      monthlyBreakdown[monthKey].weekends++;
      totalWeekends++;
    } else if (isPublicHoliday(d, publicHolidays)) {
      monthlyBreakdown[monthKey].publicHolidays++;
      totalPublicHolidays++;
    } else {
      monthlyBreakdown[monthKey].workingDays++;
    }
  }

  const totalWorkingDays = totalDays - totalWeekends - totalPublicHolidays;

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    totalDays,
    totalWeekends,
    totalPublicHolidays,
    totalWorkingDays,
    monthlyBreakdown: Object.values(monthlyBreakdown)
  };
}

function displayResults(results) {
  console.log('\n=== CALCUL DES JOURS DE CONGÉ ===\n');
  console.log(`Période: ${results.startDate} au ${results.endDate}`);
  console.log(`Total: ${results.totalDays}j - ${results.totalWeekends} week-ends - ${results.totalPublicHolidays} jours fériés = ${results.totalWorkingDays}j off saisis par l'employé\n`);
  
  console.log('--- Répartition par mois ---\n');
  
  results.monthlyBreakdown.forEach(month => {
    console.log(`${month.month.charAt(0).toUpperCase() + month.month.slice(1)} ${month.year}:`);
    console.log(`  Jours sur la période: ${month.totalDays}j - ${month.weekends} week-ends - ${month.publicHolidays} jours fériés = ${month.workingDays}j off`);
  });
  
  console.log(`\nTotal: ${results.monthlyBreakdown.map(m => m.workingDays).join(' + ')} = ${results.totalWorkingDays}j\n`);
}

module.exports = {
  calculateDaysOff,
  displayResults
};
