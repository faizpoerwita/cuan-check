import { formatCurrency, formatPercentage, formatNumber } from './format';

/**
 * Extract financial metrics from text
 * @param {Object} data - JSON data
 * @returns {Object} Extracted metrics
 */
export const extractFinancialMetrics = (data) => {
  if (!data || typeof data !== 'object') {
    return {
      healthScore: 0,
      riskLevel: 'high',
      expenses: [],
      recommendations: [],
      totalExpense: 0,
      deficit: 0
    };
  }

  const metrics = {
    healthScore: data.status?.healthScore || 0,
    riskLevel: data.risk?.level || 'high',
    expenses: data.expenses?.breakdown || [],
    recommendations: data.recommendations || [],
    totalExpense: data.status?.totalExpenses || 0,
    deficit: data.status?.condition === 'deficit' ? Math.abs(data.status?.monthlySavings || 0) : 0,
    monthlySavings: data.status?.monthlySavings || 0,
    savingsPercentage: data.status?.savingsPercentage || 0,
    monthlyIncome: data.status?.monthlyIncome || 0,
    summary: data.summary || {},
    actionPlan: data.actionPlan || []
  };

  return metrics;
};

/**
 * Process text content with enhanced formatting
 * @param {string} text - Text to process
 * @returns {Object[]} Processed segments with metadata
 */
export const processContent = (text) => {
  const sections = [];
  let currentSection = null;

  text.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Detect section headers
    if (trimmedLine.match(/^[0-9]+\./)) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        type: 'section',
        title: trimmedLine,
        content: [],
        metrics: {}
      };
    } else if (currentSection) {
      // Process line content
      const processedLine = {
        type: 'content',
        segments: processSegments(trimmedLine),
        style: getLineStyle(trimmedLine)
      };
      currentSection.content.push(processedLine);
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
};

/**
 * Process text segments with enhanced pattern matching
 * @param {string} text - Text to process
 * @returns {Object[]} Processed segments
 */
const processSegments = (text) => {
  const patterns = [
    {
      type: 'currency',
      pattern: /Rp\s*\d+(?:\.\d{3})*(?:,\d+)?/g,
      format: (match) => ({
        original: match,
        value: parseFloat(match.replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.')),
        formatted: match
      })
    },
    {
      type: 'percentage',
      pattern: /\d+(?:[,.]\d+)?%/g,
      format: (match) => ({
        original: match,
        value: parseFloat(match.replace(/[%,]/g, '.')),
        formatted: formatPercentage(parseFloat(match))
      })
    },
    {
      type: 'emphasis',
      pattern: /\*\*(.*?)\*\*/g,
      format: (match, group) => ({
        original: match,
        value: group,
        formatted: group
      })
    }
  ];

  const segments = [];
  let lastIndex = 0;

  patterns.forEach(({ type, pattern, format }) => {
    const matches = Array.from(text.matchAll(pattern));
    matches.forEach(match => {
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }
      segments.push({
        type,
        ...format(match[0], match[1])
      });
      lastIndex = match.index + match[0].length;
    });
  });

  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex)
    });
  }

  return segments;
};

/**
 * Get styling information for a line of text
 * @param {string} text - Text to analyze
 * @returns {Object} Style information
 */
const getLineStyle = (text) => {
  const style = {
    isWarning: false,
    isSuccess: false,
    indent: 0,
    isBullet: false
  };

  // Check for warning indicators
  if (text.match(/(?:warning|perhatian|risiko|defisit|kritis)/i)) {
    style.isWarning = true;
  }

  // Check for success indicators
  if (text.match(/(?:success|berhasil|surplus|optimal|baik)/i)) {
    style.isSuccess = true;
  }

  // Check for bullet points and indentation
  const indentMatch = text.match(/^(\s*)([-•*]|\d+\.)\s/);
  if (indentMatch) {
    style.indent = indentMatch[1].length;
    style.isBullet = true;
  }

  return style;
};

/**
 * Process insights data
 * @param {Object} data - Insights data
 * @returns {Object} Processed insights
 */
export const processInsights = (data) => {
  const metrics = extractFinancialMetrics(data);
  
  return {
    metrics,
    visualizations: generateVisualizationData(metrics),
    summary: {
      status: data.summary?.indonesian || '',
      health: data.summary?.overallHealth || '',
      recommendations: data.recommendations?.map(rec => ({
        category: rec.category,
        action: rec.action,
        potentialSavings: rec.potentialSavings
      })) || [],
      actionPlan: data.actionPlan?.map(plan => ({
        step: plan.step,
        action: plan.action,
        priority: plan.priority
      })) || []
    }
  };
};

/**
 * Generate visualization data from financial metrics
 * @param {Object} metrics - Extracted metrics
 * @returns {Object} Visualization configurations
 */
export const generateVisualizationData = (metrics) => {
  // Color palettes
  const colors = {
    blue: ['#1E40AF', '#3B82F6', '#93C5FD', '#BFDBFE', '#DBEAFE'],
    green: ['#059669', '#10B981', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
    red: ['#DC2626', '#EF4444', '#FCA5A5', '#FECACA', '#FEE2E2'],
    yellow: ['#D97706', '#F59E0B', '#FCD34D', '#FDE68A', '#FEF3C7']
  };

  const colorPalette = metrics.healthScore >= 66 ? colors.green :
                      metrics.healthScore >= 33 ? colors.yellow : colors.red;

  const expenseData = metrics.expenses.map(expense => ({
    label: expense.category,
    value: expense.amount,
    percentage: expense.percentage
  }));

  const savingsData = [
    { label: 'Tabungan', value: metrics.monthlySavings },
    { label: 'Pengeluaran', value: metrics.totalExpense }
  ];

  return {
    expenses: {
      type: 'doughnut',
      data: {
        labels: expenseData.map(d => d.label),
        datasets: [{
          data: expenseData.map(d => d.value),
          backgroundColor: expenseData.map((_, i) => colorPalette[i % colorPalette.length]),
          borderColor: '#ffffff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const percentage = (value / metrics.totalExpense * 100).toFixed(1);
                return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
              }
            }
          }
        }
      }
    },
    savings: {
      type: 'pie',
      data: {
        labels: savingsData.map(d => d.label),
        datasets: [{
          data: savingsData.map(d => d.value),
          backgroundColor: [colors.green[0], colors.blue[0]],
          borderColor: '#ffffff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const total = savingsData.reduce((sum, d) => sum + d.value, 0);
                const percentage = (value / total * 100).toFixed(1);
                return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
              }
            }
          }
        }
      }
    },
    health: {
      score: metrics.healthScore,
      level: metrics.riskLevel
    },
    recommendations: {
      type: 'bar',
      data: {
        labels: metrics.recommendations.map(r => r.category),
        datasets: [{
          label: 'Potensi Penghematan',
          data: metrics.recommendations.map(r => r.potentialSavings),
          backgroundColor: colorPalette[0],
          borderColor: colorPalette[1],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Potensi Penghematan: ${formatCurrency(context.raw)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              callback: value => formatCurrency(value),
              font: {
                size: 11,
                family: 'Inter, system-ui, sans-serif'
              }
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11,
                family: 'Inter, system-ui, sans-serif'
              }
            }
          }
        }
      }
    }
  };
};

/**
 * Calculate health score
 * @param {Object} metrics - Financial metrics
 * @returns {number} Health score
 */
export const calculateHealthScore = (metrics) => {
  const {
    monthlySavings,
    savingsPercentage,
    expenseBreakdown
  } = metrics;

  let score = 100;

  // Penalize negative savings
  if (monthlySavings < 0) {
    score -= 30;
  }

  // Evaluate savings percentage
  if (savingsPercentage < 20) {
    score -= 20;
  } else if (savingsPercentage < 10) {
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
};
