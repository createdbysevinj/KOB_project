import React, { useState, createContext, useContext, useReducer, useMemo } from 'react';
import { Brain, Target, TrendingUp, AlertCircle, Lightbulb, CheckCircle, Clock, DollarSign, BarChart3, PieChart } from 'lucide-react';

// Financial Context (same as previous components)
const ACTIONS = {
  SET_MONTHLY_DATA: 'SET_MONTHLY_DATA',
  ADD_MONTH_DATA: 'ADD_MONTH_DATA',
  UPDATE_MONTH_DATA: 'UPDATE_MONTH_DATA',
  SET_EXPENSE_CATEGORIES: 'SET_EXPENSE_CATEGORIES',
  SET_USER_INFO: 'SET_USER_INFO',
  RESET_DATA: 'RESET_DATA'
};

const initialState = {
  user: null,
  monthlyData: [
    { month: 'Yan', gelir: 43400, xerc: 32000, date: '2025-01' },
    { month: 'Fev', gelir: 52000, xerc: 35000, date: '2025-02' },
    { month: 'Mar', gelir: 48000, xerc: 31000, date: '2025-03' },
    { month: 'Apr', gelir: 58000, xerc: 38000, date: '2025-04' },
    { month: 'May', gelir: 62000, xerc: 42000, date: '2025-05' },
    { month: 'İyn', gelir: 55000, xerc: 39000, date: '2025-06' },
    { month: 'İyl', gelir: 60000, xerc: 40000, date: '2025-07' },
    { month: 'Avq', gelir: 61000, xerc: 45000, date: '2025-08' },
    { month: 'Sen', gelir: 56000, xerc: 48000, date: '2025-09' },
    { month: 'Okt', gelir: 62000, xerc: 50000, date: '2025-10' },
    { month: 'Noy', gelir: 70000, xerc: 52000, date: '2025-11' },
    { month: 'Dek', gelir: 59000, xerc: 51000, date: '2025-12' }
  ],
  expenseCategories: [
    { name: 'Əməkhaqqı', percentage: 38.5, color: '#8884d8' },
    { name: 'İcarə', percentage: 20.5, color: '#82ca9d' },
    { name: 'Utilities', percentage: 7.7, color: '#ffc658' },
    { name: 'Marketing', percentage: 17.9, color: '#ff7300' },
    { name: 'Digər', percentage: 15.4, color: '#00ff88' }
  ]
};

const financialReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_MONTHLY_DATA:
      return { ...state, monthlyData: action.payload };
    case ACTIONS.ADD_MONTH_DATA:
      return { ...state, monthlyData: [...state.monthlyData, action.payload] };
    case ACTIONS.UPDATE_MONTH_DATA:
      return {
        ...state,
        monthlyData: state.monthlyData.map(month =>
          month.date === action.payload.date ? { ...month, ...action.payload } : month
        )
      };
    case ACTIONS.SET_EXPENSE_CATEGORIES:
      return { ...state, expenseCategories: action.payload };
    case ACTIONS.SET_USER_INFO:
      return { ...state, user: action.payload };
    case ACTIONS.RESET_DATA:
      return initialState;
    default:
      return state;
  }
};

const FinancialContext = createContext();

const FinancialProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  const calculations = useMemo(() => {
    const { monthlyData, expenseCategories } = state;
    
    let runningBalance = 0;
    const monthlyDataWithBalance = monthlyData.map(month => {
      const profit = month.gelir - month.xerc;
      runningBalance += profit;
      return { ...month, profit, balance: runningBalance };
    });

    const currentMonth = monthlyDataWithBalance[monthlyDataWithBalance.length - 1];
    const previousMonth = monthlyDataWithBalance[monthlyDataWithBalance.length - 2];
    
    const monthlyProfit = currentMonth ? currentMonth.profit : 0;
    const cashflow = currentMonth ? currentMonth.balance : 0;
    const totalExpenses = currentMonth ? currentMonth.xerc : 0;
    
    const growthRate = previousMonth && currentMonth 
      ? ((currentMonth.gelir - previousMonth.gelir) / previousMonth.gelir) * 100
      : 0;

    const expenseBreakdown = expenseCategories.map(category => ({
      ...category,
      value: Math.round((totalExpenses * category.percentage) / 100)
    }));

    const lastThreeMonths = monthlyDataWithBalance.slice(-3);
    const avgRevenue = lastThreeMonths.reduce((sum, month) => sum + month.gelir, 0) / lastThreeMonths.length;
    const avgExpenses = lastThreeMonths.reduce((sum, month) => sum + month.xerc, 0) / lastThreeMonths.length;
    const avgProfit = avgRevenue - avgExpenses;

    // Calculate expense efficiency
    const expenseToRevenueRatio = avgExpenses / avgRevenue;
    const profitMargin = (avgProfit / avgRevenue) * 100;

    return {
      monthlyDataWithBalance,
      kpi: { monthlyProfit, cashflow, totalExpenses, growthRate },
      expenseBreakdown,
      trends: { avgRevenue, avgExpenses, avgProfit, expenseToRevenueRatio, profitMargin }
    };
  }, [state.monthlyData, state.expenseCategories]);

  return (
    <FinancialContext.Provider value={{ state, dispatch, calculations, actions: ACTIONS }}>
      {children}
    </FinancialContext.Provider>
  );
};

const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

// AI Recommendation Card Component
export const AIRecommendationCard = ({ recommendation, onImplement, onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState('pending'); // pending, implemented, dismissed

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Yüksək': return 'bg-red-100 text-red-700 border-red-200';
      case 'Orta': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Aşağı': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'implemented': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'dismissed': return <Clock className="w-5 h-5 text-gray-400" />;
      default: return recommendation.icon;
    }
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-300 ${
      status === 'implemented' ? 'border-green-200 bg-green-50' :
      status === 'dismissed' ? 'border-gray-200 bg-gray-50' :
      'border-gray-200 hover:border-blue-300 hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            status === 'implemented' ? 'bg-green-100' :
            status === 'dismissed' ? 'bg-gray-100' :
            'bg-gray-50'
          }`}>
            {getStatusIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(recommendation.priority)}`}>
              {recommendation.priority} prioritet
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{recommendation.description}</p>
      
      {/* Potential Impact */}
      {(recommendation.savings || recommendation.potential) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          {recommendation.savings && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">Potensial qənaət:</span>
              <span className="font-semibold text-blue-800">{recommendation.savings.toLocaleString()} ₼/ay</span>
            </div>
          )}
          {recommendation.potential && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">Potensial gəlir artımı:</span>
              <span className="font-semibold text-blue-800">+{recommendation.potential.toLocaleString()} ₼/ay</span>
            </div>
          )}
        </div>
      )}

      {/* Detailed Steps - Expandable */}
      {recommendation.steps && (
        <div className="mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <span>{isExpanded ? 'Addımları gizlə' : 'Tətbiq addımlarını gör'}</span>
            <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>
          
          {isExpanded && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Tətbiq addımları:</h4>
              <ol className="space-y-1 text-sm text-gray-600">
                {recommendation.steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {status === 'pending' && (
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setStatus('implemented');
              if (onImplement) onImplement(recommendation);
            }}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Tətbiq et
          </button>
          <button
            onClick={() => {
              setStatus('dismissed');
              if (onDismiss) onDismiss(recommendation);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Təxirə sal
          </button>
        </div>
      )}

      {status === 'implemented' && (
        <div className="flex items-center space-x-2 text-green-700 bg-green-100 py-2 px-4 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Tətbiq edildi</span>
        </div>
      )}
    </div>
  );
};

// AI Insights Dashboard Component
export const AIInsightsDashboard = () => {
  const { calculations } = useFinancial();
  
  const insights = useMemo(() => {
    const { trends, kpi, expenseBreakdown } = calculations;
    
    // Generate insights based on data
    const insights = [];
    
    // Cash flow insight
    if (kpi.cashflow > 100000) {
      insights.push({
        type: 'positive',
        icon: <TrendingUp className="w-6 h-6 text-green-500" />,
        title: 'Güclü Nəqd Axını',
        description: `${kpi.cashflow.toLocaleString()} ₼ balans sağlam maliyyə vəziyyətini göstərir`,
        recommendation: 'İnvestisiya imkanlarını araşdırın və ya ehtiyat fondunu artırın'
      });
    } else if (kpi.cashflow < 20000) {
      insights.push({
        type: 'warning',
        icon: <AlertCircle className="w-6 h-6 text-orange-500" />,
        title: 'Nəqd Axını Riski',
        description: 'Aşağı nəqd balansı maliyyə riskini artırır',
        recommendation: 'Gəlir artırma və xərc azaltma strategiyalarını həyata keçirin'
      });
    }

    // Profit margin insight
    if (trends.profitMargin > 20) {
      insights.push({
        type: 'positive',
        icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
        title: 'Yüksək Mənfəət Marjı',
        description: `${trends.profitMargin.toFixed(1)}% mənfəət marjı sənaye ortalamasından yuxarıdır`,
        recommendation: 'Bu performansı saxlamaq üçün mövcud strategiyaları davam etdirin'
      });
    } else if (trends.profitMargin < 10) {
      insights.push({
        type: 'warning',
        icon: <AlertCircle className="w-6 h-6 text-red-500" />,
        title: 'Aşağı Mənfəət Marjı',
        description: `${trends.profitMargin.toFixed(1)}% mənfəət marjı təkmilləşdirmə tələb edir`,
        recommendation: 'Xərcləri optimallaşdırın və ya qiymət strategiyasını yenidən nəzərdən keçirin'
      });
    }

    // Growth trend insight
    if (kpi.growthRate > 10) {
      insights.push({
        type: 'positive',
        icon: <TrendingUp className="w-6 h-6 text-green-500" />,
        title: 'Güclü Böyümə',
        description: `${kpi.growthRate.toFixed(1)}% aylıq böyümə əla nəticədir`,
        recommendation: 'Böyümənin davamlılığını təmin etmək üçün infrastruktura investisiya edin'
      });
    }

    // Expense analysis
    const salaryExpense = expenseBreakdown.find(exp => exp.name === 'Əməkhaqqı');
    if (salaryExpense && salaryExpense.percentage > 40) {
      insights.push({
        type: 'info',
        icon: <PieChart className="w-6 h-6 text-purple-500" />,
        title: 'Yüksək Əmək Xərcləri',
        description: `Əməkhaqqı xərcləri ümumi xərclərin ${salaryExpense.percentage.toFixed(1)}%-ni təşkil edir`,
        recommendation: 'Əmək məhsuldarlığını artırmaq və ya prosesləri avtomatlaşdırmaq üçün həllər axtarın'
      });
    }

    return insights;
  }, [calculations]);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-8 text-white">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-8 h-8" />
        <h3 className="text-2xl font-bold">AI Maliyyə Təhlili</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-white/10 rounded-lg">
                {insight.icon}
              </div>
              <h4 className="font-semibold">{insight.title}</h4>
            </div>
            <p className="text-blue-100 text-sm mb-3">{insight.description}</p>
            <p className="text-xs text-blue-200 bg-white/10 rounded p-2">
              <strong>Tövsiyə:</strong> {insight.recommendation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Generate AI Recommendations
export const generateAIRecommendations = (calculations) => {
  const { trends, kpi, expenseBreakdown } = calculations;
  const recommendations = [];

  // Expense optimization recommendations
  const marketingExpense = expenseBreakdown.find(exp => exp.name === 'Marketing');
  if (marketingExpense && marketingExpense.percentage > 15) {
    recommendations.push({
      id: 'marketing-optimization',
      icon: <Target className="w-5 h-5 text-blue-500" />,
      title: 'Marketing Xərclərini Optimallaşdırın',
      description: `Marketing xərcləriniz ümumi xərclərin ${marketingExpense.percentage.toFixed(1)}%-ni təşkil edir. Bu, optimallaşdırma imkanları yaradır.`,
      priority: 'Yüksək',
      savings: Math.round(marketingExpense.value * 0.15),
      steps: [
        'Ən çox gəlir gətirən marketing kanallarını müəyyənləşdirin',
        'ROI aşağı olan kampanyaları dayandırın',
        'Rəqəmsal marketing alətlərindən daha çox istifadə edin',
        'Müştəri əldə etmə xərclərini izləyin'
      ]
    });
  }

  // Revenue growth recommendations
  if (kpi.growthRate < 5) {
    recommendations.push({
      id: 'revenue-growth',
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      title: 'Gəlir Artırma Strategiyası',
      description: 'Son dövrlərdə gəlir artımı yavaşlayıb. Yeni gəlir mənbələri tapmaq vacibdir.',
      priority: 'Yüksək',
      potential: Math.round(trends.avgRevenue * 0.25),
      steps: [
        'Mövcud müştərilərdən daha çox satış edin (upselling)',
        'Yeni məhsul və ya xidmətlər təklif edin',
        'Yeni bazar seqmentlərini araşdırın',
        'Qiymət strategiyasını yenidən nəzərdən keçirin'
      ]
    });
  }

  // Cash flow risk management
  if (kpi.cashflow / trends.avgExpenses < 3) {
    recommendations.push({
      id: 'cash-flow-management',
      icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
      title: 'Nəqd Axını Riskinin İdarə Edilməsi',
      description: 'Hazırki nəqd axınız yalnız 3 aydan az xərci ödəyə bilir. Ehtiyat fondu yaratmaq vacibdir.',
      priority: 'Yüksək',
      steps: [
        'Ən az 6 aylıq xərc ehtiyatı yaradın',
        'Ödəniş şərtlərini müştərilər üçün yaxşılaşdırın',
        'Təchizatçılarla daha yaxşı ödəniş şərtləri danışın',
        'Kredit xətti açmağı düşünün'
      ]
    });
  }

  // Operational efficiency
  const salaryExpense = expenseBreakdown.find(exp => exp.name === 'Əməkhaqqı');
  if (salaryExpense && salaryExpense.percentage > 35) {
    recommendations.push({
      id: 'operational-efficiency',
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      title: 'Əməliyyat Səmərəliliyini Artırın',
      description: 'Əmək xərcləriniz yüksəkdir. Avtomatlaşdırma və proseslərin təkmilləşdirilməsi vacibdir.',
      priority: 'Orta',
      savings: Math.round(salaryExpense.value * 0.1),
      steps: [
        'Təkrarlanan tapşırıqları avtomatlaşdırın',
        'İşçilərin məhsuldarlığını artırmaq üçün təlim verin',
        'İş proseslərini yenidən nəzərdən keçirin',
        'Texnoloji həllərdən daha çox istifadə edin'
      ]
    });
  }

  return recommendations;
};

// AI Recommendations List Component
export const AIRecommendationsList = () => {
  const { calculations } = useFinancial();
  const [implementedCount, setImplementedCount] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  const recommendations = useMemo(() => 
    generateAIRecommendations(calculations), 
    [calculations]
  );

  const handleImplement = (recommendation) => {
    setImplementedCount(prev => prev + 1);
    if (recommendation.savings) {
      setTotalSavings(prev => prev + recommendation.savings);
    }
  };

  const handleDismiss = (recommendation) => {
    // Handle dismissal logic
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{recommendations.length}</div>
            <div className="text-sm text-gray-600">Aktiv tövsiyə</div>
          </div>
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{implementedCount}</div>
            <div className="text-sm text-gray-600">Tətbiq edilmiş</div>
          </div>
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{totalSavings.toLocaleString()} ₼</div>
            <div className="text-sm text-gray-600">Potensial qənaət</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <AIRecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onImplement={handleImplement}
            onDismiss={handleDismiss}
          />
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hazırda tövsiyə yoxdur</h3>
          <p className="text-gray-600">AI sisteminiz məlumatları təhlil edir və tezliklə yeni tövsiyələr təqdim edəcək.</p>
        </div>
      )}
    </div>
  );
};

// Complete AI Advisor Component
export const AIAdvisor =({onNavigate}) => {
  return (
    <FinancialProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Maliyyə Tövsiyəçisi</h1>
              <p className="text-gray-600">Ağıllı tövsiyələr və avtomatik maliyyə optimizasiyası</p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              ← Geri
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 pb-6 space-y-8">
          {/* AI Insights Dashboard */}
          <AIInsightsDashboard />
          
          {/* AI Recommendations */}
          <AIRecommendationsList />
        </main>
      </div>
    </FinancialProvider>
  );
};

export default AIAdvisor;
