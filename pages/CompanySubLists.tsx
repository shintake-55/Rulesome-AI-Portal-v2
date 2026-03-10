import React, { useState } from 'react';
import { Company, CompanyGroup, CompanyEmployee, CompanyCategory, CompanyPost } from '../types';
import { Search, Plus, Trash2, ArrowLeft, Crown, Edit2 } from 'lucide-react';
import { GlassModal, Input, Button } from '../components/ui';

// --- Shared Components ---
const ListHeader: React.FC<{ 
  title: string; 
  count: number; 
  onBack: () => void; 
  addButtonLabel: string;
  onAdd: () => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
}> = ({ title, count, onBack, addButtonLabel, onAdd, searchValue, onSearchChange }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
      <button onClick={onBack} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
        <ArrowLeft size={16} /> 戻る
      </button>
      <span>/</span>
      <span>{title}</span>
    </div>
    
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <p className="text-slate-500 text-sm mt-1">全 : {count}件</p>
      </div>
      <Button onClick={onAdd} variant="primary">
        <Plus size={18} />
        {addButtonLabel}
      </Button>
    </div>

    <div className="flex justify-end mt-6">
      <div className="relative w-64">
        <input 
          type="text" 
          placeholder="検索" 
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
           <Search size={14} />
        </div>
      </div>
    </div>
  </div>
);

// --- 1. Company Group List ---
const INITIAL_GROUPS: CompanyGroup[] = [
  { id: '1', name: 'AI開発部', order: 1, createdAt: '2025/08/26' },
  { id: '2', name: '制作チーム', order: 2, createdAt: '2025/08/26' },
  { id: '3', name: 'テスト企業グループ1', order: 1111, createdAt: '2025/02/12' },
];

export const CompanyGroupList: React.FC<{ company: Company; onBack: () => void }> = ({ company, onBack }) => {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CompanyGroup | null>(null);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formOrder, setFormOrder] = useState('');

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string) => {
    if(window.confirm('削除しますか？')) {
      setGroups(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormOrder('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (group: CompanyGroup) => {
    setEditingItem(group);
    setFormName(group.name);
    setFormOrder(group.order.toString());
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if(!formName.trim()) return;
    
    if (editingItem) {
      // Update
      setGroups(prev => prev.map(g => g.id === editingItem.id ? { ...g, name: formName, order: parseInt(formOrder) || 0 } : g));
    } else {
      // Create
      const newGroup: CompanyGroup = {
        id: Date.now().toString(),
        name: formName,
        order: parseInt(formOrder) || 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setGroups([...groups, newGroup]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto pt-4 animate-fadeIn">
      <ListHeader 
        title="グループ設定" 
        count={filteredGroups.length} 
        onBack={onBack} 
        addButtonLabel="グループを追加"
        onAdd={handleOpenAdd}
        searchValue={search}
        onSearchChange={setSearch}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-800 text-lg">{group.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(group)} className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(group.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">並び順</span>
                <span className="font-medium text-slate-700">{group.order}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">作成日</span>
                <span className="text-slate-700">{group.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredGroups.length === 0 && <div className="col-span-full text-center text-slate-400 py-8">データがありません</div>}
      </div>

      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'グループを編集' : 'グループを追加'} 
        onSave={handleSave}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex gap-1">グループ名 <span className="text-blue-500 text-xs font-normal">※必須</span></label>
            <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="グループ名を入力" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex gap-1">並び順</label>
            <Input type="number" value={formOrder} onChange={e => setFormOrder(e.target.value)} placeholder="0" />
          </div>
        </div>
      </GlassModal>
    </div>
  );
};

// --- 2. Company Employee List ---
const INITIAL_EMPLOYEES: CompanyEmployee[] = [
  { id: '1', name: 'あ', email: 'ttt', passwordPlaceholder: 'ttt', group: 'AI開発部', twoFactor: 'OFF', loginInfo: true, createdAt: '2025/12/26', type: 'user' },
  { id: '2', name: '管理者次郎', email: '2', passwordPlaceholder: 'aa', group: 'AI開発部', twoFactor: 'ON', loginInfo: true, createdAt: '2025/10/16', type: 'admin' },
  { id: '3', name: 'あ', email: 'あ', passwordPlaceholder: '$2Y5vBvy', group: 'AI開発部', twoFactor: 'ON', loginInfo: true, createdAt: '2025/10/16', type: 'user' },
  { id: '4', name: 'a', email: 'a', passwordPlaceholder: '11111111', group: 'AI開発部', twoFactor: 'ON', loginInfo: true, createdAt: '2025/10/16', type: 'user' },
  { id: '5', name: '東京二郎', email: 'okrtest23@t3inc.jp', passwordPlaceholder: '22222222', group: 'AI開発部', twoFactor: 'OFF', loginInfo: true, createdAt: '2025/08/26', type: 'user' },
];

export const CompanyEmployeeList: React.FC<{ company: Company; onBack: () => void }> = ({ company, onBack }) => {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CompanyEmployee | null>(null);

  // Form State
  const [formType, setFormType] = useState('1'); // 1: User, 100: Admin
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formGroup, setFormGroup] = useState('');
  const [formAuthFlg, setFormAuthFlg] = useState('0'); // 1: On, 0: Off

  const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string) => {
    if(window.confirm('削除しますか？')) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormType('1');
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormGroup('');
    setFormAuthFlg('0');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: CompanyEmployee) => {
    setEditingItem(emp);
    setFormType(emp.type === 'admin' ? '100' : '1');
    setFormName(emp.name);
    setFormEmail(emp.email);
    setFormPassword(''); // Password usually blank on edit
    setFormGroup(emp.group); // Simplified mapping
    setFormAuthFlg(emp.twoFactor === 'ON' ? '1' : '0');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if(!formName.trim() || !formEmail.trim()) return;

    const groupName = formGroup || '未設定'; // Mock mapping

    if (editingItem) {
       setEmployees(prev => prev.map(e => e.id === editingItem.id ? {
           ...e,
           name: formName,
           email: formEmail,
           group: groupName,
           twoFactor: formAuthFlg === '1' ? 'ON' : 'OFF',
           type: formType === '100' ? 'admin' : 'user',
           passwordPlaceholder: formPassword ? '********' : e.passwordPlaceholder
       } : e));
    } else {
        const newEmp: CompanyEmployee = {
            id: Date.now().toString(),
            name: formName,
            email: formEmail,
            passwordPlaceholder: '********',
            group: groupName,
            twoFactor: formAuthFlg === '1' ? 'ON' : 'OFF',
            loginInfo: true,
            createdAt: new Date().toISOString().split('T')[0],
            type: formType === '100' ? 'admin' : 'user'
        };
        setEmployees([...employees, newEmp]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto pt-4 animate-fadeIn">
      <ListHeader 
        title="社員設定" 
        count={filteredEmployees.length} 
        onBack={onBack} 
        addButtonLabel="社員を追加"
        onAdd={handleOpenAdd}
        searchValue={search}
        onSearchChange={setSearch}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-lg">{emp.name}</h3>
                {emp.type === 'admin' && <Crown size={14} className="text-yellow-500 fill-current" />}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(emp)} className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full">
                    <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(emp.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                    <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 text-sm flex-1">
              <div className="grid grid-cols-[100px_1fr] items-start border-b border-slate-50 pb-2">
                <span className="text-slate-500 text-xs mt-1">メールアドレス</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-slate-700 truncate">{emp.email}</span>
                  <span className="text-slate-400 text-xs font-mono truncate mt-0.5 bg-slate-50 px-2 py-0.5 rounded w-fit max-w-full">
                    {emp.passwordPlaceholder}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center border-b border-slate-50 pb-2">
                <span className="text-slate-500 text-xs">グループ</span>
                <span className="font-medium text-slate-700 truncate">{emp.group}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center border-b border-slate-50 pb-2">
                <span className="text-slate-500 text-xs">二段階認証</span>
                <span className="font-medium text-slate-700 truncate">{emp.twoFactor}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center border-b border-slate-50 pb-2">
                <span className="text-slate-500 text-xs">ログイン情報</span>
                <div>
                   <button onClick={() => alert('メールを送信しました')} className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                     メール送信
                   </button>
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center pt-1">
                <span className="text-slate-500 text-xs">作成日</span>
                <span className="text-slate-400 text-xs">{emp.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
         {filteredEmployees.length === 0 && <div className="col-span-full text-center text-slate-400 py-8">データがありません</div>}
      </div>

      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? '社員を編集' : '社員を新規作成'} 
        onSave={handleSave}
      >
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">種別<span className="text-blue-500 text-xs font-normal">※必須</span></label>
                <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="1">社員</option>
                    <option value="100">管理者</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">社員名<span className="text-blue-500 text-xs font-normal">※必須</span></label>
                <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="社員名を入力" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">メールアドレス<span className="text-blue-500 text-xs font-normal">※必須</span></label>
                <Input value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="メールアドレスを入力" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">パスワード<span className="text-blue-500 text-xs font-normal">※必須</span></label>
                <Input value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder="パスワードを入力" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">グループ<span className="text-blue-500 text-xs font-normal">※必須</span></label>
                <select 
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">選択してください</option>
                    <option value="AI開発部">AI開発部</option>
                    <option value="制作チーム">制作チーム</option>
                    <option value="テスト企業グループ1">テスト企業グループ1</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">二段階認証<span className="text-blue-500 text-xs font-normal">※必須</span></label>
                <select 
                    value={formAuthFlg}
                    onChange={(e) => setFormAuthFlg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="1">オン</option>
                    <option value="0">オフ</option>
                </select>
            </div>
        </div>
      </GlassModal>
    </div>
  );
};

// --- 3. Company Category List ---
const INITIAL_CATEGORIES: CompanyCategory[] = [
    { id: '1', name: '開発お役立ち', order: 1, createdAt: '2025/01/01' },
    { id: '2', name: '営業資料', order: 2, createdAt: '2025/01/02' },
];

export const CompanyCategoryList: React.FC<{ company: Company; onBack: () => void }> = ({ company, onBack }) => {
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const [search, setSearch] = useState('');
    
    // Modal & Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CompanyCategory | null>(null);
    const [formName, setFormName] = useState('');
    const [formOrder, setFormOrder] = useState('');

    const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    const handleDelete = (id: string) => {
        if(window.confirm('削除しますか？')) {
            setCategories(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleOpenAdd = () => {
        setEditingItem(null);
        setFormName('');
        setFormOrder('');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (cat: CompanyCategory) => {
        setEditingItem(cat);
        setFormName(cat.name);
        setFormOrder(cat.order.toString());
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formName.trim()) return;
        if (editingItem) {
            setCategories(prev => prev.map(c => c.id === editingItem.id ? { ...c, name: formName, order: parseInt(formOrder) || 0 } : c));
        } else {
            const newCat: CompanyCategory = {
                id: Date.now().toString(),
                name: formName,
                order: parseInt(formOrder) || 0,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setCategories([...categories, newCat]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-[1400px] mx-auto pt-4 animate-fadeIn">
            <ListHeader title="カテゴリ設定" count={filteredCategories.length} onBack={onBack} addButtonLabel="カテゴリを追加" onAdd={handleOpenAdd} searchValue={search} onSearchChange={setSearch} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCategories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-slate-800 text-lg">{cat.name}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenEdit(cat)} className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(cat.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500">並び順</span>
                                <span className="font-medium text-slate-700">{cat.order}</span>
                            </div>
                             <div className="flex justify-between pt-1">
                                <span className="text-slate-500">作成日</span>
                                <span className="text-slate-700">{cat.createdAt}</span>
                            </div>
                        </div>
                    </div>
                ))}
                 {filteredCategories.length === 0 && <div className="col-span-full text-center text-slate-400 py-8">データがありません</div>}
            </div>

            <GlassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'カテゴリを編集' : 'カテゴリを追加'} onSave={handleSave}>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex gap-1">カテゴリ名 <span className="text-blue-500 text-xs font-normal">※必須</span></label>
                        <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="カテゴリ名を入力" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex gap-1">並び順</label>
                        <Input type="number" value={formOrder} onChange={e => setFormOrder(e.target.value)} placeholder="0" />
                    </div>
                </div>
            </GlassModal>
        </div>
    )
};

// --- 4. Company Post List ---
export const CompanyPostList: React.FC<{ company: Company; onBack: () => void }> = ({ company, onBack }) => {
    // This was previously marked as implementation in progress. 
    // Keeping it simple for now as no specific requirements were given for this list's edit form in this prompt,
    // but applying the blue theme consistency.
    return (
        <div className="max-w-[1400px] mx-auto pt-4 animate-fadeIn">
            <ListHeader title="POST一覧" count={0} onBack={onBack} addButtonLabel="POSTを追加" onAdd={() => {}} searchValue="" onSearchChange={() => {}} />
            <div className="text-center text-slate-400 py-10">実装中</div>
        </div>
    )
};