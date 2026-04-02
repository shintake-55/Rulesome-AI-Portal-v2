import React, { useState, useMemo } from 'react';
import { GlassPanel } from '../components/ui';
import { 
  BarChart2, FileText, Star, Users, ArrowUpRight, ArrowDownRight, 
  Bot, Sparkles, User as UserIcon, ChevronRight, Download, Loader2, MessageSquare, Zap, Building2, Search,
  ArrowUpDown, ArrowUp, ArrowDown, Filter
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Sector
} from 'recharts';
import {
  companies, kpiData, timeSeriesData, popularAIs, activeUsers,
  tokenUsage, aiMessageRatio, userDetailsMap, allAIs
} from '../data/mockData';
import { formatNumber, formatPercent } from '../lib/utils';

import { User } from '../types';

interface DashboardProps {
  currentUser: User;
  initialCompanyId?: string;
}

// -----------------------------------------------------------------------------
// [PAGE COMPONENT] ダッシュボード画面
// -----------------------------------------------------------------------------
export const Dashboard: React.FC<DashboardProps> = ({ currentUser, initialCompanyId }) => {
  const [activeTab, setActiveTab] = useState<'year' | 'month' | 'day'>('month');
  const [selectedCompany, setSelectedCompany] = useState(initialCompanyId || companies[0].id);
  const [selectedUserId, setSelectedUserId] = useState<string>(activeUsers[0].id);
  const [selectedAIForTrend, setSelectedAIForTrend] = useState<string>('all');
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Basic' | 'Custom'>('All');

  const sortedAndFilteredAIs = useMemo(() => {
    let filtered = [...allAIs];
    if (filterType !== 'All') {
      filtered = filtered.filter(ai => ai.type === filterType);
    }

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof typeof a];
        let bValue: any = b[sortConfig.key as keyof typeof b];

        if (sortConfig.key === 'avg') {
          aValue = a.messages / a.conversations;
          bValue = b.messages / b.conversations;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [sortConfig, filterType]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  // Filter timeSeriesData based on selected AI (mocking the filter for now)
  const currentChartData = timeSeriesData[activeTab].map(data => ({
    ...data,
    conversations: selectedAIForTrend === 'all' ? data.conversations : Math.floor(data.conversations * 0.3),
    messages: selectedAIForTrend === 'all' ? data.messages : Math.floor(data.messages * 0.3),
  }));
  const selectedUserDetail = userDetailsMap[selectedUserId] || {
    name: activeUsers.find(u => u.id === selectedUserId)?.name || 'Unknown',
    email: activeUsers.find(u => u.id === selectedUserId)?.email || '',
    mostUsedAI: 'N/A',
    totalMessages: activeUsers.find(u => u.id === selectedUserId)?.messages || 0,
    totalConversations: 0,
    usage: []
  };

  const COLORS = ['#1e1e1e', '#fbe233', '#cbd5e1', '#94a3b8', '#64748b', '#475569'];

  return (
    <main id="dashboard-content" className="max-w-[1400px] mx-auto pt-6 animate-fadeIn pb-12 relative">
      
      {/* [HEADER] */}
      <header className="relative flex flex-col md:flex-row items-center justify-between mb-10 px-4 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-brand-text tracking-tight">
            統計ダッシュボード
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <Building2 className="w-5 h-5 text-slate-400" />
          {currentUser.role === 'master_admin' && !initialCompanyId ? (
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-transparent border-none text-brand-text font-bold focus:outline-none focus:ring-0 cursor-pointer text-sm"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          ) : (
            <span className="text-brand-text font-bold text-sm">
              {currentUser.role === 'master_admin' && initialCompanyId 
                ? companies.find(c => c.id === initialCompanyId)?.name 
                : currentUser.companyName}
            </span>
          )}
        </div>
      </header>

      {/* [KPI CARDS] */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          icon={<MessageSquare className="text-brand-text" size={24} />}
          title="総会話数"
          value={kpiData.totalConversations.toLocaleString()}
        />
        <SummaryCard
          icon={<MessageSquare className="text-brand-text" size={24} />}
          title="総メッセージ数"
          value={kpiData.totalMessages.toLocaleString()}
        />
        <SummaryCard
          icon={<Zap className="text-brand-text" size={24} />}
          title="トークン使用量"
          value={formatNumber(kpiData.totalTokens)}
        />
        <SummaryCard
          icon={<Users className="text-brand-text" size={24} />}
          title="アクティブユーザー率"
          value={formatPercent(kpiData.activeUserRate)}
          note="※過去30日間のログイン率"
        />
      </section>

      {/* [ACTION TREND CHART] */}
      <section className="mb-8">
        <GlassPanel className="p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
                <div className="w-2 h-6 bg-brand-yellow rounded-full"></div>
                アクション推移
              </h3>
              <select
                value={selectedAIForTrend}
                onChange={(e) => setSelectedAIForTrend(e.target.value)}
                className="bg-brand-bg/50 border border-slate-200 text-brand-text font-bold rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow cursor-pointer"
              >
                <option value="all">すべてのAI社員</option>
                {allAIs.map(ai => (
                  <option key={ai.id} value={ai.id}>{ai.name}</option>
                ))}
              </select>
            </div>
            <div className="flex bg-brand-bg p-1 rounded-full">
              <TabButton label="年別" active={activeTab === 'year'} onClick={() => setActiveTab('year')} />
              <TabButton label="月別" active={activeTab === 'month'} onClick={() => setActiveTab('month')} />
              <TabButton label="日別" active={activeTab === 'day'} onClick={() => setActiveTab('day')} />
            </div>
          </div>
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} interval={0} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line yAxisId="left" type="monotone" name="会話数" dataKey="conversations" stroke="#1e1e1e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" name="メッセージ数" dataKey="messages" stroke="#fbe233" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </section>

      {/* [POPULAR AI & ACTIVE USERS] */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassPanel className="p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-brand-bg">
            <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
              <Sparkles className="text-brand-yellow" size={24} fill="currentColor" />
              人気AI社員トップ10
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {popularAIs.map((ai, index) => (
              <RankingRow 
                key={ai.id} 
                rank={index + 1} 
                title={ai.name} 
                sub={ai.type} 
                value={ai.conversations} 
                type={ai.type === 'Custom' ? 'custom' : 'bot'} 
                valueLabel="会話"
              />
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-brand-bg">
            <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
              <UserIcon className="text-brand-text" size={24} fill="currentColor" />
              アクティブユーザーTOP10
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {activeUsers.map((user, index) => (
              <RankingRow 
                key={user.id} 
                rank={index + 1} 
                title={user.name} 
                sub={user.email} 
                value={user.messages} 
                type="user" 
                valueLabel="回"
              />
            ))}
          </div>
        </GlassPanel>
      </section>

      {/* [TOKEN USAGE & MESSAGE RATIO] */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassPanel className="p-8 flex flex-col">
          <h3 className="text-xl font-bold text-brand-text mb-8 flex items-center gap-2">
            <div className="w-2 h-6 bg-brand-yellow rounded-full"></div>
            トークン使用量の内訳
          </h3>
          <div className="flex flex-col flex-1 w-full">
            <div className="flex-1 relative min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenUsage}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={120}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    onMouseEnter={(_, index) => setHoveredPieIndex(index)}
                    onMouseLeave={() => setHoveredPieIndex(null)}
                  >
                    {tokenUsage.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        className="transition-all duration-300 hover:opacity-100 cursor-pointer"
                        style={{ opacity: hoveredPieIndex !== null && hoveredPieIndex !== index ? 0.3 : 1 }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300 px-4 text-center">
                <span className="text-xs md:text-sm text-slate-400 font-bold mb-1 truncate w-full max-w-[140px]">
                  {hoveredPieIndex !== null ? tokenUsage[hoveredPieIndex].name : '合計'}
                </span>
                <span className="text-2xl md:text-3xl font-bold text-brand-text tracking-tight">
                  {hoveredPieIndex !== null 
                    ? formatNumber(tokenUsage[hoveredPieIndex].value) 
                    : formatNumber(kpiData.totalTokens)}
                </span>
                {hoveredPieIndex !== null && (
                  <span className="text-[10px] md:text-xs text-brand-yellow font-bold mt-1 bg-brand-yellow/10 px-2.5 py-0.5 rounded-full">
                    {formatPercent((tokenUsage[hoveredPieIndex].value / kpiData.totalTokens) * 100)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Custom Interactive Legend */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 px-2">
              {tokenUsage.map((entry, index) => (
                <div 
                  key={`legend-${index}`} 
                  className={`flex items-center justify-between p-2 rounded-xl transition-all duration-300 cursor-pointer border ${
                    hoveredPieIndex === index 
                      ? 'bg-white shadow-sm border-slate-200 scale-[1.02]' 
                      : 'bg-transparent border-transparent hover:bg-slate-50'
                  }`}
                  onMouseEnter={() => setHoveredPieIndex(index)}
                  onMouseLeave={() => setHoveredPieIndex(null)}
                >
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-3.5 h-3.5 rounded-full shadow-sm transition-transform duration-300" 
                      style={{ 
                        backgroundColor: COLORS[index % COLORS.length],
                        transform: hoveredPieIndex === index ? 'scale(1.2)' : 'scale(1)'
                      }}
                    ></div>
                    <span className={`text-xs font-bold transition-colors ${hoveredPieIndex === index ? 'text-brand-text' : 'text-slate-500'}`}>
                      {entry.name}
                    </span>
                  </div>
                  <span className={`text-xs font-bold transition-colors ${hoveredPieIndex === index ? 'text-brand-text' : 'text-slate-400'}`}>
                    {formatPercent((entry.value / kpiData.totalTokens) * 100)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-8 flex flex-col">
          <h3 className="text-xl font-bold text-brand-text mb-8 flex items-center gap-2">
            <div className="w-2 h-6 bg-brand-text rounded-full"></div>
            AI社員別 会話数 構成比
          </h3>
          <div className="flex-1 w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={aiMessageRatio}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f8fafc" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} 
                  width={120}
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#f1f5f9', radius: 8 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100/50 transform transition-all">
                          <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-lg font-bold text-brand-text">
                              {payload[0].value?.toLocaleString()}
                            </p>
                            <span className="text-[10px] font-bold text-slate-400">メッセージ</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="messages" 
                  name="メッセージ数" 
                  fill="#1e1e1e" 
                  radius={[4, 4, 4, 4]} 
                  barSize={12} 
                  background={{ fill: '#f1f5f9', radius: 4 }}
                  animationDuration={1500}
                >
                  {aiMessageRatio.map((entry, index) => (
                    <Cell key={`cell-${index}`} className="hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </section>

      {/* [USER DETAILS] */}
      <section className="mb-8">
        <GlassPanel className="p-0 overflow-hidden">
          <div className="p-6 border-b border-brand-bg">
            <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
              <UserIcon className="text-brand-text" size={24} />
              ユーザー別利用詳細
            </h3>
          </div>
          <div className="flex flex-col md:flex-row h-auto md:h-[500px]">
            {/* Left List */}
            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-brand-bg overflow-y-auto bg-brand-bg/30 max-h-[300px] md:max-h-full">
              <div className="p-4 border-b border-brand-bg sticky top-0 bg-white/90 backdrop-blur z-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ユーザーを検索..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border-none rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow text-brand-text"
                  />
                </div>
              </div>
              <div className="divide-y divide-brand-bg">
                {activeUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`w-full text-left p-4 hover:bg-white transition-colors flex items-center justify-between group ${
                      selectedUserId === user.id ? "bg-white border-l-4 border-brand-yellow shadow-sm" : "border-l-4 border-transparent"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-4">
                      <p className={`font-bold truncate ${selectedUserId === user.id ? "text-brand-text" : "text-slate-700"}`}>{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <p className="text-[10px] text-slate-500 mt-1 truncate">
                        よく使うAI: <span className="font-bold text-slate-600">{userDetailsMap[user.id]?.mostUsedAI || 'データなし'}</span>
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-2 flex-shrink-0">
                      <div>
                        <p className="text-sm font-bold text-brand-text">{user.messages}</p>
                        <p className="text-[10px] text-slate-400">メッセージ</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-colors ${selectedUserId === user.id ? "text-brand-yellow" : "text-slate-300 group-hover:text-slate-500"}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Details */}
            <div className="w-full md:w-2/3 p-8 overflow-y-auto bg-white">
              <div className="flex items-start mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-brand-bg text-brand-text flex items-center justify-center font-bold text-2xl shadow-sm border border-slate-100 flex-shrink-0">
                    {selectedUserDetail.name.charAt(0)}
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className="text-2xl font-bold text-brand-text">{selectedUserDetail.name}</h3>
                    <p className="text-slate-500 font-medium mb-2">{selectedUserDetail.email}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">よく使うAI社員:</p>
                      <span className="inline-flex items-center rounded-full bg-brand-yellow/20 text-brand-text px-2 py-0.5 text-xs font-bold">
                        {selectedUserDetail.mostUsedAI}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-brand-bg/50 p-5 rounded-2xl border border-brand-bg">
                  <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">総メッセージ数</p>
                  <p className="text-3xl font-bold text-brand-text">{selectedUserDetail.totalMessages.toLocaleString()}</p>
                </div>
                <div className="bg-brand-bg/50 p-5 rounded-2xl border border-brand-bg">
                  <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">総会話数</p>
                  <p className="text-3xl font-bold text-brand-text">{selectedUserDetail.totalConversations.toLocaleString()}</p>
                </div>
              </div>

              <h4 className="text-sm font-bold text-brand-text mb-6 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-brand-text rounded-full"></div>
                利用AI社員ごとの内訳
              </h4>
              <div className="space-y-6">
                {selectedUserDetail.usage.length > 0 ? selectedUserDetail.usage.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-700">{item.aiName}</span>
                      <span className="text-slate-500 font-medium">
                        <strong className="text-brand-text">{item.messages}</strong> メッセージ / {item.conversations} 会話
                      </span>
                    </div>
                    <div className="w-full bg-brand-bg rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-brand-text h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${item.ratio}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right text-slate-400 font-bold">{item.ratio}%</p>
                  </div>
                )) : (
                  <div className="text-center py-16 text-slate-400 bg-brand-bg/30 rounded-3xl border border-dashed border-slate-200 font-bold">
                    詳細データがありません
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* [AI EMPLOYEE TABLE] */}
      <section>
        <GlassPanel className="p-0 overflow-hidden">
          <div className="p-6 border-b border-brand-bg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
              <Bot className="text-brand-text" size={24} />
              AI社員 利用状況一覧
            </h3>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-brand-bg/50 border border-slate-200 text-slate-600 text-sm rounded-lg focus:ring-brand-yellow focus:border-brand-yellow block p-2 font-bold outline-none"
              >
                <option value="All">すべてのカテゴリ</option>
                <option value="Basic">ベーシック</option>
                <option value="Custom">カスタム</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-brand-bg/50 border-b border-brand-bg">
                <tr>
                  <th className="px-6 py-4 font-bold">
                    <button onClick={() => requestSort('name')} className="flex items-center gap-1 hover:text-brand-text transition-colors uppercase tracking-wider">
                      AI社員名
                      {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}
                    </button>
                  </th>
                  <th className="px-6 py-4 font-bold">カテゴリ</th>
                  <th className="px-6 py-4 font-bold text-right">
                    <button onClick={() => requestSort('conversations')} className="flex items-center justify-end gap-1 w-full hover:text-brand-text transition-colors uppercase tracking-wider">
                      会話数
                      {sortConfig?.key === 'conversations' ? (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}
                    </button>
                  </th>
                  <th className="px-6 py-4 font-bold text-right">
                    <button onClick={() => requestSort('messages')} className="flex items-center justify-end gap-1 w-full hover:text-brand-text transition-colors uppercase tracking-wider">
                      メッセージ数
                      {sortConfig?.key === 'messages' ? (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}
                    </button>
                  </th>
                  <th className="px-6 py-4 font-bold text-right">
                    <button onClick={() => requestSort('avg')} className="flex items-center justify-end gap-1 w-full hover:text-brand-text transition-colors uppercase tracking-wider">
                      平均対話回数
                      {sortConfig?.key === 'avg' ? (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}
                    </button>
                  </th>
                  <th className="px-6 py-4 font-bold text-right">
                    <button onClick={() => requestSort('tokens')} className="flex items-center justify-end gap-1 w-full hover:text-brand-text transition-colors uppercase tracking-wider">
                      トークン使用量
                      {sortConfig?.key === 'tokens' ? (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-bg">
                {sortedAndFilteredAIs.map((ai) => (
                  <tr key={ai.id} className="hover:bg-brand-bg/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-text flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-yellow/20 text-brand-text flex items-center justify-center font-bold text-xs shadow-sm">
                        {ai.name.charAt(0)}
                      </div>
                      {ai.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        ai.type === 'Basic' ? 'bg-slate-100 text-slate-600' : 'bg-brand-yellow/20 text-brand-text'
                      }`}>
                        {ai.type === 'Basic' ? 'ベーシック' : 'カスタム'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-600">{ai.conversations.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-600">{ai.messages.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-600">{(ai.messages / ai.conversations).toFixed(1)}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-600">{formatNumber(ai.tokens)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </section>

    </main>
  );
};

// -----------------------------------------------------------------------------
// [SUB COMPONENTS]
// -----------------------------------------------------------------------------

const SummaryCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  note?: string;
}> = ({ icon, title, value, note }) => (
  <GlassPanel className="p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-white">
    <div className="flex items-center gap-4 mb-4 relative z-10">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-brand-yellow text-brand-text shadow-sm">
        {icon}
      </div>
      <div className="font-bold text-slate-500 text-sm">{title}</div>
    </div>
    <div className="text-4xl font-bold text-brand-text mb-2 relative z-10 tracking-tight">{value}</div>
    {note && <p className="text-[10px] text-slate-400 mt-3 leading-tight relative z-10 font-bold">{note}</p>}
  </GlassPanel>
);

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
      active
        ? 'bg-brand-text text-white shadow-lg'
        : 'text-slate-500 hover:text-brand-text'
      }`}
  >
    {label}
  </button>
);

const RankingRow: React.FC<{
  rank: number;
  title: string;
  sub: string;
  value: number;
  type: 'bot' | 'custom' | 'user';
  valueLabel: string;
}> = ({ rank, title, sub, value, type, valueLabel }) => {
  let rankStyle = "bg-brand-bg text-slate-400";
  if (rank === 1) rankStyle = "bg-brand-yellow text-brand-text shadow-md";
  if (rank === 2) rankStyle = "bg-brand-text text-white shadow-md";
  if (rank === 3) rankStyle = "bg-slate-400 text-white shadow-sm";

  return (
    <div className="flex items-center py-3 px-4 rounded-3xl hover:bg-brand-bg transition-colors cursor-default group">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0 ${rankStyle}`}>
        {rank}
      </div>
      <div className="mr-3 p-2 rounded-full bg-white border border-slate-100 text-slate-400">
        {type === 'bot' && <Bot size={16} />}
        {type === 'custom' && <Sparkles size={16} className="text-brand-yellow" />}
        {type === 'user' && <UserIcon size={16} className="text-brand-text" />}
      </div>
      <div className="flex-1 min-w-0 mr-4">
        <div className="font-bold text-brand-text truncate text-sm">{title}</div>
        <div className="text-[10px] text-slate-400 truncate font-bold">{sub}</div>
      </div>
      <div className="text-right">
        <div className="text-brand-text font-bold text-sm">{value.toLocaleString()}</div>
        <div className="text-[10px] text-slate-400 font-bold">{valueLabel}</div>
      </div>
    </div>
  );
};