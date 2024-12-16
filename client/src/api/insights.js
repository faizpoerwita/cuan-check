const API_KEY = import.meta.env.VITE_API_KEY || "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";
const API_URL = import.meta.env.VITE_API_URL || "https://api.groq.com/openai/v1/chat/completions";
const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

export const getFinancialInsights = async (data) => {
  try {
    // Basic Information
    const monthlyIncome = data.totalIncome;
    const currentAge = data.usiaSaatIni;
    const retirementAge = data.targetUsiaPensiun;
    const yearsToRetirement = retirementAge - currentAge;

    // Targets
    const target1Year = data.targetTabungan1Tahun;
    const target2Year = data.targetTabungan2Tahun;

    // Monthly Expenses Breakdown - Simple aggregation
    const expenses = data.transactions.reduce((acc, transaction) => {
      const { label, amount } = transaction;
      acc[label.toLowerCase()] = (acc[label.toLowerCase()] || 0) + amount;
      return acc;
    }, {});

    // Calculate total expenses
    const totalExpenses = Object.values(expenses).reduce((sum, amount) => sum + amount, 0);

    // Financial Summary
    const monthlySavings = monthlyIncome - totalExpenses;
    const yearlySavings = monthlySavings * 12;
    const savingsRatio = (monthlySavings / monthlyIncome) * 100;

    // Time-based expenses
    const dailyExpenses = totalExpenses / 30;
    const weeklyExpenses = totalExpenses / 4;

    // Target Progress
    const target1YearProgress = (yearlySavings / target1Year) * 100;
    const target2YearProgress = (yearlySavings * 2 / target2Year) * 100;
    const monthsToTarget1 = target1Year / monthlySavings;
    const monthsToTarget2 = target2Year / monthlySavings;

    // Basic expense analysis for AI context
    const expenseAnalysis = {
      total: totalExpenses,
      daily: dailyExpenses,
      weekly: weeklyExpenses,
      monthly: totalExpenses,
      breakdown: Object.entries(expenses)
        .sort(([,a], [,b]) => b - a)
        .map(([label, amount]) => ({
          label,
          amount,
          percentage: (amount / totalExpenses) * 100
        }))
    };

    // Financial health indicators
    const healthIndicators = {
      savingsRatio,
      expenseToIncomeRatio: (totalExpenses / monthlyIncome) * 100,
      largestExpenseRatio: Math.max(...Object.values(expenses)) / totalExpenses * 100,
      targetProgress: (yearlySavings / target1Year) * 100
    };

    // Prepare comprehensive data for AI analysis
    const systemMessage = {
      role: "system",
      content: `Anda adalah asisten keuangan AI yang menganalisis data berikut:

[DATA KEUANGAN]
• Pendapatan Bulanan: ${monthlyIncome}
• Total Pengeluaran: ${totalExpenses}
• Tabungan Bulanan: ${monthlySavings}
• Rasio Tabungan: ${savingsRatio.toFixed(1)}%

[RINCIAN PENGELUARAN]
${expenseAnalysis.breakdown
  .map(item => `• ${item.label}: ${item.amount} (${item.percentage.toFixed(1)}%)`)
  .join('\n')}

[TARGET KEUANGAN]
• Target 1 Tahun: ${target1Year} (Progress: ${target1YearProgress.toFixed(1)}%)
• Target 2 Tahun: ${target2Year} (Progress: ${target2YearProgress.toFixed(1)}%)

[INFORMASI TAMBAHAN]
• Usia: ${currentAge} tahun
• Target Usia Pensiun: ${retirementAge} tahun
• Waktu ke Pensiun: ${yearsToRetirement} tahun

Berikan analisis mendalam dengan:
1. Status kesehatan keuangan berdasarkan pola pengeluaran dan tabungan
2. Identifikasi pola pengeluaran dan area yang perlu perhatian
3. Rekomendasi spesifik untuk optimasi keuangan
4. Target jangka pendek yang terukur
5. Proyeksi dan potensi pertumbuhan keuangan

Analisis harus mempertimbangkan semua aspek data yang diberikan dan memberikan wawasan yang actionable.`
    };

    const messages = [systemMessage];

    const response = await fetch(`${BASE_URL}/api/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Server response:', errorData);
      throw new Error('Failed to generate insights');
    }

    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
};
