import React, { useState } from 'react';
import { GlassPanel, Button, Input, Badge } from '../components/ui';
import { Search, ChevronDown, Eye, FileText, Star, Calendar, ArrowRight } from 'lucide-react';

// Mock data matching the user's screenshot
const POSTS_DATA = [
  { id: '1', date: '2025-12-09', title: 'チャットフローのチャットで画像生成応答のサンプル', content: 'gemini', category: 'T3のDify' },
  { id: '2', date: '2025-12-08', title: '漫才', content: '言葉を2つ投げるとか漫才を書いてくれます', category: 'T3のDify' },
  { id: '3', date: '2025-12-04', title: '動画解釈可能', content: 'あ', category: 'T3のDify' },
  { id: '4', date: '2025-11-27', title: '(difyのバージョン上げたら動かなくなった) 画像生成チャット', content: '画像生成が可能なチャットです。', category: 'T3のDify' },
  { id: '5', date: '2025-11-20', title: 'OCR', content: 'OCR', category: 'T3のDify' },
  { id: '6', date: '2025-11-13', title: '議事録作成AI_株式会社ワーキングスタイル', content: 'a', category: 'エンデザインのDify' },
  { id: '7', date: '2025-11-13', title: 'PDF見積書文字起こしAI_株式会社宮崎塗装', content: 'a', category: 'エンデザインのDify' },
  { id: '8', date: '2025-11-13', title: 'SEOブログ制作AI', content: 'a', category: 'エンデザインのDify' },
  { id: '9', date: '2025-11-13', title: 'シンプルチャット(画像解釈可能)', content: 'a', category: 'T3のDify' },
  { id: '10', date: '2025-08-26', title: 'ドメイン購入時の注意点2025', content: 'jj', category: 'その他URL' },
  { id: '11', date: '2025-03-13', title: 'ドメイン所得とサーバーへの関連付け', content: '重要なことなので新人は学ぶこと！', category: 'その他URL' },
  { id: '12', date: '2025-03-13', title: 'ドメイン購入時の注意点2010', content: 'よくトラブるので読んでおくこと。', category: 'その他URL' },
];

export const PostList: React.FC<{ onPostClick: (id: string) => void }> = ({ onPostClick }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'memo' | 'fav'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('カテゴリ');

  const filteredPosts = POSTS_DATA.filter(post => {
     const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           post.content.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesCategory = selectedCategory === 'カテゴリ' || post.category === selectedCategory;
     // Mocking tab filter for demonstration
     const matchesTab = activeTab === 'all' || 
                        (activeTab === 'memo' && parseInt(post.id) % 2 === 0) || 
                        (activeTab === 'fav' && parseInt(post.id) % 3 === 0);
     
     return matchesSearch && matchesCategory && matchesTab;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('カテゴリ');
    setActiveTab('all');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pt-4">
      
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 px-2 pb-1">
        <TabButton label="全て" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
        <TabButton label="メモ" active={activeTab === 'memo'} onClick={() => setActiveTab('memo')} />
        <TabButton label="お気に入り" active={activeTab === 'fav'} onClick={() => setActiveTab('fav')} />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative md:w-48 w-full">
          <select 
            className="w-full appearance-none bg-slate-50 border-none text-slate-700 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium text-sm hover:bg-slate-100 transition-colors"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>カテゴリ</option>
            <option>T3のDify</option>
            <option>エンデザインのDify</option>
            <option>その他URL</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
        
        <div className="flex-1 w-full">
          <Input 
             placeholder="フリーワード" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="bg-slate-50 border-none"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="primary" className="flex-1 md:flex-none">
            絞り込む
          </Button>
          <Button 
            variant="secondary" 
            className="flex-1 md:flex-none bg-slate-100 text-slate-600 hover:bg-slate-200"
            onClick={handleClearFilters}
          >
            解除
          </Button>
        </div>
      </div>

      {/* Grid Layout of Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {filteredPosts.map((post) => (
          <GlassPanel 
            key={post.id} 
            className="flex flex-col h-full group cursor-pointer hover:-translate-y-2 hover:shadow-lg transition-all duration-300 overflow-hidden bg-white/80 border-white"
            onClick={() => onPostClick(post.id)}
          >
            {/* Header: Date & Category */}
            <div className="p-5 pb-0 flex items-start justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Calendar size={14} className="text-blue-500" />
                {post.date}
              </div>
              <Badge 
                label={post.category} 
                count={0} 
                color="bg-blue-50 text-blue-700" 
              />
            </div>

            {/* Body: Title & Content */}
            <div className="p-5 flex-1 flex flex-col gap-3">
              <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-3">
                {post.content}
              </p>
            </div>

            {/* Footer: Stats & Action */}
            <div className="px-5 py-4 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between text-slate-400 text-xs">
              <div className="flex gap-4">
                <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <Eye size={14} />
                  <span>1.2k</span>
                </div>
                <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <FileText size={14} />
                  <span>45</span>
                </div>
                <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <Star size={14} />
                  <span>30</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                詳細 <ArrowRight size={14} />
              </div>
            </div>
          </GlassPanel>
        ))}
        {filteredPosts.length === 0 && <div className="col-span-full text-center text-gray-400 py-10">条件に一致するPOSTがありません</div>}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${active ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
  >
    {label}
  </button>
);