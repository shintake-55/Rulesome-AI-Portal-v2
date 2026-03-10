import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Link as LinkIcon, ChevronDown, GripVertical, Trash, Info, 
  Camera, MousePointerClick, Star, Bot, Sparkles, Check, Users, Tag, ChevronRight, 
  FileText, Edit, BarChart, Lightbulb, MessageCircle, PenTool, BookOpen, CheckSquare, Code, Box 
} from 'lucide-react';
import { AIEmployee, BasicCategory } from '../types';
import { GlassModal, Input, Button, TextArea } from '../components/ui';

// -----------------------------------------------------------------------------
// [MOCK DATA] フォーム用マスターデータ
// -----------------------------------------------------------------------------
const COMPANIES = [
  { id: '19', name: '株式会社T160' },
  { id: '18', name: '株式会社T43' },
  { id: '6', name: '株式会社エンデザイン' },
  { id: '1', name: 'テスト企業1' },
];

const GROUPS_BY_COMPANY: Record<string, { id: string, name: string }[]> = {
  '6': [ // En Design
    { id: '11', name: '営業' },
    { id: '12', name: '制作チーム' },
    { id: '19', name: '技術部' },
    { id: '20', name: 'AI開発部' },
    { id: '17', name: 'タイランド' }
  ],
  '1': [ // Test Company
    { id: '3', name: 'テストグループ' },
    { id: '5', name: 'テスト企業グループ1' }
  ]
};

const CATEGORIES_BY_COMPANY: Record<string, { id: string, name: string }[]> = {
  '6': [
    { id: '6', name: 'エンデザインのDify' },
    { id: '13', name: 'T3のDify' },
    { id: '12', name: 'その他URL' }
  ],
  '1': [
    { id: '1', name: 'テストカテゴリ1' }
  ]
};

// ベーシックカテゴリ用アイコンマッピング
const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText size={20} />,
  Edit: <Edit size={20} />,
  BarChart: <BarChart size={20} />,
  Lightbulb: <Lightbulb size={20} />,
  MessageCircle: <MessageCircle size={20} />,
  PenTool: <PenTool size={20} />,
  BookOpen: <BookOpen size={20} />,
  CheckSquare: <CheckSquare size={20} />,
  Code: <Code size={20} />,
  Default: <Box size={20} />
};

interface AIEmployeeListProps {
  userRole: string;
  onChatStart: (employee: AIEmployee) => void;
  currentTab: 'basic' | 'custom';
  onTabChange: (tab: 'basic' | 'custom') => void;
  basicCategories: BasicCategory[];
  // Data passed from parent
  employees: AIEmployee[];
  onUpdateEmployees: (employees: AIEmployee[]) => void;
}

// -----------------------------------------------------------------------------
// [PAGE COMPONENT] AI社員一覧リスト
// -----------------------------------------------------------------------------
export const AIEmployeeList: React.FC<AIEmployeeListProps> = ({ 
  userRole, 
  onChatStart, 
  currentTab, 
  onTabChange, 
  basicCategories,
  employees,
  onUpdateEmployees
}) => {
  // Filters State
  const [activeTab, setActiveTab] = useState<'all' | 'memo' | 'fav'>('all');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('カテゴリ');
  
  // Modal & Edit State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<AIEmployee | null>(null);

  // Accordion State for Basic Categories
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Permission Checks
  const isMasterAdmin = userRole === 'master_admin';
  const isAdmin = userRole === 'admin';
  const canEdit = isMasterAdmin || isAdmin;
  const canDelete = isMasterAdmin;

  // --- Handlers & Helpers ---

  const toggleCategory = (catId: string) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(catId)) {
      newSet.delete(catId);
    } else {
      newSet.add(catId);
    }
    setExpandedCategories(newSet);
  };

  /**
   * 社員データのフィルタリングロジック
   * 1. タブ（Basic/Custom）の一致
   * 2. キーワード検索（タイトルorタグ）
   * 3. 状態フィルター（お気に入り/メモ）
   * 4. カテゴリフィルター（Customのみ）
   */
  const filteredEmployees = employees.filter(emp => {
    // 1. Tab check
    if (emp.type !== currentTab) return false;

    // 2. Keyword & Status check
    const keywordMatch = emp.title.toLowerCase().includes(search.toLowerCase()) || emp.tag.toLowerCase().includes(search.toLowerCase());
    const tabMatch = activeTab === 'all' ? true : activeTab === 'fav' ? emp.favorites > 0 : emp.memos > 0;

    // 3. Category check (Custom specific)
    let categoryMatch = true;
    if (currentTab === 'custom') {
      categoryMatch = selectedCategory === 'カテゴリ' || selectedCategory === emp.companyName || selectedCategory === '12';
    }

    return keywordMatch && tabMatch && categoryMatch;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('このAI社員を削除しますか？')) {
      onUpdateEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (employee: AIEmployee) => {
    setEditingEmployee(employee);
    setIsFormModalOpen(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onUpdateEmployees(employees.map(emp => {
      if (emp.id === id) {
        const isFav = emp.favorites > 0;
        return { ...emp, favorites: isFav ? 0 : emp.favorites + 1 };
      }
      return emp;
    }));
  };

  /**
   * フォーム保存処理
   */
  const handleSaveForm = (formData: any) => {
    if (editingEmployee) {
      onUpdateEmployees(employees.map(e => e.id === editingEmployee.id ? {
        ...e,
        // Admin saves only specific fields, Master Admin saves all.
        title: formData.title !== undefined ? formData.title : e.title,
        tag: formData.body !== undefined ? formData.body : e.tag,
        etc: formData.etc !== undefined ? formData.etc : e.etc,
        iconUrl: formData.iconUrl !== undefined ? formData.iconUrl : e.iconUrl,
        
        // Master Admin only fields
        isNew: formData.isNew !== undefined ? formData.isNew : e.isNew,

        // Update Group names from IDs (Simplified for mock)
        teams: formData.groupIds ? formData.groupIds.map((gid: string) => {
          const groups = GROUPS_BY_COMPANY[formData.companyId || '6'] || [];
          return groups.find(g => g.id === gid)?.name || 'Group';
        }) : e.teams,

        companyName: formData.companyId ? (COMPANIES.find(c => c.id === formData.companyId)?.name || e.companyName) : e.companyName,
        basicCategoryId: formData.basicCategoryId,
        type: currentTab
      } : e));
    } else {
      // Create New Employee
      const newEmp: AIEmployee = {
        id: Date.now().toString(),
        title: formData.title || '新規AI社員',
        date: new Date().toISOString().split('T')[0],
        tag: formData.body || '',
        etc: formData.etc || '',
        iconUrl: formData.iconUrl,
        isNew: formData.isNew || false,
        companyName: currentTab === 'basic' ? 'System' : (COMPANIES.find(c => c.id === formData.companyId)?.name || '新規企業'),
        teams: formData.groupIds ? formData.groupIds.map((gid: string) => {
          const groups = GROUPS_BY_COMPANY[formData.companyId || '6'] || [];
          return groups.find(g => g.id === gid)?.name || 'Group';
        }) : ['全社共通'],
        clicks: 0,
        favorites: 0,
        memos: 0,
        type: currentTab,
        basicCategoryId: formData.basicCategoryId
      };
      onUpdateEmployees([newEmp, ...employees]);
    }
    setIsFormModalOpen(false);
  };

  const toggleFavoriteFilter = () => {
    setActiveTab(prev => prev === 'fav' ? 'all' : 'fav');
  };

  // --- Render ---
  return (
    <div className="max-w-[1400px] mx-auto pt-4">

      {/* 
        [TAB SWITCHER]
        Basic / Custom のメイン切り替えスイッチ
        Unified active color to Yellow
      */}
      <nav className="flex justify-center mb-8">
        <div className="bg-white p-1.5 rounded-full shadow-sm border border-slate-200 inline-flex relative">
          <button
            onClick={() => onTabChange('custom')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 relative z-10 ${
              currentTab === 'custom'
                ? 'bg-brand-yellow text-brand-text shadow-md' // Changed to Yellow
                : 'text-slate-500 hover:text-brand-text hover:bg-slate-50'
              }`}
          >
            <Sparkles size={18} />
            カスタムAI社員
          </button>
          <button
            onClick={() => onTabChange('basic')}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 relative z-10 ${
              currentTab === 'basic'
                ? 'bg-brand-yellow text-brand-text shadow-md'
                : 'text-slate-500 hover:text-brand-text hover:bg-slate-50'
              }`}
          >
            <Bot size={18} />
            ベーシックAI社員
          </button>
        </div>
      </nav>

      {/* 
        [FILTER BAR]
        検索、カテゴリ絞り込み、お気に入りフィルター、追加ボタン
      */}
      <section className="flex flex-wrap items-center gap-3 mb-8 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 animate-fadeIn">
        {currentTab === 'custom' && (
          <div className="relative">
            <select
              className="appearance-none px-5 py-2.5 pr-10 rounded-full bg-slate-50 text-brand-text text-sm font-medium hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-text/20 min-w-[150px]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="カテゴリ">カテゴリ</option>
              <option value="6">エンデザインのDify</option>
              <option value="13">T3のDify</option>
              <option value="12">その他URL</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        )}

        {/* Favorite Toggle */}
        <button
          onClick={toggleFavoriteFilter}
          className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 ${
            activeTab === 'fav'
              ? 'bg-brand-yellow border-brand-yellow text-brand-text shadow-inner'
              : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100 hover:text-brand-text'
            }`}
          title={activeTab === 'fav' ? "全てのAI社員を表示" : "お気に入りのみ表示"}
        >
          <Star size={20} className={activeTab === 'fav' ? 'fill-current' : ''} />
        </button>

        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="フリーワード検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-2.5 bg-slate-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-text/20 placeholder-slate-400"
          />
        </div>

        <Button variant="primary">
          絞り込む
        </Button>
        <Button
          variant="secondary"
          onClick={() => { setSearch(''); setSelectedCategory('カテゴリ'); setActiveTab('all'); }}
        >
          解除
        </Button>

        {/* Add Button (Master Admin only) */}
        <div className="ml-auto pl-4 border-l border-slate-200">
          {isMasterAdmin && (
            <Button onClick={handleOpenAddModal} variant="glass-green" className="!rounded-full bg-brand-text text-white">
              <Plus size={18} /> AI社員を追加
            </Button>
          )}
        </div>
      </section>

      {/* 
        [CONTENT AREA]
        一覧表示エリア (Basic: アコーディオン / Custom: グリッド)
      */}
      
      {/* 1. BASIC VIEW */}
      {currentTab === 'basic' && (
        <div className="space-y-4 animate-fadeIn pb-12">
          {basicCategories.sort((a, b) => a.order - b.order).map(cat => {
            const catEmployees = filteredEmployees.filter(e => e.basicCategoryId === cat.id);
            const isExpanded = expandedCategories.has(cat.id);
            const isEmpty = catEmployees.length === 0;

            return (
              <div key={cat.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm transition-all duration-300">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-slate-50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-bg text-slate-500 flex items-center justify-center">
                      {ICON_MAP[cat.icon] || ICON_MAP['Default']}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{cat.name}</h3>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{catEmployees.length}</span>
                  </div>
                  <div className={`p-2 rounded-full bg-white text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {/* Expanded Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catEmployees.map((employee, index) => (
                      <AIEmployeeCard
                        key={employee.id}
                        data={employee}
                        index={index}
                        onDelete={() => handleDelete(employee.id)}
                        onEdit={() => handleOpenEditModal(employee)}
                        onClick={() => onChatStart(employee)}
                        onToggleFavorite={(e) => handleToggleFavorite(e, employee.id)}
                        canEdit={canEdit}
                        canDelete={canDelete}
                      />
                    ))}
                    {isEmpty && (
                      <div className="col-span-full py-6 text-center text-slate-400 text-sm">
                        このカテゴリにAI社員は登録されていません
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. CUSTOM VIEW */}
      {currentTab === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12 animate-fadeIn">
          {filteredEmployees.map((employee, index) => (
            <AIEmployeeCard
              key={employee.id}
              data={employee}
              index={index}
              onDelete={() => handleDelete(employee.id)}
              onEdit={() => handleOpenEditModal(employee)}
              onClick={() => onChatStart(employee)}
              onToggleFavorite={(e) => handleToggleFavorite(e, employee.id)}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ))}
          {filteredEmployees.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 text-slate-400">
                <Bot size={32} />
              </div>
              <p className="text-slate-500 font-bold">該当するAI社員が見つかりません</p>
            </div>
          )}
        </div>
      )}

      {/* 
        [MODAL]
        AI社員編集・追加用モーダルフォーム
      */}
      {isFormModalOpen && (
        <AIEmployeeFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          employee={editingEmployee}
          onSave={handleSaveForm}
          userRole={userRole}
          basicCategories={basicCategories}
          forcedTab={currentTab}
        />
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// [COMPONENT] AI Employee Card Item
// -----------------------------------------------------------------------------
const AIEmployeeCard: React.FC<{
  data: AIEmployee;
  index: number;
  onDelete: () => void;
  onEdit: () => void;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  canEdit: boolean;
  canDelete: boolean;
}> = ({ data, index, onDelete, onEdit, onClick, onToggleFavorite, canEdit, canDelete }) => {
  const isFavorited = data.favorites > 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[30px] border border-transparent p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative flex flex-col h-full border-slate-100 overflow-hidden"
    >
      {/* Absolute Actions (Visible on Hover) */}
      <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onToggleFavorite}
          className={`p-2 bg-white rounded-full shadow-md transition-all ${isFavorited ? 'text-brand-yellow' : 'text-slate-300 hover:text-brand-yellow'}`}
          title={isFavorited ? "お気に入り解除" : "お気に入り登録"}
        >
          <Star size={16} className={isFavorited ? "fill-current" : ""} />
        </button>

        {canEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2 bg-white rounded-full text-slate-400 hover:text-brand-text shadow-md transition-all"
            title="編集"
          >
            <Edit2 size={16} />
          </button>
        )}
        {canDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-md transition-all"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Top: Icon & Title */}
      <div className="flex items-start gap-5 mb-4">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl overflow-hidden border border-slate-100 bg-brand-yellow text-brand-text`}>
            {data.iconUrl ? (
              <img src={data.iconUrl} alt="Icon" className="w-full h-full object-cover" />
            ) : (
              data.type === 'basic' ? <Bot size={32} /> : <Sparkles size={28} />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-base font-bold text-brand-text leading-snug line-clamp-2 mb-1 group-hover:text-brand-yellow transition-colors">
            {data.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2">{data.tag}</p>
        </div>
      </div>

      {/* Bottom: Info & Stats */}
      <div className="mt-auto pt-4 border-t border-slate-50 flex items-end justify-between gap-4">
        {/* Attributes */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="font-bold truncate max-w-full">{data.companyName}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.teams.slice(0, 2).map((team, i) => (
              <span key={i} className="text-[10px] px-2 py-1 bg-slate-50 text-slate-600 rounded-full border border-slate-100 truncate max-w-[80px]">
                {team}
              </span>
            ))}
            {data.teams.length > 2 && (
              <span className="text-[10px] px-2 py-1 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
                +{data.teams.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: New Badge & Stats */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {data.isNew && (
            <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm mb-1">
                NEW
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1" title="Views">
              <MousePointerClick size={14} className="text-slate-300" />
              {data.clicks}
            </span>
            <span className="flex items-center gap-1" title="Favorites">
              <Star size={14} className={isFavorited ? "text-brand-yellow fill-current" : "text-slate-300"} />
              {data.favorites}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// [COMPONENT] Form Modal (Complex Logic)
// -----------------------------------------------------------------------------

interface SchemaItem {
  id: number;
  variable_name: string;
  variable_field: string;
  variable_type: string;
  variable_value: string;
}

const AIEmployeeFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  employee: AIEmployee | null;
  onSave: (data: any) => void;
  userRole: string;
  basicCategories?: BasicCategory[];
  forcedTab?: 'basic' | 'custom';
}> = ({ isOpen, onClose, employee, onSave, userRole, basicCategories = [], forcedTab }) => {
  // --- Form State ---
  const [postType, setPostType] = useState('3'); // Default: Dify Chat Flow
  const [employeeType, setEmployeeType] = useState<'basic' | 'custom'>(forcedTab || 'basic');

  // API Configuration Fields
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [appId, setAppId] = useState('');
  const [isPrompt, setIsPrompt] = useState('0');
  
  // Dynamic Schemas (Variables)
  const [schemas, setSchemas] = useState<SchemaItem[]>([
    { id: Date.now(), variable_name: 'image', variable_field: '画像', variable_type: 'file', variable_value: '' }
  ]);

  // URL Field (for type 1)
  const [url, setUrl] = useState('');

  // Basic Info
  const [title, setTitle] = useState(employee?.title || '');
  const [body, setBody] = useState(employee?.tag || '');
  const [etc, setEtc] = useState(employee?.etc || '');
  
  // New Flag
  const [isNew, setIsNew] = useState(employee?.isNew || false);

  // Icon handling
  const [iconUrl, setIconUrl] = useState(employee?.iconUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Relations (Company/Group/Category)
  const [companyId, setCompanyId] = useState('6'); // Default: En Design
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [basicCategoryId, setBasicCategoryId] = useState('');

  // Effect: Initialize form data from `employee` prop
  useEffect(() => {
    if (employee) {
      setEmployeeType(employee.type);
      if (employee.basicCategoryId) setBasicCategoryId(employee.basicCategoryId);
    }
  }, [employee]);

  // Helper: Derived state for selectable Groups/Categories
  const availableGroups = GROUPS_BY_COMPANY[companyId] || [];
  const availableCategories = CATEGORIES_BY_COMPANY[companyId] || [];

  // Effect: Auto-select defaults when company changes
  useEffect(() => {
    if (availableGroups.length > 0 && groupIds.length === 0 && employeeType !== 'basic') {
      setGroupIds([availableGroups[0].id]);
    }
    if (availableCategories.length > 0 && !categoryId && employeeType !== 'basic') {
      setCategoryId(availableCategories[0].id);
    }
  }, [companyId, employeeType]);

  // --- Handlers ---
  const handleAddSchema = () => {
    setSchemas([...schemas, { id: Date.now(), variable_name: '', variable_field: '', variable_type: 'text', variable_value: '' }]);
  };

  const handleRemoveSchema = (id: number) => {
    setSchemas(schemas.filter(s => s.id !== id));
  };

  const handleSchemaChange = (id: number, field: keyof SchemaItem, value: string) => {
    setSchemas(schemas.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleGroupToggle = (gid: string) => {
    setGroupIds(prev => prev.includes(gid) ? prev.filter(id => id !== gid) : [...prev, gid]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave({
      // Master Admin: Save All Fields
      title: userRole === 'master_admin' ? title : undefined,
      body: userRole === 'master_admin' ? body : undefined,
      etc: userRole === 'master_admin' ? etc : undefined,
      postType: userRole === 'master_admin' ? postType : undefined,
      apiKey: userRole === 'master_admin' ? apiKey : undefined,
      baseUrl: userRole === 'master_admin' ? baseUrl : undefined,
      appId: userRole === 'master_admin' ? appId : undefined,
      isPrompt: userRole === 'master_admin' ? isPrompt : undefined,
      schemas: userRole === 'master_admin' ? schemas : undefined,
      url: userRole === 'master_admin' ? url : undefined,
      isNew: userRole === 'master_admin' ? isNew : undefined, // Master Admin Only

      // Common Fields
      companyId: employeeType === 'basic' ? null : companyId,
      groupIds: employeeType === 'basic' ? [] : groupIds,
      categoryId: employeeType === 'basic' ? null : categoryId,
      basicCategoryId: employeeType === 'basic' ? basicCategoryId : undefined,

      iconUrl,
    });
  };

  if (!isOpen) return null;

  // --- RENDER: ADMIN VIEW (Limited access) ---
  if (userRole === 'admin') {
    return (
      <GlassModal isOpen={isOpen} onClose={onClose} title="AI社員設定の変更" onSave={handleSubmit} maxWidth="max-w-xl">
        <div className="space-y-8 py-2">
          {/* Icon Editor */}
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-3xl bg-slate-100 border-4 border-white shadow-lg flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-brand-yellow transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              {iconUrl ? (
                <img src={iconUrl} alt="Icon" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-slate-400 gap-2">
                  <Camera size={32} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white mb-1" size={24} />
                <span className="text-white text-xs font-bold">画像を変更</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-sm text-slate-500 mt-3 font-medium">アイコン画像</p>
          </div>

          {/* Group/Category Selector (Only for Custom) */}
          {employeeType !== 'basic' ? (
            <>
              <div className="w-full h-px bg-slate-100"></div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Users size={18} className="text-brand-text" />
                  <span>閲覧可能なグループ</span>
                </label>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-48 overflow-y-auto custom-scrollbar">
                  {availableGroups.length === 0 && <p className="text-xs text-slate-400">グループがありません</p>}
                  <div className="space-y-2">
                    {availableGroups.map(g => (
                      <label key={g.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 cursor-pointer hover:border-brand-text transition-all">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${groupIds.includes(g.id) ? 'bg-brand-text border-brand-text' : 'border-slate-300'}`}>
                          {groupIds.includes(g.id) && <Check size={12} className="text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          value={g.id}
                          checked={groupIds.includes(g.id)}
                          onChange={() => handleGroupToggle(g.id)}
                        />
                        <span className="text-sm font-medium text-slate-700">{g.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Tag size={18} className="text-brand-text" />
                  <span>カテゴリ</span>
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-700 font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-text/20 shadow-sm appearance-none"
                >
                  <option value="">カテゴリを選択</option>
                  {availableCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </>
          ) : (
            <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-xs text-blue-700">
              <Info size={16} className="flex-shrink-0 mt-0.5" />
              <p>ベーシックAI社員のカテゴリ設定等はマスター管理者のみ変更可能です。</p>
            </div>
          )}
        </div>
      </GlassModal>
    );
  }

  // --- RENDER: MASTER ADMIN VIEW (Full Access) ---
  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={employee ? 'AI社員を編集' : '新規AI社員を追加'} onSave={handleSubmit} maxWidth="max-w-4xl">
      <div className="space-y-6">

        {/* TOP SECTION: Icon & Basic Info */}
        <div className="flex items-start gap-6">
          {/* Icon Upload */}
          <div className="flex-shrink-0">
            <label className="text-sm font-bold text-slate-700 block mb-2">アイコン</label>
            <div
              className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group transition-colors cursor-pointer hover:bg-brand-yellow/10 hover:border-brand-yellow"
              onClick={() => fileInputRef.current?.click()}
            >
              {iconUrl ? (
                <img src={iconUrl} alt="Icon" className="w-full h-full object-cover" />
              ) : (
                <Camera className="text-slate-400" size={24} />
              )}

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">変更</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Basic Inputs */}
          <div className="flex-1 space-y-4">
            {/* Type Switcher */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1">AI社員タイプ</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="employeeType"
                    value="basic"
                    checked={employeeType === 'basic'}
                    onChange={() => setEmployeeType('basic')}
                    className="text-brand-text focus:ring-brand-text"
                  />
                  <span className="text-sm text-slate-700">ベーシック</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="employeeType"
                    value="custom"
                    checked={employeeType === 'custom'}
                    onChange={() => setEmployeeType('custom')}
                    className="text-brand-text focus:ring-brand-text"
                  />
                  <span className="text-sm text-slate-700">カスタム</span>
                </label>
              </div>
            </div>

            {/* Platform Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1">種別<span className="text-brand-text text-xs font-normal">※必須</span></label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-text/20"
              >
                <option value=""></option>
                <option value="1">その他URL</option>
                <option value="2">Difyチャット</option>
                <option value="3">Difyチャットフロー</option>
              </select>
            </div>
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex gap-1">タイトル<span className="text-brand-text text-xs font-normal">※必須</span></label>
              <Input placeholder="タイトル" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            
            {/* NEW Flag (Master Admin Only) */}
            <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-2 px-3 bg-slate-50 hover:border-brand-text/30 transition-colors">
                    <input 
                        type="checkbox" 
                        id="isNewCheck" 
                        checked={isNew} 
                        onChange={e => setIsNew(e.target.checked)}
                        className="w-4 h-4 text-brand-text rounded focus:ring-brand-text/20 cursor-pointer"
                    />
                    <label htmlFor="isNewCheck" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                        NEWマークを表示
                    </label>
                </div>
            </div>
          </div>
        </div>

        {/* API CONFIG SECTION (Only for Dify types) */}
        {(postType === '2' || postType === '3') && (
          <div className="bg-[#F0F8FF] p-6 rounded-xl border border-[#B0D4F1] space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">APIキー<span className="text-brand-text text-xs font-normal">※必須</span></label>
                <Input placeholder="APIキー" value={apiKey} onChange={e => setApiKey(e.target.value)} className="bg-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">Base URL<span className="text-brand-text text-xs font-normal">※必須</span></label>
                <Input placeholder="Base URL" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} className="bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">App ID<span className="text-brand-text text-xs font-normal">※必須</span></label>
                <Input placeholder="App ID" value={appId} onChange={e => setAppId(e.target.value)} className="bg-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">プロンプト有効<span className="text-brand-text text-xs font-normal">※必須</span></label>
                <select
                  value={isPrompt}
                  onChange={e => setIsPrompt(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-text/20"
                >
                  <option value="0">無効</option>
                  <option value="1">有効</option>
                </select>
              </div>
            </div>

            {/* Schema Settings */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">スキーマ設定</label>
              <div className="space-y-2">
                {schemas.map((schema, idx) => (
                  <div key={schema.id} className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col md:flex-row items-start md:items-end gap-3 shadow-sm">
                    <div className="pt-3 text-slate-400 cursor-move hidden md:block"><GripVertical size={16} /></div>
                    <div className="flex-1 w-full"><input className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 bg-gray-50" placeholder="変数名" value={schema.variable_name} onChange={e => handleSchemaChange(schema.id, 'variable_name', e.target.value)} /></div>
                    <div className="flex-1 w-full"><input className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 bg-gray-50" placeholder="日本語ラベル" value={schema.variable_field} onChange={e => handleSchemaChange(schema.id, 'variable_field', e.target.value)} /></div>
                    <button onClick={() => handleRemoveSchema(schema.id)} className="bg-red-50 text-red-500 p-2 rounded mb-[1px]"><Trash size={16} /></button>
                  </div>
                ))}
              </div>
              <button onClick={handleAddSchema} className="bg-brand-text text-white text-xs font-bold py-2 px-4 rounded flex items-center gap-1"><Plus size={12} /> スキーマを追加</button>
            </div>
          </div>
        )}

        {/* URL SECTION (Only for type 1) */}
        {postType === '1' && (
          <div className="space-y-2 animate-fadeIn">
            <label className="text-sm font-bold text-slate-700 flex gap-1">URL<span className="text-brand-text text-xs font-normal">※必須</span></label>
            <Input placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} />
          </div>
        )}

        {/* Description Body */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex gap-1">内容<span className="text-brand-text text-xs font-normal">※必須</span></label>
          <TextArea placeholder="内容" rows={5} value={body} onChange={e => setBody(e.target.value)} />
        </div>

        {/* CONDITIONAL SETTINGS: BASIC VS CUSTOM */}
        {employeeType === 'basic' ? (
          /* BASIC: Category Selector Only */
          <div className="space-y-2 animate-fadeIn">
            <label className="text-sm font-bold text-slate-700 flex gap-1">ベーシックカテゴリ<span className="text-brand-text text-xs font-normal">※必須</span></label>
            <select
              value={basicCategoryId}
              onChange={e => setBasicCategoryId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-text/20"
            >
              <option value="">カテゴリを選択</option>
              {basicCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        ) : (
          /* CUSTOM: Company/Group/Category Selectors */
          <div className="space-y-4 animate-fadeIn border-t border-slate-100 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex gap-1">送信先企業<span className="text-brand-text text-xs font-normal">※必須</span></label>
              <select
                value={companyId}
                onChange={e => setCompanyId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-text/20"
              >
                <option value=""></option>
                {COMPANIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex gap-1">グループ<span className="text-brand-text text-xs font-normal">※必須</span></label>
              <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {availableGroups.length === 0 && <span className="text-xs text-gray-400">グループがありません</span>}
                {availableGroups.map(g => (
                  <label key={g.id} className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-brand-text transition-colors">
                    <input
                      type="checkbox"
                      value={g.id}
                      checked={groupIds.includes(g.id)}
                      onChange={() => handleGroupToggle(g.id)}
                      className="rounded text-brand-text focus:ring-brand-text/20"
                    />
                    <span className="text-sm text-slate-700">{g.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex gap-1">カテゴリ<span className="text-brand-text text-xs font-normal">※必須</span></label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-text/20"
              >
                <option value=""></option>
                {availableCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </GlassModal>
  );
};