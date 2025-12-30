<template>
  <div class="container">
    <h1>📅 Calculateur de Jours de Congé</h1>
    <p class="subtitle">Calculez vos jours de congé par mois en excluant les week-ends et jours fériés</p>
    
    <form @submit.prevent="calculate">
      <div class="date-inputs">
        <div class="form-group">
          <label for="startDate">Date de début</label>
          <input 
            type="date" 
            id="startDate" 
            v-model="startDate" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="endDate">Date de fin</label>
          <input 
            type="date" 
            id="endDate" 
            v-model="endDate" 
            required
          />
        </div>
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Calcul en cours...' : 'Calculer' }}
      </button>
    </form>
    
    <div v-if="loading" class="loading">
      <span class="spinner"></span>
      Récupération des jours fériés...
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-if="results" class="results">
      <div class="summary">
        <h2>Résumé</h2>
        <div class="summary-details">
          <p><strong>Période :</strong> {{ formatDate(results.startDate) }} au {{ formatDate(results.endDate) }}</p>
          <p><strong>Détail :</strong> {{ results.totalDays }}j - {{ results.totalWeekends }} week-ends - {{ results.totalPublicHolidays }} jours fériés</p>
        </div>
        <div class="summary-total">
          = {{ results.totalWorkingDays }} jours de congé
        </div>
      </div>
      
      <div class="monthly-breakdown">
        <h3>Répartition par mois</h3>
        <div 
          v-for="month in results.monthlyBreakdown" 
          :key="`${month.year}-${month.month}`"
          class="month-card"
        >
          <div class="month-title">
            {{ capitalizeFirst(month.month) }} {{ month.year }}
          </div>
          <div class="month-details">
            {{ month.totalDays }}j - {{ month.weekends }} week-ends - {{ month.publicHolidays }} jours fériés
          </div>
          <div class="working-days">
            {{ month.workingDays }} jours de congé
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { calculateDaysOff } from './utils/daysOffCalculator.js';

export default {
  name: 'App',
  setup() {
    const startDate = ref('2026-04-27');
    const endDate = ref('2026-05-10');
    const loading = ref(false);
    const error = ref(null);
    const results = ref(null);

    const calculate = async () => {
      loading.value = true;
      error.value = null;
      results.value = null;

      try {
        results.value = await calculateDaysOff(startDate.value, endDate.value);
      } catch (err) {
        error.value = err.message || 'Une erreur est survenue lors du calcul';
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    };

    const capitalizeFirst = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return {
      startDate,
      endDate,
      loading,
      error,
      results,
      calculate,
      formatDate,
      capitalizeFirst
    };
  }
};
</script>
