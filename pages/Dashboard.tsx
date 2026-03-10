import React, { useState, useMemo } from 'react';
import { GlassPanel } from '../components/ui';
import { 
  BarChart2, FileText, Star, Users, ArrowUpRight, ArrowDownRight, 
  Bot, Sparkles, User, ChevronRight, Download, Loader2 
} from 'lucide-react';

interface DashboardProps {
  onNavigateRanking: () => void;
}

// -----------------------------------------------------------------------------
// [MOCK DATA] チャート用ダミーデータ
// -----------------------------------------------------------------------------
const CHART_DATA = {
  year: {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    clicks: [120, 150, 300, 450, 800, 650],
    memos: [30, 40, 80, 120, 200, 180],
    favs: [10, 20, 50, 90, 150, 130]
  },
  month: {
    labels: ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月'],
    clicks: [120, 180, 150, 240, 300, 280, 450, 400, 380, 500, 480, 600],
    memos: [20, 40, 30, 50, 80, 70, 120, 100, 90, 150, 140, 180],
    favs: [10, 25, 20, 40, 60, 50, 100, 80, 70, 110, 100, 130]
  },
  day: {
    labels: ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日'],
    clicks: [45, 50, 40, 60, 80, 75, 90, 120, 110, 130, 95, 80, 100, 140],
    memos: [10, 12, 8, 15, 20, 18, 25, 30, 28, 35, 25, 20, 28, 40],
    favs: [5, 8, 5, 10, 15, 12, 20, 25, 22, 28, 18, 15, 20, 30]
  }
};

// -----------------------------------------------------------------------------
// [PAGE COMPONENT] ダッシュボード画面
// -----------------------------------------------------------------------------
export const Dashboard: React.FC<DashboardProps> = ({ onNavigateRanking }) => {
  // --- State Definitions ---
  const [activeTab, setActiveTab] = useState<'year' | 'month' | 'day'>('month');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // --- Handlers ---

  /**
   * PDFレポート出力機能
   * html2canvas でDOMを画像化し、jspdf でPDF化してダウンロードさせる
   */
  const handleDownloadPDF = async () => {
    const element = document.getElementById('dashboard-content');
    if (!element) return;

    // @ts-ignore
    const html2canvas = window.html2canvas;
    // @ts-ignore
    const jspdf = window.jspdf;

    if (!html2canvas || !jspdf) {
      alert('PDF生成ライブラリを読み込み中です。少々お待ちください。');
      return;
    }

    setIsGeneratingPdf(true);

    try {
      // PDF化の際、ダウンロードボタン自体は不要なので一時的に非表示にする
      const button = document.getElementById('pdf-download-btn');
      if (button) button.style.display = 'none';

      // HTML -> Canvas 変換
      const canvas = await html2canvas(element, {
        scale: 2, // 高解像度対応
        useCORS: true,
        backgroundColor: '#f0f0f0',
        logging: false
      });

      // ボタンの再表示
      if (button) button.style.display = '';

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = jspdf;

      // PDF設定 (A4縦)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4幅 (mm)
      const pageHeight = 297; // A4高さ (mm)

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // 1ページ目の出力
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // ページ分割が必要な場合のループ処理
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`dashboard_report_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('PDFの生成に失敗しました。');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // --- Render ---
  return (
    <main id="dashboard-content" className="max-w-[1400px] mx-auto pt-6 animate-fadeIn pb-8 relative">
      
      {/* 
        [HEADER]
        ページタイトルとPDF出力ボタン 
      */}
      <header className="relative flex items-center justify-center mb-10 px-4">
        <div className="text-center w-full">
          <h1 className="text-3xl font-bold text-slate-700 tracking-tight mb-2">
            統計ダッシュボード
          </h1>
          <div className="text-slate-500 text-sm font-bold">
            株式会社エンデザイン
          </div>
        </div>

        {/* PDF Download Action */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 transform sm:transform-none sm:top-0 sm:right-0">
          <button
            id="pdf-download-btn"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            title="レポート出力"
            className="flex items-center justify-center w-12 h-12 bg-white text-brand-text rounded-full shadow-sm hover:bg-brand-yellow transition-all active:scale-95 disabled:opacity-50"
          >
            {isGeneratingPdf ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
          </button>
        </div>
      </header>

      {/* 
        [KPI CARDS]
        主要指標のサマリー表示エリア
      */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          value="85"
          trend="+5.2%"
          trendUp={true}
        />
        <SummaryCard
          icon={<Star className="text-brand-text" size={24} />}
          title="お気に入り追加"
          value="42"
          trend="-2.1%"
          trendUp={false}
        />
        <SummaryCard
          icon={<Users className="text-brand-text" size={24} />}
          title="アクティブユーザー"
          value="34"
          trend="+8.5%"
          trendUp={true}
          note="※過去30日間の実稼働数"
        />
      </section>

      {/* 
        [CHARTS AREA]
        推移グラフと円グラフの表示
      */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left: Trend Chart */}
        <GlassPanel className="lg:col-span-2 p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
              <div className="w-2 h-6 bg-brand-yellow rounded-full"></div>
              アクション推移
            </h3>
            
            {/* Chart Filter Tabs */}
            <div className="flex bg-brand-bg p-1 rounded-full">
              <TabButton label="年別" active={activeTab === 'year'} onClick={() => setActiveTab('year')} />
              <TabButton label="月別" active={activeTab === 'month'} onClick={() => setActiveTab('month')} />
              <TabButton label="日別" active={activeTab === 'day'} onClick={() => setActiveTab('day')} />
            </div>
          </div>

          {/* SVG Chart Container */}
          <div className="h-80 w-full relative p-2">
            <TrendChart activeTab={activeTab} />
          </div>
          
          <div className="flex justify-center gap-6 mt-6">
            <LegendItem color="bg-brand-text" label="クリック" />
            <LegendItem color="bg-brand-yellow" label="メモ" />
            <LegendItem color="bg-slate-300" label="お気に入り" />
          </div>
        </GlassPanel>

        {/* Right: Engagement Donut Chart */}
        <GlassPanel className="p-8 flex flex-col">
          <h3 className="text-xl font-bold text-brand-text mb-8 flex items-center gap-2">
            <div className="w-2 h-6 bg-brand-text rounded-full"></div>
            エンゲージメント
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <InteractiveDonutChart />
          </div>
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <LegendItem color="bg-brand-text" label="クリック" />
            <LegendItem color="bg-brand-yellow" label="メモ" />
            <LegendItem color="bg-slate-300" label="お気に入り" />
          </div>
        </GlassPanel>
      </section>

      {/* 
        [BOTTOM RANKINGS]
        人気AIとアクティブユーザーのランキングリスト
      */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {/* Popular AI Employees */}
        <GlassPanel className="p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-brand-bg">
            <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
              <Sparkles className="text-brand-yellow" size={24} fill="currentColor" />
              人気AI社員トップ10
            </h3>
          </div>
          <div className="p-4 space-y-2">
            <RankingRow rank={1} title="画像生成チャットBot" sub="gemini-pro" value={18} type="bot" />
            <RankingRow rank={2} title="シンプルチャット" sub="gpt-4o" value={16} type="bot" />
            <RankingRow rank={3} title="漫才生成くん" sub="custom-flow" value={16} type="custom" />
            <RankingRow rank={4} title="ドメイン管理アドバイザー" sub="knowledge-base" value={12} type="bot" />
            <RankingRow rank={5} title="画像生成アシスタント" sub="dify-tool" value={9} type="custom" />
          </div>
          <div className="p-6 mt-auto border-t border-brand-bg text-center">
            <button
              onClick={onNavigateRanking}
              className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-bg hover:bg-brand-yellow hover:text-brand-text text-slate-500 font-bold text-sm transition-all duration-300 overflow-hidden"
            >
              <span>もっと見る</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </GlassPanel>

        {/* Active Users */}
        <GlassPanel className="p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-brand-bg">
            <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
              <User className="text-brand-text" size={24} fill="currentColor" />
              アクティブユーザーTOP10
            </h3>
            <p className="text-xs text-slate-400 mt-1 ml-9">※過去30日間の実稼働ランキング</p>
          </div>
          <div className="p-4 space-y-2">
            <RankingRow rank={1} title="山田" sub="okrtest29@t3inc.jp" value={75} type="user" />
            <RankingRow rank={2} title="田中" sub="okrtest09@t3inc.jp" value={10} type="user" />
            <RankingRow rank={3} title="東京二郎" sub="okrtest20@t3inc.jp" value={5} type="user" />
            <RankingRow rank={4} title="中野さん" sub="ryo@en-design.com" value={2} type="user" />
            <RankingRow rank={5} title="テスト" sub="okrtest41@t3inc.jp" value={1} type="user" />
          </div>
          <div className="p-6 mt-auto border-t border-brand-bg text-center">
            <button
              onClick={onNavigateRanking}
              className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-bg hover:bg-brand-yellow hover:text-brand-text text-slate-500 font-bold text-sm transition-all duration-300 overflow-hidden"
            >
              <span>もっと見る</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </GlassPanel>
      </section>
    </main>
  );
};

// -----------------------------------------------------------------------------
// [COMPONENT] Dynamic Trend Chart (SVG)
// -----------------------------------------------------------------------------
const TrendChart: React.FC<{ activeTab: 'year' | 'month' | 'day' }> = ({ activeTab }) => {
  const data = CHART_DATA[activeTab];

  // SVG Configuration
  const viewBoxWidth = 1000;
  const viewBoxHeight = 300;
  const paddingX = 60;
  const paddingY = 40;
  const graphWidth = viewBoxWidth - paddingX * 2;
  const graphHeight = viewBoxHeight - paddingY * 2;

  // Max Value Calculation (with 10% headroom for visuals)
  const maxVal = Math.max(...data.clicks, ...data.memos, ...data.favs) * 1.1;

  // 座標計算ヘルパー：データ値をSVGの座標(x,y)に変換
  const getPoints = (values: number[]) => {
    return values.map((val, i) => {
      const x = paddingX + (i / (data.labels.length - 1)) * graphWidth;
      const y = viewBoxHeight - paddingY - (val / maxVal) * graphHeight;
      return { x, y, val };
    });
  };

  const clicksPoints = getPoints(data.clicks);
  const memosPoints = getPoints(data.memos);
  const favsPoints = getPoints(data.favs);

  // パス生成ヘルパー：座標配列をSVGのd属性文字列に変換
  const makePath = (points: { x: number, y: number }[]) => {
    return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  };

  return (
    <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full" preserveAspectRatio="none">
      {/* Grid Lines (Horizontal) */}
      {Array.from({ length: 5 }).map((_, i) => {
        const y = paddingY + (i / 4) * graphHeight;
        return (
          <line key={i} x1={paddingX} y1={y} x2={viewBoxWidth - paddingX} y2={y} stroke="#f0f0f0" strokeWidth="2" />
        );
      })}

      {/* X-Axis Labels */}
      {data.labels.map((label, i) => {
        const x = paddingX + (i / (data.labels.length - 1)) * graphWidth;
        return (
          <text key={i} x={x} y={viewBoxHeight - 10} textAnchor="middle" fontSize="12" fill="#94A3B8" className="font-mono">
            {label}
          </text>
        );
      })}

      {/* 
         Data Lines 
         Color Mapping:
         - Clicks: Black (#1e1e1e)
         - Memos: Yellow (#fbe233)
         - Favs: Gray (#cbd5e1)
      */}
      <path d={makePath(clicksPoints)} fill="none" stroke="#1e1e1e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
      <path d={makePath(memosPoints)} fill="none" stroke="#fbe233" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={makePath(favsPoints)} fill="none" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="8 8" strokeLinecap="round" />

      {/* Data Points (Dots) */}
      {clicksPoints.map((p, i) => (
        <g key={`c-${i}`}>
          <circle cx={p.x} cy={p.y} r="6" fill="#1e1e1e" stroke="white" strokeWidth="3" />
        </g>
      ))}
      {memosPoints.map((p, i) => (
        <g key={`m-${i}`}>
          <circle cx={p.x} cy={p.y} r="6" fill="#fbe233" stroke="white" strokeWidth="3" />
        </g>
      ))}
    </svg>
  );
};

// -----------------------------------------------------------------------------
// [COMPONENT] Interactive Donut Chart
// -----------------------------------------------------------------------------
const InteractiveDonutChart: React.FC = () => {
  const total = 123;
  const clicks = 85; // ~70%
  const memos = 25;  // ~20%
  const favs = 13;   // ~10%

  // SVG Geometry Calculations
  // Circumference (C) = 2 * PI * r (r=40) => approx 251.2
  const C = 251.2;
  
  // Segment 1 (Clicks)
  const off1 = 0;
  const len1 = (clicks / total) * C;

  // Segment 2 (Memos)
  const off2 = -len1;
  const len2 = (memos / total) * C;

  // Segment 3 (Favs)
  const off3 = -(len1 + len2);
  const len3 = (favs / total) * C;

  const [hoveredData, setHoveredData] = useState<{ label: string, value: number, color: string } | null>(null);

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {/* Background Track */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="16" />

        {/* Clicks Segment (Black) */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="#1e1e1e"
          strokeWidth="16"
          strokeDasharray={`${len1} ${C}`}
          strokeDashoffset={off1}
          strokeLinecap="round"
          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
          onMouseEnter={() => setHoveredData({ label: 'Clicks', value: clicks, color: 'text-brand-text' })}
          onMouseLeave={() => setHoveredData(null)}
        />

        {/* Memos Segment (Yellow) */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="#fbe233"
          strokeWidth="16"
          strokeDasharray={`${len2} ${C}`}
          strokeDashoffset={off2}
          strokeLinecap="round"
          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
          onMouseEnter={() => setHoveredData({ label: 'Memos', value: memos, color: 'text-brand-yellow' })}
          onMouseLeave={() => setHoveredData(null)}
        />

        {/* Favs Segment (Gray) */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="16"
          strokeDasharray={`${len3} ${C}`}
          strokeDashoffset={off3}
          strokeLinecap="round"
          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
          onMouseEnter={() => setHoveredData({ label: 'Favorites', value: favs, color: 'text-slate-400' })}
          onMouseLeave={() => setHoveredData(null)}
        />
      </svg>

      {/* Center Tooltip / Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className={`text-3xl font-bold tracking-tighter transition-colors duration-300 ${hoveredData ? hoveredData.color : 'text-brand-text'}`}>
          {hoveredData ? hoveredData.value : total}
        </div>
        <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
          {hoveredData ? hoveredData.label : 'Total Actions'}
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// [COMPONENT] Sub-components for List/Grid Items
// -----------------------------------------------------------------------------

const SummaryCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  note?: string;
}> = ({ icon, title, value, trend, trendUp, note }) => (
  <GlassPanel className="p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-white">
    <div className="flex items-center gap-4 mb-4 relative z-10">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-brand-yellow text-brand-text shadow-sm">
        {icon}
      </div>
      <div className="font-bold text-slate-500 text-sm">{title}</div>
    </div>

    <div className="text-5xl font-bold text-brand-text mb-2 relative z-10 tracking-tight">{value}</div>

    <div className={`flex items-center gap-1 text-sm font-bold relative z-10 ${trendUp ? 'text-brand-text' : 'text-slate-400'}`}>
      {trendUp ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
      前月比 <span className={trendUp ? 'bg-brand-bg px-2 py-0.5 rounded-full' : ''}>{trend}</span>
    </div>

    {note && <p className="text-[10px] text-slate-400 mt-3 leading-tight relative z-10">{note}</p>}
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

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
    <div className={`w-3 h-3 rounded-full ${color}`} />
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
  // Rank Badge Styles
  let rankStyle = "bg-brand-bg text-slate-400";
  if (rank === 1) rankStyle = "bg-brand-yellow text-brand-text shadow-md";
  if (rank === 2) rankStyle = "bg-brand-text text-white shadow-md";
  if (rank === 3) rankStyle = "bg-slate-400 text-white shadow-sm";

  return (
    <div className="flex items-center py-3 px-4 rounded-3xl hover:bg-brand-bg transition-colors cursor-default group">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0 ${rankStyle}`}>
        {rank}
      </div>

      {/* Type Icon */}
      <div className="mr-3 p-2 rounded-full bg-white border border-slate-100 text-slate-400">
        {type === 'bot' && <Bot size={16} />}
        {type === 'custom' && <Sparkles size={16} />}
        {type === 'user' && <User size={16} />}
      </div>

      <div className="flex-1 min-w-0 mr-4">
        <div className="font-bold text-brand-text truncate text-sm">{title}</div>
        <div className="text-[10px] text-slate-400 truncate">{sub}</div>
      </div>

      <div className="text-brand-text font-bold text-sm">
        {value}
      </div>
    </div>
  );
};