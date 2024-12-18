const axios = require('axios');
require('dotenv').config();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function getAIInsights(financialData) {
  try {
    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set in environment variables');
      throw new Error('API key configuration error');
    }

    console.log('Environment check:', {
      hasGroqKey: !!GROQ_API_KEY,
      envVars: Object.keys(process.env)
    });

    console.log('Fetching AI insights for:', JSON.stringify(financialData, null, 2));
    
    const systemMessage = {
      role: "system",
      content: `Anda adalah asisten keuangan AI yang menganalisis data berikut:

[DATA KEUANGAN]
• Pendapatan Bulanan: Rp ${financialData.monthlyIncome.toLocaleString('id-ID')}
• Total Pengeluaran: Rp ${financialData.totalExpenses.toLocaleString('id-ID')}
• Tabungan Bulanan: Rp ${financialData.monthlySavings.toLocaleString('id-ID')}
• Rasio Tabungan: ${financialData.savingsPercentage.toFixed(1)}%
• Skor Kesehatan Keuangan: ${financialData.healthScore}/100
• Kategori Pengeluaran Terbesar: ${financialData.topExpenseCategory} (${financialData.topExpensePercentage.toFixed(1)}%)

Berikan analisis dalam format berikut (gunakan ### sebagai pemisah setiap bagian):

### Prioritas Utama
[berikan prioritas utama yang harus dilakukan berdasarkan kondisi keuangan saat ini]

### Analisis Kesehatan Keuangan
[berikan analisis mendalam tentang kesehatan keuangan, termasuk kekuatan dan kelemahan]

### Rekomendasi Spesifik
[berikan minimal 3 rekomendasi spesifik dan terukur untuk perbaikan]

### Langkah Selanjutnya
[berikan langkah-langkah konkret yang harus diambil dalam 30 hari ke depan]

Berikan analisis yang praktis dan dapat diterapkan langsung.`
    };

    console.log('Sending request to Groq API...');
    
    try {
      const response = await axios.post(GROQ_API_URL, {
        model: "llama-3.3-70b-versatile",
        messages: [systemMessage],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9,
        frequency_penalty: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Groq API Response Status:', response.status);
      
      if (!response.data?.choices?.[0]?.message?.content) {
        console.error('Invalid Groq API response:', response.data);
        throw new Error('Invalid API response format');
      }

      const aiResponse = response.data.choices[0].message.content;
      console.log('AI Response:', aiResponse);

      // Parse sections using the ### delimiter
      const sections = aiResponse.split('###').reduce((acc, section) => {
        const trimmedSection = section.trim();
        if (!trimmedSection) return acc;
        
        const [title, ...content] = trimmedSection.split('\n');
        const key = title.trim().toLowerCase().replace(/\s+/g, '');
        acc[key] = content.join('\n').trim();
        return acc;
      }, {});

      // Ensure all required sections exist
      const defaultSections = {
        prioritasutama: 'Belum ada prioritas yang ditetapkan.',
        analisiskesehatan: 'Belum ada analisis kesehatan keuangan.',
        rekomendasispesifik: 'Belum ada rekomendasi spesifik.',
        langkahselanjutnya: 'Belum ada langkah selanjutnya yang ditetapkan.'
      };

      // Merge parsed sections with defaults
      return {
        ...defaultSections,
        ...sections
      };
    } catch (apiError) {
      console.error('Groq API Error:', {
        status: apiError.response?.status,
        data: apiError.response?.data,
        message: apiError.message
      });
      throw new Error(`Groq API error: ${apiError.message}`);
    }
  } catch (error) {
    console.error('Error in getAIInsights:', error);
    throw error;
  }
}

function calculateHealthScore(data) {
  let score = 70; // Base score
  
  // Adjust for savings ratio
  if (data.savingsPercentage >= 30) {
    score += 15;
  } else if (data.savingsPercentage >= 20) {
    score += 10;
  } else if (data.savingsPercentage >= 10) {
    score += 5;
  } else if (data.savingsPercentage < 0) {
    score -= 20;
  }
  
  // Adjust for expense distribution
  const highestExpensePercentage = data.expenseBreakdown[0]?.percentage || 0;
  if (highestExpensePercentage > 50) {
    score -= 15;
  } else if (highestExpensePercentage > 40) {
    score -= 10;
  } else if (highestExpensePercentage > 30) {
    score -= 5;
  }
  
  // Adjust for negative savings
  if (data.monthlySavings < 0) {
    score -= 10;
  }
  
  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
}

exports.handler = async function (event, context) {
  console.log('Function environment:', {
    nodeEnv: process.env.NODE_ENV,
    hasGroqKey: !!process.env.GROQ_API_KEY,
    envVars: Object.keys(process.env)
  });

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Successful preflight call.' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    if (!event.body) {
      throw new Error('Request body is empty');
    }

    console.log('Raw request body:', event.body);
    const requestBody = JSON.parse(event.body);
    console.log('Parsed request body:', JSON.stringify(requestBody, null, 2));

    const { currentAge, expenses, income, retirementAge, target1Year, target2Year } = requestBody;

    if (!income) {
      throw new Error('Missing required field: income');
    }

    if (!expenses || typeof expenses !== 'object') {
      throw new Error('Missing or invalid expenses object');
    }

    // Calculate basic metrics
    const totalExpenses = Object.entries(expenses).reduce((sum, [_, amount]) => sum + Number(amount || 0), 0);
    const monthlySavings = income - totalExpenses;
    const savingsPercentage = income > 0 ? (monthlySavings / income) * 100 : 0;

    console.log('Calculated metrics:', {
      totalExpenses,
      monthlySavings,
      savingsPercentage
    });

    // Process expense breakdown
    const expenseBreakdown = Object.entries(expenses)
      .map(([category, amount]) => ({
        category,
        amount: Number(amount || 0),
        percentage: (Number(amount || 0) / totalExpenses) * 100
      }))
      .sort((a, b) => b.amount - a.amount);

    // Calculate health score
    const healthScore = calculateHealthScore({
      monthlySavings,
      savingsPercentage,
      expenseBreakdown
    });

    // Get AI insights
    const financialMetrics = {
      monthlyIncome: income,
      totalExpenses,
      monthlySavings,
      savingsPercentage,
      healthScore,
      topExpenseCategory: expenseBreakdown[0]?.category || 'Tidak ada data',
      topExpensePercentage: expenseBreakdown[0]?.percentage || 0
    };

    console.log('Sending metrics to AI:', JSON.stringify(financialMetrics, null, 2));
    const aiAnalysis = await getAIInsights(financialMetrics);

    // Create response
    const responseData = {
      status: {
        condition: monthlySavings >= 0 ? 'surplus' : 'deficit',
        monthlyIncome: Number(income),
        totalExpenses: totalExpenses,
        monthlySavings: monthlySavings,
        savingsPercentage: Number(savingsPercentage.toFixed(1)),
        healthScore: healthScore
      },
      expenses: {
        breakdown: expenseBreakdown,
        topExpenseCategory: expenseBreakdown[0]?.category || '',
        topExpensePercentage: Number((expenseBreakdown[0]?.percentage || 0).toFixed(1))
      },
      risk: {
        level: healthScore > 80 ? 'low' : healthScore > 60 ? 'medium' : 'high',
        factors: [
          {
            type: 'savings',
            description: monthlySavings < 0 ? 'Pengeluaran melebihi pendapatan' : 'Memiliki tabungan positif',
            severity: monthlySavings < 0 ? 'high' : savingsPercentage < 20 ? 'medium' : 'low'
          },
          {
            type: 'expenses',
            description: expenseBreakdown[0]?.percentage > 50 ? 'Pengeluaran terbesar terlalu tinggi' : 'Distribusi pengeluaran cukup baik',
            severity: expenseBreakdown[0]?.percentage > 50 ? 'high' : expenseBreakdown[0]?.percentage > 30 ? 'medium' : 'low'
          }
        ]
      },
      recommendations: expenseBreakdown
        .filter(expense => expense.percentage > 30)
        .map(expense => ({
          category: expense.category,
          currentAmount: expense.amount,
          currentPercentage: Number(expense.percentage.toFixed(1)),
          targetReduction: Number(((expense.percentage - 30) / 2).toFixed(1)),
          potentialSavings: Number((expense.amount * ((expense.percentage - 30) / 200)).toFixed(0))
        })),
      aiAnalysis,
      summary: {
        indonesian: `Status keuangan ${monthlySavings >= 0 ? 'surplus' : 'defisit'} dengan rasio tabungan ${savingsPercentage.toFixed(1)}%`,
        overallHealth: healthScore > 80 ? 'baik' : healthScore > 60 ? 'cukup' : 'perlu perbaikan'
      }
    };

    console.log('Sending response:', JSON.stringify(responseData, null, 2));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error('Error processing request:', error);
    console.error('Error stack:', error.stack);
    
    const errorResponse = {
      error: error.message || 'Internal server error',
      details: error.stack,
      type: error.name,
      response: error.response?.data
    };

    console.log('Error response:', JSON.stringify(errorResponse, null, 2));

    return {
      statusCode: error.response?.status || 500,
      headers: corsHeaders,
      body: JSON.stringify(errorResponse)
    };
  }
};
