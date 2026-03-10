import React, { useState } from 'react';
import { GlassModal, Input, Button } from '../components/ui';
import { Search, Plus, BarChart2, Settings, Trash2, Building2 } from 'lucide-react';
import { Company, PageView } from '../types';

const INITIAL_COMPANIES: Company[] = [
  { id: '1', displayId: 'ACE-001', name: '株式会社エース', groupCount: 3, employeeCount: 5, categoryCount: 3, postCount: 2, initials: 'AC', colorClass: 'bg-blue-100 text-blue-600' },
  { id: '2', displayId: 'GLB-002', name: 'グローバル物流', groupCount: 2, employeeCount: 1, categoryCount: 1, postCount: 0, initials: 'GL', colorClass: 'bg-indigo-100 text-indigo-600' },
  { id: '3', displayId: 'NXT-003', name: 'ネクストジェン', groupCount: 2, employeeCount: 2, categoryCount: 2, postCount: 4, initials: 'NX', colorClass: 'bg-cyan-100 text-cyan-600' },
  { id: '4', displayId: 'BIO-004', name: 'バイオテック', groupCount: 5, employeeCount: 8, categoryCount: 1, postCount: 2, initials: 'BT', colorClass: 'bg-teal-100 text-teal-600' },
  { id: '5', displayId: 'FUT-005', name: 'フューチャー', groupCount: 1, employeeCount: 3, categoryCount: 4, postCount: 1, initials: 'FT', colorClass: 'bg-sky-100 text-sky-600' },
];

interface CompanyListProps {
  onNavigateSubPage?: (company: Company, view: PageView) => void;
}

export const CompanyList: React.FC<CompanyListProps> = ({ onNavigateSubPage }) => {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formName, setFormName] = useState('');
  const [formPassword, setFormPassword] = useState('');

  // Add Company Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenSettings = (company: Company) => {
    setEditingCompany(company);
    setFormName(company.name);
    setFormPassword(company.gptPassword || '2'); 
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = () => {
    if (editingCompany) {
      setCompanies(prev => prev.map(c => 
        c.id === editingCompany.id 
          ? { ...c, name: formName, gptPassword: formPassword } 
          : c
      ));
      setIsSettingsOpen(false);
      setEditingCompany(null);
    }
  };

  const handleAddCompany = () => {
    if (!newCompanyName.trim()) return;
    const newId = (companies.length + 1).toString();
    const newCompany: Company = {
      id: newId,
      displayId: `NEW-00${newId}`,
      name: newCompanyName,
      groupCount: 0,
      employeeCount: 0,
      categoryCount: 0,
      postCount: 0,
      initials: newCompanyName.substring(0, 2).toUpperCase(),
      colorClass: 'bg-slate-100 text-slate-600'
    };
    setCompanies([...companies, newCompany]);
    setNewCompanyName('');
    setIsAddModalOpen(false);
  };

  const handleDeleteCompany = (id: string) => {
    if (window.confirm('本当にこの企業を削除しますか？')) {
      setCompanies(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleNavigate = (company: Company, view: PageView) => {
    if (onNavigateSubPage) {
      onNavigateSubPage(company, view);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6 pt-4">
        <h2 className="text-3xl font-bold text-brand-text tracking-tight">企業一覧</h2>
        
        {/* Actions Row */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/40" size={18} />
            <input 
              type="text" 
              placeholder="検索" 
              className="w-full pl-11 pr-6 py-3.5 bg-white border-none rounded-full text-sm font-bold text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-blue/30 shadow-sm transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button 
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            className="w-full sm:w-auto hover:opacity-70 transition-opacity"
            size="lg"
          >
            <Plus size={20} />
            企業を追加
          </Button>
        </div>
      </div>

      {/* Grid Layout - More Spacious Gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="bg-white rounded-[30px] p-8 flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Card Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                {/* Unified Yellow Icon */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 bg-yellow-100 text-yellow-600">
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-brand-text leading-tight">{company.name}</h3>
                  {/* Removed displayId label */}
                </div>
              </div>
            </div>

            {/* Stats List */}
            <div className="space-y-4 mb-8">
               <StatRow 
                 label="グループ" 
                 count={company.groupCount} 
                 onClick={() => handleNavigate(company, PageView.COMPANY_GROUPS)}
               />
               <StatRow 
                 label="社員" 
                 count={company.employeeCount} 
                 onClick={() => handleNavigate(company, PageView.COMPANY_EMPLOYEES)}
               />
               <StatRow 
                 label="カテゴリ" 
                 count={company.categoryCount} 
                 onClick={() => handleNavigate(company, PageView.COMPANY_CATEGORIES)}
               />
               <StatRow 
                 label="POST" 
                 count={company.postCount} 
                 onClick={() => handleNavigate(company, PageView.COMPANY_POSTS)}
               />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <button 
                onClick={() => handleNavigate(company, PageView.COMPANY_STATS)}
                className="flex items-center justify-center gap-2 py-3 bg-brand-text text-white text-sm font-bold rounded-full hover:opacity-70 transition-opacity"
              >
                <BarChart2 size={18} />
                統計
              </button>
              <button 
                onClick={() => handleOpenSettings(company)}
                className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-brand-text text-sm font-bold rounded-full hover:opacity-70 transition-opacity"
              >
                <Settings size={18} />
                設定
              </button>
            </div>

            {/* Footer Delete */}
            <div className="flex justify-center mt-6 pt-2">
               <button 
                 onClick={() => handleDeleteCompany(company.id)}
                 className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                 title="削除"
                >
                 <Trash2 size={20} />
               </button>
            </div>
          </div>
        ))}
        
        {filteredCompanies.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold">
                検索結果がありません
            </div>
        )}
      </div>

      {/* Settings Modal */}
      <GlassModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="企業名を編集"
        onSave={handleSaveSettings}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-text flex items-center gap-2">
              企業名 <span className="text-brand-blue text-xs font-normal">※必須</span>
            </label>
            <Input 
              value={formName} 
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-text">Chat GPTsパスワード</label>
            <Input 
              value={formPassword} 
              onChange={(e) => setFormPassword(e.target.value)}
            />
          </div>
        </div>
      </GlassModal>

      {/* Add Company Modal */}
      <GlassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="企業を追加"
        onSave={handleAddCompany}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-text flex items-center gap-2">
              企業名 <span className="text-brand-blue text-xs font-normal">※必須</span>
            </label>
            <Input 
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="株式会社Example"
            />
          </div>
        </div>
      </GlassModal>
    </div>
  );
};

const StatRow: React.FC<{ label: string; count: number; onClick: () => void }> = ({ label, count, onClick }) => (
  <div className="flex items-center justify-between text-sm group cursor-pointer" onClick={onClick}>
    <span className="text-slate-500 font-bold group-hover:text-brand-text transition-colors">{label}</span>
    <div className="flex items-center gap-2">
        <span className="font-bold text-brand-text text-base">{count}</span>
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-brand-blue hover:bg-brand-blue hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <Settings size={14} />
        </button>
    </div>
  </div>
);