import React, { useState, useEffect } from 'react';
import { Folder } from 'lucide-react';
import { Button, Input } from '../ui';
import { FolderItem } from '../../types';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialData?: FolderItem | null;
}

export const FolderModal: React.FC<FolderModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 w-[400px] shadow-2xl border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Folder className="text-brand-yellow" />
          {initialData ? 'フォルダ名を変更' : 'フォルダを追加'}
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">フォルダ名</label>
            <Input 
              value={name} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
              placeholder="フォルダ名を入力"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>キャンセル</Button>
          <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>保存</Button>
        </div>
      </div>
    </div>
  );
};
