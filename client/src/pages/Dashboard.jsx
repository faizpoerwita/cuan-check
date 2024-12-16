import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '../utils/format';
import { getFinancialInsights } from '../api/insights';
import { WhatsappShareButton, WhatsappIcon, TelegramShareButton, TelegramIcon } from 'react-share';
import AnimatedText from '../components/AnimatedText';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        boxHeight: 6,
        padding: 20,
        font: {
          size: 12,
          family: "Inter, sans-serif",
          weight: '500',
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1a1b1e',
      bodyColor: '#1a1b1e',
      borderColor: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      bodyFont: {
        size: 12,
        family: "Inter, sans-serif",
      },
      titleFont: {
        size: 12,
        family: "Inter, sans-serif",
        weight: '600',
      },
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(context.parsed.y);
          }
          return label;
        }
      }
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
          family: "Inter, sans-serif",
          weight: '500',
        },
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.04)',
        drawBorder: false,
      },
      ticks: {
        font: {
          size: 12,
          family: "Inter, sans-serif",
          weight: '500',
        },
        callback: function(value) {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
        }
      },
    },
  },
};

const CurrencyInput = ({ value, onChange, label, className = "" }) => {
  const handleChange = (e) => {
    // Remove non-numeric characters
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(numericValue);
  };

  const formattedValue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('IDR', '').trim();

  return (
    <div>
      <label className="text-sm">{label}</label>
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          Rp
        </span>
        <input
          type="text"
          value={formattedValue}
          onChange={handleChange}
          className={`w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg ${className}`}
          placeholder="0"
        />
      </div>
    </div>
  );
};

const NumberInput = ({ value, onChange, label, min, max, className = "" }) => {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className={`w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg ${className}`}
      />
    </div>
  );
};

const SummaryCard = ({ title, value, trend, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className="glassmorphic rounded-2xl p-6 flex flex-col gap-4"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <span className={`text-sm font-medium ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend >= 0 ? '+' : ''}{trend}%
      </span>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-2xl font-semibold tracking-tight">
        {new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value)}
      </span>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [calculatorData, setCalculatorData] = useState({
    gaji: 0,
    usiaSaatIni: 24,
    targetPensiun: 60,
    targetTabungan1Tahun: 0,
    targetTabungan2Tahun: 0,
    pengeluaranBulanan: [
      { id: '1', label: 'Kost', amount: 1000000 },
      { id: '2', label: 'Makan', amount: 3640000 },
      { id: '3', label: 'Internet', amount: 100000 },
      { id: '4', label: 'Listrik', amount: 100000 },
      { id: '5', label: 'Pacaran', amount: 1000000 },
      { id: '6', label: 'Cukur Rambut', amount: 50000 }
    ]
  });

  const [aiInsights, setAiInsights] = useState({
    loading: false,
    error: null,
    data: null
  });

  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleCopyInsights = async () => {
    try {
      await navigator.clipboard.writeText(aiInsights.data);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getShareableText = () => {
    return `Analisis Keuangan dari Cuan Check:\n\n${aiInsights.data}`;
  };

  // Calculate total monthly expense
  const totalPengeluaran = useMemo(() => {
    return calculatorData.pengeluaranBulanan.reduce((total, item) => total + item.amount, 0);
  }, [calculatorData.pengeluaranBulanan]);

  // Calculate savings and targets
  const calculations = useMemo(() => {
    const monthlyIncome = calculatorData.gaji;
    const monthlyExpense = totalPengeluaran;
    const monthlySavings = monthlyIncome - monthlyExpense;
    const yearlySavings = monthlySavings * 12;
    
    // Calculate time to reach targets
    const timeToTarget1Year = calculatorData.targetTabungan1Tahun / monthlySavings;
    const timeToTarget2Years = calculatorData.targetTabungan2Tahun / monthlySavings;
    
    // Calculate retirement planning
    const yearsToRetirement = calculatorData.targetPensiun - calculatorData.usiaSaatIni;
    const monthsToRetirement = yearsToRetirement * 12;
    
    return {
      monthlyIncome,
      monthlyExpense,
      monthlySavings,
      yearlySavings,
      timeToTarget1Year: Math.ceil(timeToTarget1Year),
      timeToTarget2Years: Math.ceil(timeToTarget2Years),
      yearsToRetirement,
      monthsToRetirement,
      weeklyExpense: monthlyExpense / 4,
      dailyExpense: monthlyExpense / 30,
      savingsPercentage: (monthlySavings / monthlyIncome) * 100,
      expensePercentage: (monthlyExpense / monthlyIncome) * 100
    };
  }, [calculatorData, totalPengeluaran]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (category, value) => {
    if (category.includes('.')) {
      const [parent, child] = category.split('.');
      setCalculatorData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: Number(value)
        }
      }));
    } else {
      setCalculatorData(prev => ({
        ...prev,
        [category]: Number(value)
      }));
    }
  };

  const handleExpenseChange = (id, field, value) => {
    setCalculatorData(prev => ({
      ...prev,
      pengeluaranBulanan: prev.pengeluaranBulanan.map(item => 
        item.id === id 
          ? { ...item, [field]: field === 'amount' ? Number(value) : value }
          : item
      )
    }));
  };

  const addExpense = () => {
    const newId = String(calculatorData.pengeluaranBulanan.length + 1);
    setCalculatorData(prev => ({
      ...prev,
      pengeluaranBulanan: [
        ...prev.pengeluaranBulanan,
        { id: newId, label: 'Pengeluaran Baru', amount: 0 }
      ]
    }));
  };

  const removeExpense = (id) => {
    setCalculatorData(prev => ({
      ...prev,
      pengeluaranBulanan: prev.pengeluaranBulanan.filter(item => item.id !== id)
    }));
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Pemasukan',
        data: [3000000, 3500000, 3200000, 4100000, 3800000, 4500000],
        borderColor: 'rgba(16, 185, 129, 1)', // Emerald
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Pengeluaran',
        data: [2500000, 2800000, 2600000, 3200000, 2900000, 3500000],
        borderColor: 'rgba(239, 68, 68, 1)', // Rose
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderWidth: 2,
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const generateInsights = async () => {
    setAiInsights({ loading: true, data: null, error: null });
    try {
      const result = await getFinancialInsights({
        transactions: calculatorData.pengeluaranBulanan,
        categories: [],
        totalIncome: calculatorData.gaji,
        totalExpenses: totalPengeluaran,
        balance: calculatorData.gaji - totalPengeluaran,
        monthlyData: chartData
      });
      setAiInsights({ 
        loading: false, 
        data: result, 
        error: null 
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      setAiInsights({ 
        loading: false, 
        data: null, 
        error: 'Gagal mendapatkan analisis. Silakan coba lagi.' 
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Pemasukan"
          value={calculations.monthlyIncome}
          trend={calculations.savingsPercentage}
          description="bisa ditabung"
        />
        <SummaryCard
          title="Total Pengeluaran"
          value={calculations.monthlyExpense}
          trend={calculations.expensePercentage}
          description="dari pemasukan"
        />
        <SummaryCard
          title="Sisa untuk Ditabung"
          value={calculations.monthlySavings}
          trend={calculations.yearlySavings}
          description="per tahun"
        />
        <SummaryCard
          title="Target Tabungan"
          value={calculatorData.targetTabungan1Tahun}
          trend={calculations.timeToTarget1Year}
          description="bulan untuk mencapai"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        className="glassmorphic rounded-2xl p-6"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Ringkasan Keuangan</h2>
            <select className="text-sm">
              <option>6 Bulan Terakhir</option>
              <option>3 Bulan Terakhir</option>
              <option>1 Bulan Terakhir</option>
            </select>
          </div>
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        className="glassmorphic rounded-2xl p-6"
      >
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold tracking-tight">Kalkulator Keuangan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informasi Dasar */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Informasi Dasar</h3>
              <div className="space-y-3">
                <CurrencyInput
                  label="Gaji/Bulan"
                  value={calculatorData.gaji}
                  onChange={(value) => handleInputChange('gaji', value)}
                />
                <NumberInput
                  label="Usia Saat Ini"
                  value={calculatorData.usiaSaatIni}
                  onChange={(value) => handleInputChange('usiaSaatIni', value)}
                  min={15}
                  max={100}
                />
                <NumberInput
                  label="Target Usia Pensiun"
                  value={calculatorData.targetPensiun}
                  onChange={(value) => handleInputChange('targetPensiun', value)}
                  min={calculatorData.usiaSaatIni}
                  max={100}
                />
              </div>
            </div>

            {/* Target Tabungan */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Target Tabungan</h3>
              <div className="space-y-3">
                <CurrencyInput
                  label="Target 1 Tahun"
                  value={calculatorData.targetTabungan1Tahun}
                  onChange={(value) => handleInputChange('targetTabungan1Tahun', value)}
                />
                <CurrencyInput
                  label="Target 2 Tahun"
                  value={calculatorData.targetTabungan2Tahun}
                  onChange={(value) => handleInputChange('targetTabungan2Tahun', value)}
                />
              </div>
            </div>

            {/* Pengeluaran Bulanan */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Pengeluaran Bulanan</h3>
                <button
                  onClick={addExpense}
                  className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  + Tambah Pengeluaran
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {calculatorData.pengeluaranBulanan.map((expense) => (
                  <div key={expense.id} className="glassmorphic p-4 rounded-lg relative group">
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={expense.label}
                        onChange={(e) => handleExpenseChange(expense.id, 'label', e.target.value)}
                        className="w-full bg-transparent border-b border-white/20 focus:border-white/40 pb-1 text-sm font-medium outline-none"
                        placeholder="Nama Pengeluaran"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                          Rp
                        </span>
                        <input
                          type="text"
                          value={new Intl.NumberFormat('id-ID').format(expense.amount)}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            handleExpenseChange(expense.id, 'amount', value);
                          }}
                          className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ringkasan Pengeluaran */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-medium">Ringkasan Keuangan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glassmorphic p-4 rounded-lg">
                  <div className="text-sm font-medium">Pengeluaran</div>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Bulanan</span>
                      <span className="text-sm font-medium">{formatCurrency(calculations.monthlyExpense)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mingguan</span>
                      <span className="text-sm font-medium">{formatCurrency(calculations.weeklyExpense)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Harian</span>
                      <span className="text-sm font-medium">{formatCurrency(calculations.dailyExpense)}</span>
                    </div>
                  </div>
                </div>

                <div className="glassmorphic p-4 rounded-lg">
                  <div className="text-sm font-medium">Tabungan</div>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Per Bulan</span>
                      <span className="text-sm font-medium">{formatCurrency(calculations.monthlySavings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Per Tahun</span>
                      <span className="text-sm font-medium">{formatCurrency(calculations.yearlySavings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">% Ditabung</span>
                      <span className="text-sm font-medium">{calculations.savingsPercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="glassmorphic p-4 rounded-lg">
                  <div className="text-sm font-medium">Target</div>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Target 1 Tahun</span>
                      <span className="text-sm font-medium">{calculations.timeToTarget1Year} bulan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Target 2 Tahun</span>
                      <span className="text-sm font-medium">{calculations.timeToTarget2Years} bulan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Waktu Pensiun</span>
                      <span className="text-sm font-medium">{calculations.yearsToRetirement} tahun</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
        className="glassmorphic rounded-2xl p-6"
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">Analisis Keuangan AI</h2>
              <p className="text-sm text-gray-600 mt-1">
                Powered by Llama 3.2 - Analisis dan saran keuangan personal
              </p>
            </div>
            <button
              onClick={generateInsights}
              disabled={aiInsights.loading}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                aiInsights.loading
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {aiInsights.loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Menganalisis Data...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Analisis Keuangan</span>
                </>
              )}
            </button>
          </div>

          {aiInsights.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{aiInsights.error}</span>
              </div>
            </div>
          )}

          {aiInsights.data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-6 overflow-auto max-h-[600px] text-gray-900"
            >
              {/* Copy and Share Bar */}
              <div className="flex items-center justify-between gap-4 mb-8 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-blue-100/50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyInsights}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-white/90 border border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                  >
                    {showCopySuccess ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-serif italic">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span className="font-serif">Salin Analisis</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-indigo-600 font-serif italic">Bagikan:</span>
                  <WhatsappShareButton
                    url={window.location.href}
                    title={getShareableText()}
                    className="transform hover:scale-105 transition-transform duration-200"
                  >
                    <WhatsappIcon size={32} round className="shadow-sm" />
                  </WhatsappShareButton>
                  <TelegramShareButton
                    url={window.location.href}
                    title={getShareableText()}
                    className="transform hover:scale-105 transition-transform duration-200"
                  >
                    <TelegramIcon size={32} round className="shadow-sm" />
                  </TelegramShareButton>
                </div>
              </div>

              <div className="relative mb-8">
                <h3 className="text-2xl font-serif font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent relative z-10">
                  Analisis Keuangan
                </h3>
                <div className="absolute -bottom-4 left-0 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              </div>

              <div className="space-y-6">
                {aiInsights.data.split('\n').map((line, index) => {
                  if (!line.trim()) return null;

                  // Process text with proper styling
                  const processText = (text) => {
                    const segments = [];
                    let currentIndex = 0;

                    // Add text segment
                    const addTextSegment = (endIndex) => {
                      if (endIndex > currentIndex) {
                        segments.push({
                          type: 'text',
                          content: text.slice(currentIndex, endIndex)
                        });
                      }
                    };

                    // Find and process special segments
                    const matches = [
                      ...text.matchAll(/Rp\s*\d+(\.\d{3})*(\,\d+)?/g), // Currency
                      ...text.matchAll(/\d+(\.\d+)?%/g), // Percentages
                      ...text.matchAll(/\b\d+(\.\d+)?\b/g), // Numbers
                    ].sort((a, b) => a.index - b.index);

                    matches.forEach(match => {
                      addTextSegment(match.index);
                      segments.push({
                        type: match[0].includes('Rp') ? 'currency' :
                              match[0].includes('%') ? 'percentage' : 'number',
                        content: match[0]
                      });
                      currentIndex = match.index + match[0].length;
                    });

                    // Add remaining text
                    addTextSegment(text.length);

                    // Render segments with appropriate styling
                    return segments.map((segment, i) => {
                      switch (segment.type) {
                        case 'currency':
                          return (
                            <span key={i} className="text-blue-700 font-semibold bg-blue-50 px-1 rounded">
                              {segment.content}
                            </span>
                          );
                        case 'percentage':
                          const isNegative = segment.content.startsWith('-');
                          return (
                            <span key={i} className={`${
                              isNegative ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'
                            } font-medium px-1 rounded`}>
                              {segment.content}
                            </span>
                          );
                        case 'number':
                          return (
                            <span key={i} className="text-gray-700 font-medium">
                              {segment.content}
                            </span>
                          );
                        default:
                          return <span key={i} className="text-gray-800">{segment.content}</span>;
                      }
                    });
                  };

                  // Main sections (1. 2. 3. etc)
                  if (/^\d+\./.test(line)) {
                    const [number, ...titleParts] = line.split(' ');
                    const title = titleParts.join(' ');
                    
                    return (
                      <div key={index} className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {number} {title}
                        </h3>
                        <div className="h-1 w-24 bg-blue-500 rounded-full"></div>
                      </div>
                    );
                  }

                  // Regular paragraphs
                  return (
                    <p key={index} className="text-gray-800 leading-relaxed">
                      {processText(line)}
                    </p>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-serif italic">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent">
                    Analisis dibuat oleh Cuan Check AI
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          {!aiInsights.data && !aiInsights.error && !aiInsights.loading && (
            <div className="text-center py-12 text-white/60">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-sm">
                Klik tombol "Analisis Keuangan" untuk mendapatkan saran keuangan personal yang disesuaikan dengan kondisi Anda.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
