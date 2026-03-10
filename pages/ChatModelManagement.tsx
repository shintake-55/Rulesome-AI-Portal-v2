import React, { useState, useRef } from 'react';
import { GlassPanel, GlassModal, Input, Button, TextArea } from '../components/ui';
import { Plus, Trash2, Edit2, Bot, Sparkles, BrainCircuit, Check, Camera } from 'lucide-react';
import { ChatModel } from '../types';

interface ChatModelManagementProps {
  models: ChatModel[];
  onUpdateModels: (models: ChatModel[]) => void;
}

export const ChatModelManagement: React.FC<ChatModelManagementProps> = ({ models, onUpdateModels }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ChatModel | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIcon, setFormIcon] = useState('');
  const [formProvider, setFormProvider] = useState('other');
  const [formApiKey, setFormApiKey] = useState('');
  const [formBaseUrl, setFormBaseUrl] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setEditingModel(null);
    setFormName('');
    setFormDesc('');
    setFormIcon('');
    setFormProvider('other');
    setFormApiKey('');
    setFormBaseUrl('');
    setFormEnabled(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (model: ChatModel) => {
    setEditingModel(model);
    setFormName(model.name);
    setFormDesc(model.description);
    setFormIcon(model.icon || '');
    setFormProvider(model.provider);
    setFormApiKey(model.apiKey || '');
    setFormBaseUrl(model.baseUrl || '');
    setFormEnabled(model.enabled);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormIcon(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formName) return;

    if (editingModel) {
      // Update
      const updatedModels = models.map(m => m.id === editingModel.id ? {
          ...m,
          name: formName,
          description: formDesc,
          icon: formIcon,
          provider: formProvider as any,
          apiKey: formApiKey,
          baseUrl: formBaseUrl,
          enabled: formEnabled
      } : m);
      onUpdateModels(updatedModels);
    } else {
      // Add
      const newModel: ChatModel = {
          id: Date.now().toString(),
          name: formName,
          description: formDesc,
          icon: formIcon,
          provider: formProvider as any,
          apiKey: formApiKey,
          baseUrl: formBaseUrl,
          enabled: formEnabled
      };
      onUpdateModels([...models, newModel]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
      if(window.confirm('このモデルを削除しますか？')) {
          onUpdateModels(models.filter(m => m.id !== id));
      }
  };

  const handleToggleEnable = (id: string) => {
      const updated = models.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m);
      onUpdateModels(updated);
  };

  // Helper to render icon
  const renderIcon = (model: ChatModel, size: number) => {
      if (model.icon && (model.icon.startsWith('data:') || model.icon.startsWith('http'))) {
          return <img src={model.icon} alt={model.name} className="w-full h-full object-cover" />;
      }
      switch (model.provider) {
          case 'openai': return <BrainCircuit size={size} />;
          case 'google': return <Sparkles size={size} />;
          case 'anthropic': return <Bot size={size} />;
          default: return <Bot size={size} />;
      }
  };

  return (
    <div className="max-w-[1400px] mx-auto pt-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">チャットモデル管理</h2>
            <p className="text-sm text-slate-500 mt-1">ホーム画面のチャットで使用可能なモデルを設定します</p>
        </div>
        <Button onClick={handleOpenAdd} variant="primary">
          <Plus size={16} />
          モデルを追加
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <GlassPanel key={model.id} className="p-6 bg-white border border-slate-100 flex flex-col h-full group hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 overflow-hidden relative">
                       {renderIcon(model, 24)}
                   </div>
                   <div>
                       <h3 className="font-bold text-slate-800">{model.name}</h3>
                       <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">{model.provider}</span>
                   </div>
               </div>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleOpenEdit(model)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600">
                       <Edit2 size={16} />
                   </button>
                   <button onClick={() => handleDelete(model.id)} className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500">
                       <Trash2 size={16} />
                   </button>
               </div>
            </div>
            
            <p className="text-sm text-slate-500 mb-6 flex-1">{model.description}</p>
            
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[10px] text-slate-400">ステータス</span>
                   <span className={`text-xs font-bold ${model.enabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                       {model.enabled ? '有効' : '無効'}
                   </span>
                </div>
                <button 
                  onClick={() => handleToggleEnable(model.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${model.enabled ? 'bg-brand-text' : 'bg-slate-200'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${model.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
            </div>
          </GlassPanel>
        ))}
      </div>

      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingModel ? 'モデル設定を編集' : '新規モデルを追加'} 
        onSave={handleSave}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
           
           {/* Icon Upload Section */}
           <div className="flex justify-center mb-4">
                <div className="flex flex-col items-center">
                     <div 
                        className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group transition-colors cursor-pointer hover:bg-brand-yellow/10 hover:border-brand-yellow"
                        onClick={() => fileInputRef.current?.click()}
                     >
                        {formIcon ? (
                            <img src={formIcon} alt="Icon" className="w-full h-full object-cover" />
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
                     <p className="text-xs text-slate-400 mt-2 font-bold">アイコン画像</p>
                </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 flex gap-1">モデル表示名 <span className="text-blue-500 text-xs font-normal">※必須</span></label>
                   <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="例: GPT-5" />
               </div>
               <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">プロバイダー</label>
                   <select 
                     value={formProvider}
                     onChange={e => setFormProvider(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                       <option value="openai">OpenAI</option>
                       <option value="google">Google</option>
                       <option value="anthropic">Anthropic</option>
                       <option value="other">その他</option>
                   </select>
               </div>
           </div>

           <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700">説明文</label>
               <Input value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="モデルの特徴など" />
           </div>

           {/* API Settings Section */}
           <div className="bg-[#F0F8FF] p-6 rounded-2xl border border-[#B0D4F1] space-y-4">
               <div className="flex items-center gap-2 mb-2">
                   <div className="p-1.5 bg-blue-500 text-white rounded">
                       <Bot size={16} />
                   </div>
                   <h4 className="font-bold text-slate-700">Dify 接続設定</h4>
               </div>
               
               <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">API Key</label>
                   <Input value={formApiKey} onChange={e => setFormApiKey(e.target.value)} placeholder="Dify API Key" className="bg-white" />
               </div>
               
               <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Base URL</label>
                   <Input value={formBaseUrl} onChange={e => setFormBaseUrl(e.target.value)} placeholder="https://api.dify.ai/v1" className="bg-white" />
               </div>
           </div>

           <div className="flex items-center gap-2 pt-2">
               <input 
                 type="checkbox" 
                 id="enableModel" 
                 checked={formEnabled} 
                 onChange={e => setFormEnabled(e.target.checked)}
                 className="w-5 h-5 text-brand-text rounded focus:ring-brand-text/30"
               />
               <label htmlFor="enableModel" className="text-sm font-bold text-slate-700 cursor-pointer">このモデルを有効にする</label>
           </div>
        </div>
      </GlassModal>
    </div>
  );
};