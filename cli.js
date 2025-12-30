const { calculateDaysOff, displayResults } = require('./daysOffCalculator');

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node index.js <start-date> <end-date>');
    console.log('Example: node index.js 2025-04-27 2025-05-10');
    console.log('Date format: YYYY-MM-DD');
    process.exit(1);
  }

  const startDate = args[0];
  const endDate = args[1];

  try {
    const results = await calculateDaysOff(startDate, endDate);
    displayResults(results);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
