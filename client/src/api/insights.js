const API_KEY = import.meta.env.VITE_API_KEY || "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";
const API_URL = import.meta.env.VITE_API_URL || "https://api.groq.com/openai/v1/chat/completions";

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

    // Prepare the system message
    const systemMessage = {
      role: "system",
      content: `Anda adalah asisten keuangan AI yang menganalisis data berikut:

[DATA KEUANGAN]
• Pendapatan Bulanan: ${monthlyIncome}
• Total Pengeluaran: ${totalExpenses}
• Tabungan Bulanan: ${monthlySavings}
• Rasio Tabungan: ${savingsRatio.toFixed(1)}%

[RINCIAN PENGELUARAN]
${Object.entries(expenses)
  .map(([label, amount]) => `• ${label}: ${amount}`)
  .join('\n')}

[TARGET KEUANGAN]
• Target 1 Tahun: ${target1Year} 
• Target 2 Tahun: ${target2Year} 

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

    const response = await fetch('/.netlify/functions/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        monthlyIncome,
        currentAge,
        retirementAge,
        yearsToRetirement,
        target1Year,
        target2Year,
        expenses,
        totalExpenses,
        monthlySavings,
        yearlySavings,
        savingsRatio
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
};
