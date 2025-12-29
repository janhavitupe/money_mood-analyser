
import React, { useState } from 'react';
import { 
  Activity, 
  BrainCircuit, 
  CreditCard, 
  Download, 
  FileText, 
  ShieldAlert, 
  Zap,
  TrendingDown,
  TrendingUp,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  RefreshCw,
  LucideIcon
} from 'lucide-react';
import { Transaction, AnalysisResult, MoodInsight } from './types';
import { MOCK_TRANSACTIONS } from './constants';
import { analyzeSpendingPatterns } from './services/geminiService';
import { formatCurrency, parseCSV } from './utils/dataUtils';
import { DashboardCharts } from './components/DashboardCharts';
import { TransactionForm } from './components/TransactionForm';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSpendingPatterns(transactions);
      setAnalysis(result);
    } catch (error: any) {
      console.error("Analysis failed details:", error);
      const errorMessage = error.message || "Unknown error";
      alert(`AI Analysis failed: ${errorMessage}. Make sure you have set your API_KEY correctly in the environment.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseCSV(content);
      if (parsed.length > 0) {
        setTransactions([...transactions, ...parsed]);
      } else {
        alert("Could not parse CSV. Please check formatting.");
      }
    };
    reader.readAsText(file);
  };

  const addTransaction = (t: Transaction) => {
    setTransactions([t, ...transactions]);
  };

  const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fafafa] text-slate-900 selection:bg-indigo-100">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-b md:border-r border-slate-100 md:h-screen sticky top-0 z-20 px-6 py-8 flex flex-col">
        <div className="flex items-center space-x-3 mb-12 px-2">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center">
            <BrainCircuit className="text-white" size={22} />
          </div>
          <h1 className="text-lg font-bold tracking-tight">MoneyMood</h1>
        </div>
        
        <nav className="space-y-1.5 flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-sm ${activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Activity size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-sm ${activeTab === 'transactions' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <CreditCard size={18} />
            <span>Transactions</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-50">
          <div className="bg-indigo-50/50 p-5 rounded-3xl">
            <div className="flex items-center space-x-2 text-indigo-600 mb-2">
              <Zap size={14} fill="currentColor" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Cognitive Core</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              Unlock deep psychological mapping of your spending patterns.
            </p>
            <button 
              onClick={runAnalysis}
              disabled={isAnalyzing || transactions.length === 0}
              className={`w-full py-3 rounded-2xl text-xs font-bold transition-all ${isAnalyzing ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black active:scale-[0.98]'}`}
            >
              {isAnalyzing ? <RefreshCw className="animate-spin" size={14} /> : 'Process Behavior'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              {activeTab === 'dashboard' ? 'Insight Hub' : 'Ledger'}
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              {activeTab === 'dashboard' ? 'Behavioral mapping and financial psychology.' : 'Detailed transaction management.'}
            </p>
          </div>
          <div className="flex items-center">
             <label className="flex items-center px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm active:scale-95">
                <Download size={14} className="mr-2" />
                <span>Import CSV</span>
                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
             </label>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div className="space-y-10">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                label="Aggregate Outlay" 
                value={formatCurrency(totalSpent)} 
                icon={FileText} 
                color="text-slate-900" 
              />
              <StatCard 
                label="Stability Score" 
                value={analysis ? `${analysis.profile.score}/100` : '--'} 
                icon={Zap} 
                color="text-indigo-600" 
                trend={analysis ? (analysis.profile.score > 70 ? 'positive' : 'negative') : undefined}
              />
              <StatCard 
                label="Dominant Trait" 
                value={analysis ? analysis.profile.primaryTrait : 'Pending...'} 
                icon={Sparkles} 
                color="text-fuchsia-600" 
              />
              <StatCard 
                label="Risk Tier" 
                value={analysis ? analysis.profile.riskLevel : 'Healthy'} 
                icon={ShieldAlert} 
                color="text-rose-600" 
              />
            </div>

            <DashboardCharts transactions={transactions} />

            {/* AI Result Section */}
            {analysis ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
                <div className="lg:col-span-2 space-y-8">
                   <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                        <BrainCircuit className="mr-3 text-slate-900" size={20} />
                        Psychological Assessment
                      </h3>
                      <div className="text-slate-600 leading-[1.8] text-[15px] space-y-4">
                        {analysis.psychologicalProfile.split('\n\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {analysis.insights.map((insight, idx) => (
                       <InsightCard key={idx} insight={insight} />
                     ))}
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
                      <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest">Behavioral Sync</h3>
                      <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">
                        "{analysis.profile.summary}"
                      </p>
                      <div className="space-y-6">
                        <div className="group">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] block mb-2">Priority Deviation</span>
                          <div className="flex items-center text-rose-600 font-bold bg-rose-50 px-4 py-3 rounded-2xl group-hover:bg-rose-100 transition-colors">
                             <TrendingUp className="mr-3" size={18} />
                             {analysis.insights[0]?.tag || 'Impulse'}
                          </div>
                        </div>
                      </div>
                   </div>

                   <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <h4 className="font-bold text-lg mb-3 relative">Strategic Correction</h4>
                      <p className="text-sm text-slate-300 leading-relaxed mb-6 relative">
                        Your "{analysis.profile.primaryTrait}" pattern indicates susceptibility to environment-driven spending. Implementing a 48-hour cooling period for UPI transactions over ₹1,000 is recommended.
                      </p>
                      <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl text-xs font-bold transition-all flex items-center hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/20">
                        View Optimization Plan <ChevronRight size={14} className="ml-1" />
                      </button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                  <Sparkles className="text-slate-300" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">System Idle</h3>
                <p className="text-slate-400 max-w-sm mx-auto mb-8 font-medium">
                  Populate your transaction history to initialize behavioral mapping.
                </p>
                <button 
                   onClick={runAnalysis}
                   className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] text-sm font-bold shadow-xl shadow-slate-200 transition-all hover:bg-black active:scale-95"
                >
                  Analyze Behavior
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10 pb-20">
            <TransactionForm onAdd={addTransaction} />
            
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50">
                <h3 className="font-bold text-slate-900">Recent Activity</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">
                  <tr>
                    <th className="px-8 py-4">Timeline</th>
                    <th className="px-8 py-4">Item</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4 text-right">Magnitude</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm text-slate-400 tabular-nums">
                        {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-slate-800">
                        {t.description}
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-900 text-right tabular-nums">
                        {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string, icon: LucideIcon, color: string, trend?: 'positive' | 'negative' }> = ({ label, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center ${color}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      {trend && (
        <div className={`flex items-center ${trend === 'positive' ? 'text-emerald-500' : 'text-rose-500'}`}>
           {trend === 'positive' ? <TrendingDown size={14} className="mr-1" /> : <TrendingUp size={14} className="mr-1" />}
        </div>
      )}
    </div>
    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-bold text-slate-900 truncate tracking-tight">{value}</div>
  </div>
);

const InsightCard: React.FC<{ insight: MoodInsight }> = ({ insight }) => {
  const getTagIcon = () => {
    switch(insight.tag) {
      case 'Late-Night': return <Clock size={16} />;
      case 'Weekend': return <Calendar size={16} />;
      case 'Impulse': return <Zap size={16} />;
      case 'Subscription': return <Layers size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getStyle = () => {
    switch(insight.severity) {
      case 'high': return 'bg-rose-50 text-rose-900 border-rose-100';
      case 'medium': return 'bg-amber-50 text-amber-900 border-amber-100';
      default: return 'bg-white text-slate-900 border-slate-100';
    }
  };

  return (
    <div className={`p-8 rounded-[2rem] border transition-all hover:scale-[1.01] ${getStyle()} shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 opacity-60">
          {getTagIcon()}
          <span className="text-[10px] font-bold uppercase tracking-widest">{insight.tag}</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-current opacity-20"></div>
      </div>
      <h4 className="font-bold text-lg mb-2">{insight.title}</h4>
      <p className="text-sm opacity-70 leading-relaxed font-medium">{insight.description}</p>
    </div>
  );
};

export default App;
