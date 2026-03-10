import React, { useState } from 'react';
import { GlassPanel, Button, TextArea } from '../components/ui';
import { Calendar, Tag, ExternalLink, BookmarkPlus, BookmarkCheck, Save, Loader2 } from 'lucide-react';
import { Post } from '../types';

const MOCK_POST: Post = {
  id: '101',
  title: '2025年度 第1四半期 業務効率化AIツールの活用ガイドライン',
  date: '2024-04-01',
  category: '社内規定・ガイドライン',
  description: `本ドキュメントは、全社的に導入された生成AIツールを業務で安全かつ効果的に活用するためのガイドラインです。\n\n主な内容:\n1. 利用可能なAIツール一覧 (ChatGPT Team, GitHub Copilot等)\n2. 入力データの取り扱いに関するセキュリティポリシー\n3. 著作権および出力物の利用範囲について\n4. 具体的なプロンプトエンジニアリングのベストプラクティス集\n\n従業員は本ガイドラインを一読の上、日々の業務にAIを積極的に取り入れ、生産性向上に努めてください。\n不明点はIT推進部までお問い合わせください。`,
  thumbnailUrl: 'https://picsum.photos/1200/600',
  views: 1250,
  memos: 45,
  favorites: 300
};

export const PostDetail: React.FC = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [memo, setMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
  };

  const handleSaveMemo = () => {
    if (!memo.trim()) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const handleUse = () => {
    if(window.confirm('外部サイト/アプリを開きますか？')) {
      window.open('https://example.com', '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-4 pb-20 animate-fadeIn">
      
      {/* Hero Area */}
      <div className="relative w-full h-64 md:h-80 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/5 border border-white">
        <img 
          src={MOCK_POST.thumbnailUrl} 
          alt={MOCK_POST.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
      </div>

      {/* Main Info */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
              <Calendar size={14} className="text-blue-500" />
              {MOCK_POST.date}
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
              <Tag size={14} className="text-emerald-500" />
              {MOCK_POST.category}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight tracking-tight">
            {MOCK_POST.title}
          </h1>
        </div>

        <GlassPanel className="p-8">
          <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
            {MOCK_POST.description}
          </p>
        </GlassPanel>
      </div>

      {/* Primary Actions */}
      <div className="sticky bottom-6 z-30 flex flex-col gap-4 items-center">
        <div className="p-1.5 rounded-full bg-white/30 backdrop-blur-md shadow-lg border border-white/50">
           <Button 
             variant="primary" 
             size="huge" 
             className="shadow-xl px-12 min-w-[280px]"
             onClick={handleUse}
           >
             <ExternalLink size={24} />
             利用する
           </Button>
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="secondary" 
            className={`w-full md:w-auto px-8 bg-white/90 backdrop-blur transition-colors ${isFavorited ? 'text-blue-600 bg-blue-50' : ''}`}
            onClick={handleFavoriteToggle}
          >
            {isFavorited ? <BookmarkCheck size={20} className="fill-current" /> : <BookmarkPlus size={20} />}
            {isFavorited ? 'お気に入りに登録済み' : 'お気に入りに登録'}
          </Button>
        </div>
      </div>

      {/* Memo Section */}
      <div className="pt-8 border-t border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📝</span> メモ
        </h3>
        <GlassPanel className="p-6 space-y-4">
          <TextArea 
            placeholder="このPOSTに関する個人のメモを入力..." 
            rows={4}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
          <div className="flex justify-end items-center gap-3">
            {saveStatus === 'saved' && <span className="text-emerald-600 text-sm font-bold animate-pulse">保存しました！</span>}
            <Button 
              variant="glass-green" 
              onClick={handleSaveMemo}
              disabled={isSaving || !memo.trim()}
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              保存する
            </Button>
          </div>
        </GlassPanel>
      </div>

    </div>
  );
};