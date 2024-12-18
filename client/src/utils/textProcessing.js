import { formatCurrency, formatPercentage, formatNumber } from './format';

/**
 * Clean and normalize text content
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
const cleanText = (text) => {
  return text
    .replace(/\s+/g, ' ')  // normalize whitespace
    .replace(/(\d),(\d)/g, '$1.$2')  // normalize decimal separator
    .trim();
};

/**
 * Process numerical values in text while avoiding duplication
 * @param {string} text - Text to process
 * @returns {Object[]} Array of processed segments
 */
export const processTextSegments = (text) => {
  const cleanedText = cleanText(text);
  const segments = [];
  const processedValues = new Set();
  let currentIndex = 0;

  // Patterns for different types of values
  const patterns = [
    {
      type: 'currency',
      regex: /Rp\s*\d+(?:\.\d{3})*(?:,\d+)?/g,
      process: (match) => {
        const numStr = match.replace(/[^\d,]/g, '');
        const num = parseFloat(numStr.replace(/\./g, '').replace(',', '.'));
        return formatCurrency(num);
      }
    },
    {
      type: 'percentage',
      regex: /\d+(?:[,.]\d+)?%/g,
      process: (match) => {
        const num = parseFloat(match.replace(/[%,]/g, '.'));
        return formatPercentage(num);
      }
    },
    {
      type: 'number',
      // Exclude numbers that are part of currency, percentages, or time units
      regex: /\b\d+(?:\.\d+)?\b(?!\s*(?:%|tahun|bulan|hari|Rp))/g,
      process: (match) => formatNumber(parseFloat(match.replace(/\./g, '')))
    }
  ];

  // Find all matches for all patterns
  const allMatches = patterns.flatMap(pattern => {
    const matches = Array.from(cleanedText.matchAll(pattern.regex));
    return matches.map(match => ({
      type: pattern.type,
      value: match[0],
      processedValue: pattern.process(match[0]),
      index: match.index,
      length: match[0].length
    }));
  }).sort((a, b) => a.index - b.index);

  // Process matches while avoiding duplicates
  allMatches.forEach(match => {
    if (currentIndex > match.index) return;
    if (processedValues.has(match.value)) return;

    // Add text before the match
    if (match.index > currentIndex) {
      segments.push({
        type: 'text',
        content: cleanedText.slice(currentIndex, match.index)
      });
    }

    // Add the processed value
    segments.push({
      type: match.type,
      content: match.processedValue,
      originalValue: match.value
    });

    processedValues.add(match.value);
    currentIndex = match.index + match.length;
  });

  // Add remaining text
  if (currentIndex < cleanedText.length) {
    segments.push({
      type: 'text',
      content: cleanedText.slice(currentIndex)
    });
  }

  return segments;
};

/**
 * Process markdown-style text formatting
 * @param {string} text - Text to process
 * @returns {Object} Processed text with formatting information
 */
export const processMarkdownFormatting = (text) => {
  // Check for different types of formatting
  const isHeading = text.match(/^#{1,6}\s/);
  const isBold = text.match(/\*\*(.*?)\*\*/g);
  const isListItem = text.match(/^[-*]\s/);
  const isNumberedItem = text.match(/^\d+\.\s/);

  return {
    type: isHeading ? 'heading' :
          isBold ? 'bold' :
          isListItem ? 'listItem' :
          isNumberedItem ? 'numberedItem' : 'text',
    level: isHeading ? isHeading[0].trim().length : 0,
    content: text.replace(/^#{1,6}\s/, '')
              .replace(/^\d+\.\s/, '')
              .replace(/^[-*]\s/, '')
              .replace(/\*\*(.*?)\*\*/g, '$1')
  };
};

/**
 * Get appropriate CSS classes for text segments
 * @param {string} type - Type of segment
 * @returns {string} CSS classes
 */
export const getSegmentClasses = (type) => {
  const baseClasses = {
    currency: 'font-medium text-emerald-600',
    percentage: 'font-medium text-blue-600',
    number: 'font-medium text-gray-700',
    text: 'text-gray-600',
    heading: 'text-xl font-semibold text-gray-800',
    bold: 'font-semibold text-gray-800',
    listItem: 'text-gray-600',
    numberedItem: 'text-gray-600'
  };

  return baseClasses[type] || baseClasses.text;
};
