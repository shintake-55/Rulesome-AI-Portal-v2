import React, { useState } from 'react';
import { GlassPanel } from '../components/ui';
import { Bot, Sparkles, User, Trophy, BarChart, Users, Download, Loader2 } from 'lucide-react';

export const Ranking: React.FC = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('ranking-content');
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
        const button = document.getElementById('ranking-pdf-btn');
        if (button) button.style.display = 'none';

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#f0f0f0', 
            logging: false
        });

        if (button) button.style.display = '';

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = jspdf;
        
        // A4 Portrait
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width
        const pageHeight = 297; // A4 height
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Subsequent pages
        while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`ranking_report_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
        console.error('PDF Generation Error:', error);
        alert('PDFの生成に失敗しました。');
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <div id="ranking-content" className="max-w-[1400px] mx-auto pt-6 pb-12 animate-fadeIn relative">
      {/* Page Header */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="text-center w-full">
            <h1 className="text-3xl font-bold text-brand-text mb-2">人気ランキング</h1>
            <div className="text-slate-500 text-sm font-bold">株式会社エンデザイン</div>
        </div>
        
        <div className="absolute right-0 top-0">
            <button 
            id="ranking-pdf-btn"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            title="レポート出力"
            className="flex items-center justify-center w-12 h-12 bg-white text-brand-text rounded-full shadow-sm hover:bg-brand-yellow transition-all active:scale-95 disabled:opacity-50"
            >
             {isGeneratingPdf ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            </button>
        </div>
      </div>

      {/* Filters Section */}
      <GlassPanel className="p-8 mb-8 bg-white shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
           <div className="flex flex-col gap-2">
             <label className="font-bold text-brand-text text-xs uppercase tracking-wider">期間</label>
             <select className="w-full bg-brand-bg border-none rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-text/20 text-brand-text font-bold cursor-pointer">
               <option>全期間</option>
               <option>過去1週間</option>
               <option>過去1ヶ月</option>
               <option>過去3ヶ月</option>
               <option>過去1年</option>
             </select>
           </div>
           <div className="flex flex-col gap-2">
             <label className="font-bold text-brand-text text-xs uppercase tracking-wider">AI社員ソート</label>
             <select className="w-full bg-brand-bg border-none rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-text/20 text-brand-text font-bold cursor-pointer">
               <option>クリック数順</option>
               <option>メモ数順</option>
               <option>お気に入り数順</option>
             </select>
           </div>
           <div className="flex flex-col gap-2">
             <label className="font-bold text-brand-text text-xs uppercase tracking-wider">ユーザーソート</label>
             <select className="w-full bg-brand-bg border-none rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-text/20 text-brand-text font-bold cursor-pointer">
               <option>閲覧数順</option>
               <option>メモ数順</option>
               <option>お気に入り数順</option>
             </select>
           </div>
           <div>
             <button className="w-full bg-brand-yellow text-brand-text font-bold py-3 px-6 rounded-full shadow-none hover:opacity-70 transition-all">
               フィルター適用
             </button>
           </div>
        </div>
      </GlassPanel>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard value="12" label="総AI社員数" icon={<Bot size={24} className="text-brand-text" />} />
        <StatCard value="5" label="総ユーザー数" icon={<Users size={24} className="text-brand-text" />} />
        <StatCard value="108" label="総クリック数" icon={<BarChart size={24} className="text-brand-text" />} />
      </div>

      {/* Rankings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Popular AI Employees */}
        <GlassPanel className="p-0 overflow-hidden flex flex-col h-[800px] bg-white shadow-lg border border-transparent">
           <div className="p-6 border-b border-brand-bg">
             <h3 className="text-xl font-bold text-brand-text flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-text shadow-sm">
                 <Trophy size={18} />
               </div>
               人気AI社員トップ10
             </h3>
           </div>
           <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
              <RankingCard 
                rank={1} 
                title="画像生成チャットBot" 
                subtitle="gemini-pro"
                type="bot"
                stats={{ view: 18, memo: 0, fav: 0 }}
              />
              <RankingCard 
                rank={2} 
                title="シンプルチャット" 
                subtitle="gpt-4o"
                type="bot"
                stats={{ view: 16, memo: 0, fav: 0 }}
              />
              <RankingCard 
                rank={3} 
                title="漫才生成くん" 
                subtitle="custom-flow"
                type="custom"
                stats={{ view: 16, memo: 1, fav: 0 }}
              />
              <RankingCard 
                rank={4} 
                title="ドメイン管理アドバイザー" 
                subtitle="knowledge-base"
                type="bot"
                stats={{ view: 12, memo: 1, fav: 2 }}
              />
              <RankingCard 
                rank={5} 
                title="画像生成アシスタント" 
                subtitle="dify-tool"
                type="custom"
                stats={{ view: 9, memo: 0, fav: 0 }}
              />
               <RankingCard 
                rank={6} 
                title="動画解析ボット" 
                subtitle="gemini-vision"
                type="custom"
                stats={{ view: 9, memo: 0, fav: 0 }}
              />
               <RankingCard 
                rank={7} 
                title="議事録作成AI" 
                subtitle="whisper-model"
                type="bot"
                stats={{ view: 8, memo: 0, fav: 1 }}
              />
           </div>
        </GlassPanel>

        {/* Active Users */}
        <GlassPanel className="p-0 overflow-hidden flex flex-col h-[800px] bg-white shadow-lg border border-transparent">
           <div className="p-6 border-b border-brand-bg">
             <h3 className="text-xl font-bold text-brand-text flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-brand-text flex items-center justify-center text-white shadow-sm">
                 <Users size={18} />
               </div>
               アクティブユーザーランキング
             </h3>
           </div>
           <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
              <RankingCard 
                rank={1} 
                title="山田" 
                subtitle="okrtest29@t3inc.jp"
                type="user"
                stats={{ view: 77, memo: 1, fav: 0 }}
              />
              <RankingCard 
                rank={2} 
                title="田中" 
                subtitle="okrtest09@t3inc.jp"
                type="user"
                stats={{ view: 28, memo: 7, fav: 6 }}
              />
              <RankingCard 
                rank={3} 
                title="テスト" 
                subtitle="okrtest41@t3inc.jp"
                type="user"
                stats={{ view: 2, memo: 0, fav: 0 }}
              />
              <RankingCard 
                rank={4} 
                title="東京二郎" 
                subtitle="okrtest20@t3inc.jp"
                type="user"
                stats={{ view: 1, memo: 0, fav: 1 }}
              />
              <RankingCard 
                rank={5} 
                title="中野さん" 
                subtitle="ryo@en-design.com"
                type="user"
                stats={{ view: 0, memo: 0, fav: 0 }}
              />
           </div>
        </GlassPanel>

      </div>
    </div>
  );
};

const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
  <GlassPanel className="p-8 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 bg-white border border-slate-100 shadow-lg">
    <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 p-4 bg-brand-yellow rounded-full shadow-sm text-brand-text">
            {icon}
        </div>
        <div className="text-5xl font-bold text-brand-text mb-2 tracking-tight">{value}</div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
  </GlassPanel>
);

const RankingCard: React.FC<{ 
  rank: number; 
  title: string; 
  subtitle: string; 
  type: 'bot' | 'custom' | 'user';
  stats: { view: number; memo: number; fav: number };
}> = ({ rank, title, subtitle, type, stats }) => {
  // Flat High Contrast Rank Styles
  let rankStyle = "bg-brand-bg text-slate-400";
  if (rank === 1) rankStyle = "bg-brand-yellow text-brand-text shadow-md";
  if (rank === 2) rankStyle = "bg-brand-text text-white shadow-md";
  if (rank === 3) rankStyle = "bg-slate-400 text-white shadow-sm";

  return (
    <div className="flex flex-col sm:flex-row items-center p-4 rounded-3xl hover:bg-brand-bg transition-all gap-4 bg-white border border-transparent hover:border-slate-100 group cursor-default">
       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 transition-transform group-hover:scale-110 ${rankStyle}`}>
         {rank}
       </div>
       
       <div className="p-2.5 rounded-full bg-brand-bg border border-transparent text-slate-500">
          {type === 'bot' && <Bot size={20} className="text-slate-600" />}
          {type === 'custom' && <Sparkles size={20} className="text-brand-yellow" />}
          {type === 'user' && <User size={20} className="text-brand-text" />}
       </div>

       <div className="flex-1 text-center sm:text-left min-w-0 w-full">
         <div className="font-bold text-brand-text text-sm truncate group-hover:text-brand-blue transition-colors">{title}</div>
         <div className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">{subtitle}</div>
       </div>

       <div className="flex items-center gap-4 text-xs font-medium w-full sm:w-auto justify-center sm:justify-end bg-brand-bg px-5 py-2.5 rounded-full">
          <div className="text-center w-8">
            <div className="text-brand-text font-bold text-base">{stats.view}</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-tighter">閲覧</div>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <div className="text-center w-8">
            <div className="text-brand-text font-bold text-base">{stats.memo}</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-tighter">メモ</div>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <div className="text-center w-8">
            <div className="text-brand-text font-bold text-base">{stats.fav}</div>
            <div className="text-[9px] text-brand-yellow uppercase tracking-tighter">★</div>
          </div>
       </div>
    </div>
  );
};