import React, { useState } from 'react';
import { GlassPanel, GlassModal, Input, Button } from '../components/ui';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  order: number;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: '6', name: 'エンデザインのDify', order: 2 },
  { id: '13', name: 'T3のDify', order: 10 },
  { id: '12', name: 'その他URL', order: 200 },
];

export const MasterCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formOrder, setFormOrder] = useState('');

  const handleAddCategory = () => { setIsAddModalOpen(false); };
  const handleUpdateCategory = () => { setIsEditModalOpen(false); };
  const handleEditClick = (c: Category) => { setIsEditModalOpen(true); };
  const handleDelete = (id: string) => {};

  return (
    <div className="max-w-[1400px] mx-auto pt-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">カテゴリ設定（{categories.length}件）</h2>
        <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
          <Plus size={16} />
          カテゴリを追加
        </Button>
      </div>

      <GlassPanel className="p-0 overflow-hidden bg-white/50 border-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-6 font-bold text-slate-700 w-1/2">カテゴリ名</th>
              <th className="py-4 px-6 font-bold text-slate-700 w-1/4">並び順</th>
              <th className="py-4 px-6 font-bold text-slate-700 w-1/4">アクション</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                <td className="py-4 px-6">
                  <button onClick={() => handleEditClick(category)} className="font-bold text-blue-600 hover:underline">
                    {category.name}
                  </button>
                </td>
                <td className="py-4 px-6 text-slate-600 font-medium">{category.order}</td>
                <td className="py-4 px-6">
                  <button onClick={() => handleDelete(category.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>

      <GlassModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="新規カテゴリを作成" onSave={handleAddCategory}>
        <div className="space-y-4"><Input placeholder="カテゴリ名" /></div>
      </GlassModal>
      <GlassModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="カテゴリ名を編集" onSave={handleUpdateCategory}>
        <div className="space-y-4"><Input placeholder="カテゴリ名" /></div>
      </GlassModal>
    </div>
  );
};