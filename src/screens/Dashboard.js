import React, { useState } from 'react';
import KpiCard from '../components/KpiCard';
import RevenueExpensesChart from '../components/RevenueExpensesChart';
import CashflowChart from '../components/CashflowChart';
import ExpensePieChart from '../components/ExpensePieChart';
import UpcomingPayments from '../components/UpcomingPayments';
import { TrendingUp, TrendingDown, DollarSign, Target, Building, Menu } from 'lucide-react';

const Dashboard = ({ financialData, animateCards, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const kpis = [
    { title: 'Aylıq Mənfəət', value: `${financialData.kpi.monthlyProfit.toLocaleString()} ₼`, icon: <TrendingUp className="w-6 h-6 text-green-500" />, change: '+12.5%', positive: true },
    { title: 'Nəqd Axını', value: `${financialData.kpi.cashflow.toLocaleString()} ₼`, icon: <DollarSign className="w-6 h-6 text-blue-500" />, change: '+8.2%', positive: true },
    { title: 'Aylıq Xərclər', value: `${financialData.kpi.totalExpenses.toLocaleString()} ₼`, icon: <TrendingDown className="w-6 h-6 text-orange-500" />, change: '+5.1%', positive: false },
    { title: 'Böyümə Dərəcəsi', value: `${financialData.kpi.growthRate}%`, icon: <Target className="w-6 h-6 text-purple-500" />, change: '+2.3%', positive: true }
  ];

  const navItems = [
    { label: 'Ana Səhifə', target: 'dashboard' },
    { label: 'Simulyator', target: 'simulator' },
    { label: 'AI Tövsiyəçi', target: 'ai' },
    { label: 'Planlar', target: 'subscription' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MALİMAX</h1>
          </div>


          <nav className="hidden md:flex space-x-6">
            {navItems.map(item => (
              <button
                key={item.target}
                onClick={() => onNavigate(item.target)}
                className="px-3 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md border border-gray-300"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.target}
                onClick={() => {
                  onNavigate(item.target);
                  setIsMenuOpen(false); 
                }}
                className="w-full text-left px-3 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => <KpiCard key={index} {...kpi} delay={animateCards ? index * 100 : 0} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RevenueExpensesChart data={financialData.monthlyData} />
          <CashflowChart data={financialData.monthlyData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ExpensePieChart data={financialData.expenseBreakdown} />
          <div className="lg:col-span-2">
            <UpcomingPayments payments={financialData.upcomingPayments} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
