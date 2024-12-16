import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

app.post('/api/insights', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: req.body.messages,
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

    const data = await response.json();
    console.log('Groq API response:', data);
    
    // Helper functions for formatting
    function formatCurrency(amount) {
      return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
    }

    function formatPercentage(value) {
      // Convert to fixed decimal and replace dot with comma, remove any extra spaces
      return value.toFixed(1).replace('.', ',').replace(/\s+/g, '') + '%';
    }

    // Clean and format the response
    let content = data.choices[0].message.content;
    
    // Initial cleanup
    content = content
      .replace(/```[a-z]*\n/g, '')
      .replace(/```/g, '')
      .replace(/\[code\]/g, '')
      .replace(/\[\/code\]/g, '')
      .replace(/<[^>]+>/g, '')
      .trim();

    // First pass: Format all numbers
    content = content
      // Remove duplicate numbers after currency amounts
      .replace(/(\bRp\s*\d[\d\.,]*)\s+\d[\d\.,]*/g, '$1')
      // Format standalone numbers that should be currency
      .replace(/\b(\d{4,})\b(?!\s*%|\s*\d)/g, match => {
        if (match.length === 4 && parseInt(match) >= 1900 && parseInt(match) <= 2100) {
          return match; // Skip years
        }
        return formatCurrency(parseInt(match));
      })
      // Format percentages (including those with decimals)
      .replace(/(\d+(?:[.,]\d+)?)\s*%/g, match => {
        const num = parseFloat(match.replace(/[^\d.-]/g, '.'));
        return formatPercentage(num);
      })
      // Remove any remaining duplicate numbers
      .replace(/(\b\d[\d\.,]*\b)\s+\1/g, '$1');

    // Second pass: Clean up any remaining formatting issues
    content = content
      // Fix spaces in percentages
      .replace(/(\d+)\s+([.,])\s*(\d+%)/g, '$1$2$3')
      // Ensure comma as decimal separator
      .replace(/(\d+)\.(\d+%)/g, '$1,$2')
      // Clean up any remaining duplicate numbers in parentheses
      .replace(/\(([^)]+)\)/g, (_, group) => {
        return '(' + group.replace(/(\b\d[\d\.,]*\b)\s+\1/g, '$1') + ')';
      });

    // Format sections and headers
    content = content
      // Main header
      .replace(/\[([^\]]+)\]/g, (_, title) => `
${title.toUpperCase()}
──────────────────────────
`)
      // Sub-sections
      .replace(/^# (.*$)/gm, '\n$1\n')
      .replace(/^## (.*$)/gm, '\n$1\n')
      
      // Lists and bullet points
      .replace(/^- /gm, '• ')
      .replace(/^  - /gm, '  • ')
      
      // Status indicators
      .replace(/Status kesehatan keuangan:/g, 'Status Kesehatan Keuangan')
      .replace(/Kekuatan:/g, 'Kekuatan')
      .replace(/Kelemahan:/g, 'Kelemahan')
      .replace(/Rekomendasi:/g, 'Rekomendasi')
      
      // Format status badges
      .replace(/SEHAT/g, '● SEHAT')
      .replace(/PERHATIAN/g, '● PERHATIAN')
      .replace(/KRITIS/g, '● KRITIS')
      
      // Format expense categories
      .replace(/Pengeluaran Bulanan:/g, 'PENGELUARAN BULANAN')
      .replace(/Ringkasan Keuangan:/g, 'RINGKASAN KEUANGAN');

    // Add minimal footer
    const currentDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    content = `${content.trim()}

──────────────────────────
${currentDate}
Powered by Cuan Check AI`;

    // Final formatting and spacing
    content = content
      .replace(/\n{3,}/g, '\n\n')
      .split('\n')
      .map(line => {
        // Add spacing for status indicators
        if (line.startsWith('●')) return `\n${line}`;
        // Indent list items
        if (line.startsWith('•')) return `  ${line}`;
        // Add spacing after currency values
        if (line.match(/Rp\s*[\d\.,]+/)) return `${line}\n`;
        return line;
      })
      .join('\n')
      .trim();

    // Send the formatted content back to the client
    res.json({ data: content });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
