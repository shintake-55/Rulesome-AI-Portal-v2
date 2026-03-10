import React, { useState } from 'react';
import { GlassPanel, GlassModal, Input, Button } from '../components/ui';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  order: number;
}

const INITIAL_GROUPS: Group[] = [
  { id: '11', name: '営業', order: 1 },
  { id: '12', name: '制作チーム', order: 1 },
  { id: '19', name: '技術部', order: 1 },
  { id: '18', name: 'アプリ開発部', order: 2 },
  { id: '20', name: 'AI開発部', order: 22 },
  { id: '17', name: 'タイランド', order: 100 },
];

export const MasterGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formName, setFormName] = useState('');
  const [formOrder, setFormOrder] = useState('');

  const handleAddGroup = () => {
    if (!formName) return;
    const newGroup: Group = {
      id: Date.now().toString(),
      name: formName,
      order: parseInt(formOrder) || 0,
    };
    setGroups([...groups, newGroup]);
    setFormName('');
    setFormOrder('');
    setIsAddModalOpen(false);
  };

  const handleEditClick = (group: Group) => {
    setEditingGroup(group);
    setFormName(group.name);
    setFormOrder(group.order.toString());
    setIsEditModalOpen(true);
  };

  const handleUpdateGroup = () => {
    if (!editingGroup || !formName) return;
    setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, name: formName, order: parseInt(formOrder) || 0 } : g));
    setIsEditModalOpen(false);
    setEditingGroup(null);
    setFormName('');
    setFormOrder('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('削除しますがよろしいですか？')) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pt-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">グループ設定（{groups.length}件）</h2>
        <Button 
          onClick={() => { setFormName(''); setFormOrder(''); setIsAddModalOpen(true); }}
          variant="primary"
        >
          <Plus size={16} />
          グループを追加
        </Button>
      </div>

      <GlassPanel className="p-0 overflow-hidden bg-white/50 border-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-6 font-bold text-slate-700 w-1/2">グループ名</th>
              <th className="py-4 px-6 font-bold text-slate-700 w-1/4">並び順</th>
              <th className="py-4 px-6 font-bold text-slate-700 w-1/4">アクション</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                <td className="py-4 px-6">
                  <button 
                    onClick={() => handleEditClick(group)}
                    className="font-bold text-blue-600 hover:underline hover:text-blue-700"
                  >
                    {group.name}
                  </button>
                </td>
                <td className="py-4 px-6 text-slate-600 font-medium">
                  {group.order}
                </td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => handleDelete(group.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>

      <GlassModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="新規グループを作成"
        onSave={handleAddGroup}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              グループ名 <span className="text-blue-500 text-xs font-normal">※必須</span>
            </label>
            <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              並び順 <span className="text-blue-500 text-xs font-normal">※必須</span>
            </label>
            <Input value={formOrder} onChange={(e) => setFormOrder(e.target.value)} />
          </div>
        </div>
      </GlassModal>

      <GlassModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="グループ名を編集"
        onSave={handleUpdateGroup}
      >
        <div className="space-y-6">
           <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              グループ名 <span className="text-blue-500 text-xs font-normal">※必須</span>
            </label>
            <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              並び順 <span className="text-blue-500 text-xs font-normal">※必須</span>
            </label>
            <Input value={formOrder} onChange={(e) => setFormOrder(e.target.value)} />
          </div>
        </div>
      </GlassModal>
    </div>
  );
};