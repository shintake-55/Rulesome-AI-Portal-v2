import React, { useState } from 'react';
import { GlassPanel, GlassModal, Input, Button } from '../components/ui';
import { Plus, Trash2, Edit2, FileText, Edit, BarChart, Lightbulb, MessageCircle, PenTool, BookOpen, CheckSquare, Code, Box } from 'lucide-react';
import { BasicCategory } from '../types';

interface MasterBasicCategoriesProps {
  categories: BasicCategory[];
  onUpdate: (categories: BasicCategory[]) => void;
}

// Icon Map for display
const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText size={18} />,
  Edit: <Edit size={18} />,
  BarChart: <BarChart size={18} />,
  Lightbulb: <Lightbulb size={18} />,
  MessageCircle: <MessageCircle size={18} />,
  PenTool: <PenTool size={18} />,
  BookOpen: <BookOpen size={18} />,
  CheckSquare: <CheckSquare size={18} />,
  Code: <Code size={18} />,
  Default: <Box size={18} />
};

export const MasterBasicCategories: React.FC<MasterBasicCategoriesProps> = ({ categories, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BasicCategory | null>(null);
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('FileText');
  const [formOrder, setFormOrder] = useState('');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName('');
    setFormIcon('FileText');
    setFormOrder('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: BasicCategory) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormIcon(cat.icon);
    setFormOrder(cat.order.toString());
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;

    if (editingCategory) {
      onUpdate(categories.map(c => c.id === editingCategory.id ? { 
          ...c, 
          name: formName, 
          icon: formIcon,
          order: parseInt(formOrder) || 0 
      } : c));
    } else {
      const newCat: BasicCategory = {
          id: Date.now().toString(),
          name: formName,
          icon: formIcon,
          order: parseInt(formOrder) || 0
      };
      onUpdate([...categories, newCat]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
      if(window.confirm('このカテゴリを削除しますか？\n※紐づいているAI社員の表示に影響が出る可能性があります。')) {
          onUpdate(categories.filter(c => c.id !== id));
      }
  };

  return (
    <div className="max-w-[1400px] mx-auto pt-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">ベーシックカテゴリ設定（{categories.length}件）</h2>
            <p className="text-sm text-slate-500 mt-1">ベーシックAI社員一覧で使用される大カテゴリを管理します</p>
        </div>
        <Button onClick={handleOpenAdd} variant="primary">
          <Plus size={16} />
          カテゴリを追加
        </Button>
      </div>

      <GlassPanel className="p-0 overflow-hidden bg-white/50 border-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-6 font-bold text-slate-700 w-1/4">アイコン</th>
              <th className="py-4 px-6 font-bold text-slate-700 w-1/3">カテゴリ名</th>
              <th className="py-4 px-6 font-bold text-slate-700 w-1/4">並び順</th>
              <th className="py-4 px-6 font-bold text-slate-700 w-1/6">アクション</th>
            </tr>
          </thead>
          <tbody>
            {categories.sort((a,b) => a.order - b.order).map((cat) => (
              <tr key={cat.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                <td className="py-4 px-6">
                   <div className="flex items-center gap-2 text-slate-500">
                       <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center">
                           {ICON_MAP[cat.icon] || ICON_MAP['Default']}
                       </div>
                       <span className="text-xs text-slate-400">{cat.icon}</span>
                   </div>
                </td>
                <td className="py-4 px-6">
                  <button onClick={() => handleOpenEdit(cat)} className="font-bold text-blue-600 hover:underline">
                    {cat.name}
                  </button>
                </td>
                <td className="py-4 px-6 text-slate-600 font-medium">{cat.order}</td>
                <td className="py-4 px-6">
                  <button onClick={() => handleDelete(cat.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>

      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCategory ? 'カテゴリを編集' : 'カテゴリを追加'} 
        onSave={handleSave}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex gap-1">カテゴリ名 <span className="text-blue-500 text-xs font-normal">※必須</span></label>
            <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="例: 文案生成" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">アイコン選択</label>
            <div className="grid grid-cols-5 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {Object.keys(ICON_MAP).filter(k => k !== 'Default').map(key => (
                    <button
                       key={key}
                       type="button"
                       onClick={() => setFormIcon(key)}
                       className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors border ${
                           formIcon === key ? 'bg-white border-brand-yellow text-brand-text shadow-sm' : 'border-transparent text-slate-400 hover:bg-white'
                       }`}
                    >
                        {ICON_MAP[key]}
                        <span className="text-[10px] mt-1 scale-75">{key}</span>
                    </button>
                ))}
            </div>
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