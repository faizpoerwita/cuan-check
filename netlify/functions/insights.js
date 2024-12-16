const fetch = require('node-fetch');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

exports.handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Validate API key
    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set');
      throw new Error('API key not configured');
    }

    // Parse and validate request body
    let data;
    try {
      data = JSON.parse(event.body);
      if (!data.messages || !Array.isArray(data.messages)) {
        throw new Error('Invalid request body: messages array is required');
      }
    } catch (e) {
      console.error('Error parsing request body:', e);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request body' })
      };
    }

    console.log('Making request to Groq API...');
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: data.messages,
        model: "llama2-70b-4096",
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 1,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API error:', error);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to generate insights',
          details: error.error?.message || 'Unknown error'
        })
      };
    }

    const result = await response.json();
    console.log('Received response from Groq API');

    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      throw new Error('Invalid response from Groq API');
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
        return `Rp ${new Intl.NumberFormat('id-ID').format(parseInt(match))}`;
      })
      .replace(/(\d+(?:[.,]\d+)?)\s*%/g, match => {
        const num = parseFloat(match.replace(/[^\d.-]/g, '.'));
        return `${num.toFixed(1).replace('.', ',').replace(/\s+/g, '')}%`;
      })
      .replace(/(\b\d[\d\.,]*\b)\s+\1/g, '$1');

    // Add formatting and spacing
    const formattedContent = `${content.trim()}

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
      headers,
      body: JSON.stringify({ data: formattedContent })
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
