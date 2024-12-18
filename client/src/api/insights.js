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
    // Format the data to match server expectations
    const formattedData = {
      data: {
        monthlyIncome: financialData.income,
        expenses: financialData.expenses,
        age: financialData.currentAge,
        retirementAge: financialData.retirementAge,
        target1Year: financialData.target1Year,
        target2Year: financialData.target2Year
      }
    };

    const response = await fetch('/.netlify/functions/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch insights');
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
    throw error;
  }
};

function calculateFinancialHealthScore({ monthlySavings, savingsRatio, expenseBreakdown }) {
  let score = 100;

  // Penalize negative savings
  if (monthlySavings < 0) {
    score -= 30;
  }

  // Evaluate savings ratio
  if (savingsRatio < 20) {
    score -= 20;
  } else if (savingsRatio < 10) {
    score -= 30;
  }

  // Check expense distribution
  const highestExpensePercentage = expenseBreakdown[0]?.percentage || 0;
  if (highestExpensePercentage > 50) {
    score -= 20;
  } else if (highestExpensePercentage > 30) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}
