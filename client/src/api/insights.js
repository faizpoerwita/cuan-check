import { formatCurrency } from '../utils/format';
import Chart from 'chart.js/auto';
import { CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement);

const formatCurrencyId = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export async function getFinancialInsights(financialData) {
  try {
    console.log('Data being sent to getFinancialInsights:', financialData);

    const response = await fetch('/.netlify/functions/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(financialData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', errorData);
      throw new Error(errorData.error || `Failed to fetch insights: ${response.status}`);
    }

    const data = await response.json();
    return {
      status: data.status,
      expenses: data.expenses,
      risk: data.risk,
      recommendations: data.recommendations,
      aiAnalysis: {
        prioritasUtama: data.aiAnalysis.prioritasutama,
        analisisKesehatan: data.aiAnalysis.analisiskesehatan,
        rekomendasiSpesifik: data.aiAnalysis.rekomendasispesifik,
        langkahSelanjutnya: data.aiAnalysis.langkahselanjutnya
      },
      summary: data.summary
    };
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw new Error('Failed to fetch insights');
  }
}

export function calculateFinancialHealthScore({ monthlySavings, savingsRatio, expenseBreakdown }) {
  let score = 70; // Base score
  
  // Evaluate savings
  if (monthlySavings < 0) {
    score -= 30;
  } else if (savingsRatio >= 0.3) {
    score += 15;
  } else if (savingsRatio >= 0.2) {
    score += 10;
  } else if (savingsRatio >= 0.1) {
    score += 5;
  }
  
  // Evaluate expense distribution
  if (expenseBreakdown.length > 0) {
    const highestExpenseRatio = expenseBreakdown[0].percentage / 100;
    if (highestExpenseRatio > 0.5) {
      score -= 15;
    } else if (highestExpenseRatio > 0.4) {
      score -= 10;
    } else if (highestExpenseRatio > 0.3) {
      score -= 5;
    }
  }
  
  return Math.max(0, Math.min(100, score));
}
