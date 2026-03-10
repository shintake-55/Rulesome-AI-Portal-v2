import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button, Input } from '../ui';
import { PromptItem, User } from '../../types';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; title: string; content: string; companyId: string }) => void;
  initialData?: PromptItem | null;
  currentUser: User;
  companies: { id: string; name: string }[];
}

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose, onSave, initialData, currentUser, companies }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setContent(initialData?.content || '');
      setCompanyId(initialData?.companyId || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      id: initialData?.id,
      title,
      content,
      companyId
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 w-[480px] shadow-2xl border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <MessageSquare className="text-brand-yellow" />
          {initialData ? 'プロンプトを編集' : 'プロンプトを登録'}
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">タイトル</label>
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="例：文章の要約" 
              className="bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">プロンプト内容</label>
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl p-4 h-40 resize-none focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/10 transition-all text-sm leading-relaxed"
              placeholder="プロンプトを入力してください..."
            />
          </div>
          {currentUser.role === 'master_admin' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">対象企業</label>
              <select
                value={companyId}
                onChange={e => setCompanyId(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl p-3 text-sm focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/10 transition-all"
              >
                <option value="">全企業（共通）</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose}>キャンセル</Button>
            <Button variant="primary" onClick={handleSave} disabled={!title || !content}>保存</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
