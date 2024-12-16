import fetch from 'node-fetch';

const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const handler = async (event) => {
  // Enable CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('Received request:', data);

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: data.messages,
        model: "llama3-groq-70b-8192-tool-use-preview",
        temperature: 0.8,
        max_tokens: 8192,
        top_p: 1,
        presence_penalty: 0.2,
        frequency_penalty: 0.3,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API error:', error);
      throw new Error(error.error?.message || 'Failed to generate insights');
    }

    const result = await response.json();
    console.log('Groq API response:', result);

    // Helper functions for formatting
    function formatCurrency(amount) {
      return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
    }

    function formatPercentage(value) {
      return value.toFixed(1).replace('.', ',').replace(/\s+/g, '') + '%';
    }

    // Clean and format the response
    let content = result.choices[0].message.content;
    
    // Initial cleanup
    content = content
      .replace(/```[a-z]*\n/g, '')
      .replace(/```/g, '')
      .replace(/\[code\]/g, '')
      .replace(/\[\/code\]/g, '')
      .replace(/<[^>]+>/g, '')
      .trim();

    // Format numbers and text
    content = content
      .replace(/(\bRp\s*\d[\d\.,]*)\s+\d[\d\.,]*/g, '$1')
      .replace(/\b(\d{4,})\b(?!\s*%|\s*\d)/g, match => {
        if (match.length === 4 && parseInt(match) >= 1900 && parseInt(match) <= 2100) {
          return match;
        }
        return formatCurrency(parseInt(match));
      })
      .replace(/(\d+(?:[.,]\d+)?)\s*%/g, match => {
        const num = parseFloat(match.replace(/[^\d.-]/g, '.'));
        return formatPercentage(num);
      })
      .replace(/(\b\d[\d\.,]*\b)\s+\1/g, '$1');

    // Add formatting and spacing
    content = `${content.trim()}

──────────────────────────
${new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}
Powered by Cuan Check AI`;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: content })
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
