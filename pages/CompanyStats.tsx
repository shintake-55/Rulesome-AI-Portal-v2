import React, { useState } from 'react';
import { Company } from '../types';
import { GlassPanel } from '../components/ui';
import { ArrowLeft, BarChart2, FileText, Star, Users, ArrowUpRight, ArrowDownRight, Bot, Sparkles, User, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

// Enhanced Mock Data matching Dashboard structure
const MOCK_RANKING_AI = [
  { rank: 1, title: '翻訳ワークフロー', sub: 'gemini-pro', val: 450, type: 'bot' as const },
  { rank: 2, title: 'DeepSeek Chat', sub: 'deepseek-coder', val: 320, type: 'bot' as const },
  { rank: 3, title: '議事録作成AI', sub: 'whisper-large', val: 210, type: 'custom' as const },
  { rank: 4, title: '画像生成プロンプト', sub: 'gpt-4o', val: 180, type: 'bot' as const },
  { rank: 5, title: '社内Wiki検索', sub: 'rag-pipeline', val: 150, type: 'custom' as const },
  { rank: 6, title: 'コードレビューBuddy', sub: 'gemini-1.5', val: 120, type: 'bot' as const },
  { rank: 7, title: 'PDF見積書文字起こし', sub: 'ocr-vision', val: 90, type: 'custom' as const },
  { rank: 8, title: 'SEOブログ制作AI', sub: 'gpt-4-turbo', val: 85, type: 'bot' as const },
  { rank: 9, title: '動画解釈Bot', sub: 'gemini-vision', val: 60, type: 'custom' as const },
  { rank: 10, title: 'ドメイン管理アドバイザー', sub: 'knowledge-base', val: 40, type: 'bot' as const },
];

const MOCK_RANKING_USERS = [
  { rank: 1, title: '東京二郎', sub: 'okrtest23@t3inc.jp', val: 52 },
  { rank: 2, title: '田中 太郎', sub: 'tanaka@example.com', val: 48 },
  { rank: 3, title: '鈴木 一郎', sub: 'suzuki@example.com', val: 45 },
  { rank: 4, title: '管理者次郎', sub: 'admin@example.com', val: 40 },
  { rank: 5, title: '佐藤 花子', sub: 'sato@example.com', val: 38 },
  { rank: 6, title: '山田 次郎', sub: 'yamada@example.com', val: 30 },
  { rank: 7, title: '高橋 三郎', sub: 'takahashi@example.com', val: 28 },
  { rank: 8, title: '伊藤 四郎', sub: 'ito@example.com', val: 25 },
  { rank: 9, title: '渡辺 五郎', sub: 'watanabe@example.com', val: 20 },
  { rank: 10, title: '山本 六郎', sub: 'yamamoto@example.com', val: 15 },
];

export const CompanyStats: React.FC<{ company: Company; onBack: () => void }> = ({ company, onBack }) => {
  const [activeTab, setActiveTab] = useState<'year' | 'month' | 'day'>('month');
  const [contentLimit, setContentLimit] = useState(5);
  const [usersLimit, setUsersLimit] = useState(5);

  const toggleContentLimit = () => {
    setContentLimit(prev => prev === 5 ? MOCK_RANKING_AI.length : 5);
  };

  const toggleUsersLimit = () => {
    setUsersLimit(prev => prev === 5 ? MOCK_RANKING_USERS.length : 5);
  };

  return (
    <div className="max-w-[1400px] mx-auto pt-4 animate-fadeIn">
      {/* Header Navigation */}
      <div className="mb-6 flex items-center justify-between">
         <button 
           onClick={onBack} 
           className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-500 hover:text-brand-text transition-all shadow-sm border border-slate-200 hover:border-brand-text"
         >
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
           <span className="font-bold text-sm">企業一覧に戻る</span>
         </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            <span className="text-brand-text">
              {company.name}
            </span>
            <span className="text-slate-500 ml-3 text-2xl">統計レポート</span>
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard 
          icon={<BarChart2 className="text-brand-text" size={24} />} 
          title="総クリック数"
          value="1,245"
          trend="+12.5%"
          trendUp={true}
        />
        <SummaryCard 
          icon={<FileText className="text-brand-text" size={24} />} 
          title="メモ作成数"
          value="2"
          trend="-100.0%"
          trendUp={false}
        />
        <SummaryCard 
          icon={<Star className="text-brand-text" size={24} />} 
          title="お気に入り追加"
          value="85"
          trend="+5.0%"
          trendUp={true}
        />
        <SummaryCard 
          icon={<Users className="text-brand-text" size={24} />} 
          title="アクティブユーザー"
          value="34"
          trend="+2.4%"
          trendUp={true}
          note="※過去30日間の実稼働数"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trend Chart */}
        <GlassPanel className="lg:col-span-2 p-6 bg-white shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-brand-yellow rounded-full"></div>
                アクション推移
            </h3>
            <div className="flex bg-brand-bg p-1 rounded-full">
                <TabButton label="年別" active={activeTab === 'year'} onClick={() => setActiveTab('year')} />
                <TabButton label="月別" active={activeTab === 'month'} onClick={() => setActiveTab('month')} />
                <TabButton label="日別" active={activeTab === 'day'} onClick={() => setActiveTab('day')} />
            </div>
          </div>
          
          <div className="h-64 w-full rounded-2xl relative overflow-hidden flex items-end justify-between px-4 pb-0 pt-10 bg-brand-bg/50 border border-transparent">
             {/* Grids */}
             <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(30, 30, 30, 0.05) 1px, transparent 1px)', backgroundSize: '100% 20%' }}></div>
             </div>

             {/* Chart Lines */}
             <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
               <path d="M0 200 L100 180 L200 150 L300 160 L400 100 L500 120 L600 80 L700 90 L800 40 L900 60 L1000 20" 
                     fill="none" stroke="#1e1e1e" strokeWidth="3" vectorEffect="non-scaling-stroke" className="drop-shadow-md" />
               <path d="M0 220 L100 215 L200 210 L300 212 L400 200 L500 205 L600 190 L700 195 L800 180 L900 185 L1000 180" 
                     fill="none" stroke="#fbe233" strokeWidth="2" strokeDasharray="5,5" vectorEffect="non-scaling-stroke" />
             </svg>
             <div className="absolute bottom-2 left-0 w-full flex justify-between text-[10px] text-slate-400 px-2 font-mono">
               <span>24/04</span><span>24/05</span><span>24/06</span><span>24/07</span><span>24/08</span><span>24/09</span><span>24/10</span><span>24/11</span><span>24/12</span><span>25/01</span><span>25/02</span><span>25/03</span>
             </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
             <LegendItem color="bg-brand-text" label="クリック" />
             <LegendItem color="bg-brand-yellow" label="メモ" />
             <LegendItem color="bg-slate-300" label="お気に入り" />
          </div>
        </GlassPanel>

        {/* Engagement Chart */}
        <GlassPanel className="p-6 flex flex-col bg-white shadow-xl">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-brand-text rounded-full"></div>
            エンゲージメント
          </h3>
          <div className="flex-1 flex items-center justify-center">
             <InteractiveDonutChart />
          </div>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
             <LegendItem color="bg-brand-text" label="クリック" />
             <LegendItem color="bg-brand-yellow" label="メモ" />
             <LegendItem color="bg-slate-300" label="お気に入り" />
          </div>
        </GlassPanel>
      </div>

      {/* Rankings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {/* Popular AI Employees */}
        <GlassPanel className="p-0 overflow-hidden bg-white shadow-2xl flex flex-col">
           <div className="p-6 border-b border-brand-bg">
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                   <Sparkles className="text-brand-yellow" size={20} />
                   人気AI社員ランキング
               </h3>
           </div>
           <div className="p-2 space-y-1">
             {MOCK_RANKING_AI.slice(0, contentLimit).map((item) => (
                <RankingRow key={item.rank} rank={item.rank} title={item.title} sub={item.sub} value={item.val} type={item.type} />
             ))}
           </div>
           <div className="p-4 mt-auto border-t border-brand-bg text-center bg-brand-bg/10">
             <button 
                onClick={toggleContentLimit}
                className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-text hover:bg-brand-text/80 text-white font-bold text-sm transition-all duration-300 overflow-hidden"
             >
               {contentLimit === 5 ? (
                 <><span>もっと見る</span><ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" /></>
               ) : (
                 <><span>閉じる</span><ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" /></>
               )}
             </button>
           </div>
        </GlassPanel>

        {/* Active Users */}
        <GlassPanel className="p-0 overflow-hidden bg-white shadow-2xl flex flex-col">
           <div className="p-6 border-b border-brand-bg">
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                   <User className="text-brand-text" size={20} />
                   アクティブユーザーTOP10
               </h3>
               <p className="text-xs text-slate-500 mt-1 ml-7">※過去30日間の実稼働ランキング</p>
           </div>
           <div className="p-2 space-y-1">
             {MOCK_RANKING_USERS.slice(0, usersLimit).map((item) => (
                <RankingRow key={item.rank} rank={item.rank} title={item.title} sub={item.sub} value={item.val} type="user" />
             ))}
           </div>
           <div className="p-4 mt-auto border-t border-brand-bg text-center bg-brand-bg/10">
             <button 
                onClick={toggleUsersLimit}
                className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-text hover:bg-brand-text/80 text-white font-bold text-sm transition-all duration-300 overflow-hidden"
             >
               {usersLimit === 5 ? (
                 <><span>もっと見る</span><ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" /></>
               ) : (
                 <><span>閉じる</span><ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" /></>
               )}
             </button>
           </div>
        </GlassPanel>
      </div>
    </div>
  );
};

// --- Interactive Donut Chart Component (Reused) ---
const InteractiveDonutChart: React.FC = () => {
    const total = 1332;
    const clicks = 800; // ~60%
    const memos = 400;  // ~30%
    const favs = 132;   // ~10%

    // Calculate stroke-dasharray based on circumference (C = 2 * PI * r)
    // r = 40, C approx 251.2
    const C = 251.2;
    const off1 = 0;
    const len1 = (clicks / total) * C;
    
    const off2 = -len1;
    const len2 = (memos / total) * C;

    const off3 = -(len1 + len2);
    const len3 = (favs / total) * C;

    const [hoveredData, setHoveredData] = useState<{ label: string, value: number, color: string } | null>(null);

    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Chart */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Background Circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />

                {/* Segments */}
                {/* Clicks - Black */}
                <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#1e1e1e" 
                    strokeWidth="12"
                    strokeDasharray={`${len1} ${C}`}
                    strokeDashoffset={off1}
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    onMouseEnter={() => setHoveredData({ label: 'Clicks', value: clicks, color: 'text-brand-text' })}
                    onMouseLeave={() => setHoveredData(null)}
                />
                
                {/* Memos - Yellow */}
                <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#fbe233" 
                    strokeWidth="12"
                    strokeDasharray={`${len2} ${C}`}
                    strokeDashoffset={off2}
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    onMouseEnter={() => setHoveredData({ label: 'Memos', value: memos, color: 'text-brand-yellow' })}
                    onMouseLeave={() => setHoveredData(null)}
                />

                {/* Favs - Gray */}
                <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#cbd5e1" 
                    strokeWidth="12"
                    strokeDasharray={`${len3} ${C}`}
                    strokeDashoffset={off3}
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    onMouseEnter={() => setHoveredData({ label: 'Favorites', value: favs, color: 'text-slate-400' })}
                    onMouseLeave={() => setHoveredData(null)}
                />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className={`text-3xl font-bold tracking-tighter transition-colors duration-300 ${hoveredData ? hoveredData.color : 'text-slate-700'}`}>
                    {hoveredData ? hoveredData.value : total}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                    {hoveredData ? hoveredData.label : 'Total Actions'}
                </div>
            </div>
        </div>
    );
};

// --- Sub Components (Reused style from Dashboard) ---

const SummaryCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  trend: string;
  trendUp: boolean;
  note?: string;
}> = ({ icon, title, value, trend, trendUp, note }) => (
  <GlassPanel className="p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-white shadow-lg">
    
    <div className="flex items-center gap-4 mb-4 relative z-10">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-yellow text-brand-text shadow-sm">
        {icon}
      </div>
      <div className="font-bold text-slate-500 text-sm">{title}</div>
    </div>
    
    <div className="text-4xl font-bold text-slate-800 mb-2 relative z-10 tracking-tight">{value}</div>
    
    <div className={`flex items-center gap-1 text-sm font-bold relative z-10 ${trendUp ? 'text-brand-text' : 'text-slate-400'}`}>
      {trendUp ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
      前月比 <span className={trendUp ? 'bg-brand-bg px-1 rounded' : ''}>{trend}</span>
    </div>
    
    {note && <p className="text-[10px] text-slate-400 mt-3 leading-tight relative z-10">{note}</p>}
  </GlassPanel>
);

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
        active 
        ? 'bg-brand-text text-white shadow-sm' 
        : 'text-slate-500 hover:text-brand-text'
    }`}
  >
    {label}
  </button>
);

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
    <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm`} />
    {label}
  </div>
);

const RankingRow: React.FC<{ 
    rank: number; 
    title: string; 
    sub: string; 
    value: number;
    type: 'bot' | 'custom' | 'user'; 
}> = ({ rank, title, sub, value, type }) => {
  // Rank Styles
  let rankStyle = "bg-brand-bg text-slate-400 border border-slate-200";
  if (rank === 1) rankStyle = "bg-brand-yellow text-brand-text shadow-lg border border-brand-yellow";
  if (rank === 2) rankStyle = "bg-brand-text text-white shadow-md border border-brand-text";
  if (rank === 3) rankStyle = "bg-slate-400 text-white shadow-sm border border-slate-400";

  return (
    <div className="flex items-center py-3 px-3 mx-2 rounded-xl hover:bg-brand-bg/50 transition-colors cursor-default group">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 transition-transform group-hover:scale-110 ${rankStyle}`}>
        {rank}
      </div>
      
      {/* Icon based on type */}
      <div className="mr-3 p-2 rounded-full bg-white shadow-sm text-slate-500 border border-slate-100">
          {type === 'bot' && <Bot size={16} className="text-slate-500" />}
          {type === 'custom' && <Sparkles size={16} className="text-brand-yellow" />}
          {type === 'user' && <User size={16} className="text-brand-text" />}
      </div>

      <div className="flex-1 min-w-0 mr-4">
        <div className="font-bold text-slate-700 truncate text-sm group-hover:text-brand-text transition-colors">{title}</div>
        <div className="text-[10px] text-slate-400 truncate">{sub}</div>
      </div>
      
      <div className="text-brand-text font-bold text-sm bg-brand-bg px-2 py-1 rounded-full border border-slate-200">
          {value}
      </div>
    </div>
  );
};