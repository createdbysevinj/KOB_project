// Helper function to generate realistic fluctuating data
const generateMonthlyData = (year, baseGelir, baseXerc, growthRate = 0) => {
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];
  let runningBalance = year === 2022 ? 0 : null; // Will be set from previous year
  
  return months.map((month, index) => {
    // Add seasonal variations and random fluctuations
    const seasonalMultiplier = 1 + Math.sin(index * Math.PI / 6) * 0.15;
    const randomVar = 0.85 + Math.random() * 0.3; // ±15% variation
    
    const gelir = Math.round(baseGelir * seasonalMultiplier * randomVar * (1 + growthRate * index / 12));
    const xerc = Math.round(baseXerc * (0.95 + Math.random() * 0.1) * (1 + growthRate * index / 12 * 0.8));
    const profit = gelir - xerc;
    
    runningBalance = runningBalance === null ? profit : runningBalance + profit;
    
    return {
      month,
      year,
      date: `${year}-${String(index + 1).padStart(2, '0')}`,
      gelir,
      xerc,
      profit,
      balance: Math.round(runningBalance)
    };
  });
};

// Generate data for multiple years with realistic growth
const data2022 = generateMonthlyData(2022, 35000, 28000, 0.08);
const data2023 = generateMonthlyData(2023, 45000, 32000, 0.12);
const data2024 = generateMonthlyData(2024, 52000, 38000, 0.10);
const data2025 = generateMonthlyData(2025, 58000, 42000, 0.08).slice(0, 11); // Up to November 2025

// Set correct starting balance for each year
data2023[0].balance = data2022[11].balance + data2023[0].profit;
for (let i = 1; i < data2023.length; i++) {
  data2023[i].balance = data2023[i - 1].balance + data2023[i].profit;
}

data2024[0].balance = data2023[11].balance + data2024[0].profit;
for (let i = 1; i < data2024.length; i++) {
  data2024[i].balance = data2024[i - 1].balance + data2024[i].profit;
}

data2025[0].balance = data2024[11].balance + data2025[0].profit;
for (let i = 1; i < data2025.length; i++) {
  data2025[i].balance = data2025[i - 1].balance + data2025[i].profit;
}

const allMonthlyData = [...data2022, ...data2023, ...data2024, ...data2025];

// Enhanced expense breakdown with more categories
export const mockFinancialData = {
  monthlyData: allMonthlyData,
  
  expenseBreakdown: [
    { name: 'Əməkhaqqı', value: 18500, color: '#8884d8' },
    { name: 'İcarə', value: 9200, color: '#82ca9d' },
    { name: 'Utilities', value: 3400, color: '#ffc658' },
    { name: 'Marketing', value: 8300, color: '#ff7300' },
    { name: 'Təchizat və Materiallar', value: 4500, color: '#00C49F' },
    { name: 'Texnologiya və Proqram', value: 3200, color: '#FF6B9D' },
    { name: 'Sığorta', value: 2800, color: '#C77DFF' },
    { name: 'Nəqliyyat', value: 2100, color: '#38BDF8' },
    { name: 'Peşəkar Xidmətlər', value: 3500, color: '#FB923C' },
    { name: 'Bank Komissiyaları', value: 850, color: '#A78BFA' },
    { name: 'Təmir və Saxlama', value: 1900, color: '#4ADE80' },
    { name: 'Digər', value: 3200, color: '#F472B6' }
  ],
  
  kpi: {
    // Current month (November 2025)
    get monthlyProfit() {
      const currentMonth = allMonthlyData[allMonthlyData.length - 1];
      return currentMonth.profit;
    },
    
    // Current balance
    get cashflow() {
      return allMonthlyData[allMonthlyData.length - 1].balance;
    },
    
    // Current month expenses
    get totalExpenses() {
      const currentMonth = allMonthlyData[allMonthlyData.length - 1];
      return currentMonth.xerc;
    },
    
    // Growth rate comparing last 3 months to previous 3 months
    get growthRate() {
      const recent3 = allMonthlyData.slice(-3);
      const previous3 = allMonthlyData.slice(-6, -3);
      
      const recentAvg = recent3.reduce((sum, m) => sum + m.gelir, 0) / 3;
      const previousAvg = previous3.reduce((sum, m) => sum + m.gelir, 0) / 3;
      
      return Number((((recentAvg - previousAvg) / previousAvg) * 100).toFixed(2));
    },
    
    // Average monthly profit (last 12 months)
    get averageMonthlyProfit() {
      const last12 = allMonthlyData.slice(-12);
      return Math.round(last12.reduce((sum, m) => sum + m.profit, 0) / last12.length);
    },
    
    // Year-to-date revenue (2025)
    get ytdRevenue() {
      const year2025Data = allMonthlyData.filter(m => m.year === 2025);
      return year2025Data.reduce((sum, m) => sum + m.gelir, 0);
    },
    
    // Year-to-date expenses (2025)
    get ytdExpenses() {
      const year2025Data = allMonthlyData.filter(m => m.year === 2025);
      return year2025Data.reduce((sum, m) => sum + m.xerc, 0);
    },
    
    // Profit margin (%)
    get profitMargin() {
      const currentMonth = allMonthlyData[allMonthlyData.length - 1];
      return Number(((currentMonth.profit / currentMonth.gelir) * 100).toFixed(2));
    },
    
    // Total expense breakdown
    get totalExpenseBreakdown() {
      return mockFinancialData.expenseBreakdown.reduce((sum, e) => sum + e.value, 0);
    }
  },
  
  upcomingPayments: [
    { title: 'Əməkhaqqı', amount: 18500, date: '2025-12-01', type: 'expense', category: 'Əmək haqqı' },
    { title: 'Vergi ödənişi', amount: 7200, date: '2025-12-15', type: 'tax', category: 'Vergi' },
    { title: 'İcarə', amount: 9200, date: '2025-12-01', type: 'expense', category: 'İcarə' },
    { title: 'Sığorta ödənişi', amount: 2800, date: '2025-12-10', type: 'insurance', category: 'Sığorta' },
    { title: 'Proqram abunəliyi', amount: 3200, date: '2025-12-05', type: 'subscription', category: 'Texnologiya' },
    { title: 'Marketing kampaniyası', amount: 5000, date: '2025-12-20', type: 'marketing', category: 'Marketing' },
    { title: 'Təchizat sifarişi', amount: 4500, date: '2025-12-18', type: 'expense', category: 'Təchizat' },
    { title: 'Utilities', amount: 3400, date: '2025-12-01', type: 'utility', category: 'Kommunal' }
  ],
  
  // Helper methods to filter data
  getDataByYear: (year) => allMonthlyData.filter(m => m.year === year),
  getDataByDateRange: (startDate, endDate) => {
    return allMonthlyData.filter(m => m.date >= startDate && m.date <= endDate);
  },
  getYearlyTotals: () => {
    const years = [2022, 2023, 2024, 2025];
    return years.map(year => {
      const yearData = allMonthlyData.filter(m => m.year === year);
      return {
        year,
        totalGelir: yearData.reduce((sum, m) => sum + m.gelir, 0),
        totalXerc: yearData.reduce((sum, m) => sum + m.xerc, 0),
        totalProfit: yearData.reduce((sum, m) => sum + m.profit, 0),
        endBalance: yearData[yearData.length - 1]?.balance || 0,
        monthsCount: yearData.length
      };
    });
  }
};
