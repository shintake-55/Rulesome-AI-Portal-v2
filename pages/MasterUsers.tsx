import React, { useState } from 'react';
import { GlassPanel, GlassModal, Input, Button } from '../components/ui';
import { Plus, Trash2, Crown, Edit2 } from 'lucide-react';
import { CompanyEmployee } from '../types';

const INITIAL_USERS: CompanyEmployee[] = [
  { id: '12', name: 'テスト', email: 'okrtest41@t3inc.jp', passwordPlaceholder: '11111111', group: '営業', twoFactor: 'OFF', loginInfo: true, createdAt: '2025/08/28', type: 'admin' },
  { id: '9', name: '中野さん', email: 'ryo@en-design.com', passwordPlaceholder: 'eeee', group: '営業', twoFactor: 'ON', loginInfo: true, createdAt: '2025/03/13', type: 'user' },
  { id: '8', name: '東京二郎', email: 'okrtest20@t3inc.jp', passwordPlaceholder: 'ccc', group: '営業', twoFactor: 'OFF', loginInfo: true, createdAt: '2025/03/13', type: 'user' },
  { id: '7', name: '田中', email: 'okrtest09@t3inc.jp', passwordPlaceholder: '11111111', group: '制作チーム', twoFactor: 'OFF', loginInfo: true, createdAt: '2025/03/13', type: 'admin' },
  { id: '6', name: '山田', email: 'okrtest29@t3inc.jp', passwordPlaceholder: '11111111', group: '制作チーム', twoFactor: 'OFF', loginInfo: true, createdAt: '2025/03/13', type: 'user' },
];

const MOCK_GROUPS = ['営業', '制作チーム', '技術部', 'アプリ開発部', 'AI開発部'];

export const MasterUsers: React.FC = () => {
  const [users, setUsers] = useState<CompanyEmployee[]>(INITIAL_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<CompanyEmployee | null>(null);

  // Form States
  const [formType, setFormType] = useState('user');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formGroup, setFormGroup] = useState('');
  const [formTwoFactor, setFormTwoFactor] = useState('OFF');

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormType('user');
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormGroup('');
    setFormTwoFactor('OFF');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: CompanyEmployee) => {
    setEditingUser(user);
    setFormType(user.type);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword(''); // Don't show existing password
    setFormGroup(user.group);
    setFormTwoFactor(user.twoFactor);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName || !formEmail) return;

    const groupName = formGroup || '未設定';

    if (editingUser) {
        // Update
        setUsers(prev => prev.map(u => u.id === editingUser.id ? {
            ...u,
            type: formType as 'admin' | 'user',
            name: formName,
            email: formEmail,
            // Only update password placeholder if a new password was entered (simulated)
            passwordPlaceholder: formPassword ? '********' : u.passwordPlaceholder, 
            group: groupName,
            twoFactor: formTwoFactor as 'ON' | 'OFF'
        } : u));
    } else {
        // Add
        const newUser: CompanyEmployee = {
            id: Date.now().toString(),
            type: formType as 'admin' | 'user',
            name: formName,
            email: formEmail,
            passwordPlaceholder: '********',
            group: groupName,
            twoFactor: formTwoFactor as 'ON' | 'OFF',
            loginInfo: true, // Default to true
            createdAt: new Date().toISOString().split('T')[0]
        };
        setUsers([newUser, ...users]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('本当に削除しますか？')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSendEmail = (name: string) => alert(`${name}に招待メールを送信しました`);

  return (
    <div className="max-w-[1400px] mx-auto pt-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">社員設定（{users.length}件）</h2>
        <Button 
          onClick={handleOpenAdd}
          variant="primary"
        >
          <Plus size={16} />
          社員を追加
        </Button>
      </div>

      <GlassPanel className="p-0 overflow-hidden bg-white/50 border-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 font-bold text-slate-700">社員名</th>
                <th className="py-4 px-6 font-bold text-slate-700">メールアドレス</th>
                <th className="py-4 px-6 font-bold text-slate-700">パスワード</th>
                <th className="py-4 px-6 font-bold text-slate-700">グループ</th>
                <th className="py-4 px-6 font-bold text-slate-700">二段階認証</th>
                <th className="py-4 px-6 font-bold text-slate-700">ログイン情報</th>
                <th className="py-4 px-6 font-bold text-slate-700">作成日</th>
                <th className="py-4 px-6 font-bold text-slate-700"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <button onClick={() => handleOpenEdit(user)} className="font-bold text-blue-600 hover:underline flex items-center gap-2">
                      {user.name}
                      {user.type === 'admin' && <Crown size={14} className="text-yellow-500 fill-current" />}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{user.email}</td>
                  <td className="py-4 px-6 text-slate-600 font-mono text-xs">{user.passwordPlaceholder}</td>
                  <td className="py-4 px-6 text-slate-600">{user.group}</td>
                  <td className="py-4 px-6 text-slate-600">{user.twoFactor}</td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => handleSendEmail(user.name)}
                      className="bg-brand-text hover:bg-brand-text/80 text-white text-xs px-3 py-1.5 rounded-full font-bold transition-colors"
                    >
                      メール送信
                    </button>
                  </td>
                  <td className="py-4 px-6 text-slate-600 text-sm">{user.createdAt}</td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => handleDelete(user.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? '社員を編集' : '新規社員を作成'} 
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
                    <option value="user">社員</option>
                    <option value="admin">管理者</option>
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
                <label className="text-sm font-bold text-slate-700 flex gap-1">パスワード</label>
                <Input value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder={editingUser ? "変更する場合のみ入力" : "パスワードを入力"} />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">グループ<span className="text-blue-500 text-xs font-normal">※必須</span></label>
                <select 
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">選択してください</option>
                    {MOCK_GROUPS.map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex gap-1">二段階認証<span className="text-blue-500 text-xs font-normal">※必須</span></label>
                <select 
                    value={formTwoFactor}
                    onChange={(e) => setFormTwoFactor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ON">オン</option>
                    <option value="OFF">オフ</option>
                </select>
            </div>
        </div>
      </GlassModal>
    </div>
  );
};