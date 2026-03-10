import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Button, Input } from '../ui';
import { FileItem, User } from '../../types';

interface FileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; name: string; companyId: string }) => void;
  pendingFiles: FileItem[];
  initialData?: FileItem | null;
  currentUser: User;
  companies: { id: string; name: string }[];
}

export const FileModal: React.FC<FileModalProps> = ({ isOpen, onClose, onSave, pendingFiles, initialData, currentUser, companies }) => {
  const [name, setName] = useState('');
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || (pendingFiles.length === 1 ? pendingFiles[0].name : ''));
      setCompanyId(initialData?.companyId || '');
    }
  }, [isOpen, initialData, pendingFiles]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      id: initialData?.id,
      name,
      companyId
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 w-[480px] shadow-2xl border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileText className="text-blue-500" />
          {initialData ? 'ファイルを編集' : 'ファイルを追加'}
        </h2>
        <div className="space-y-5">
          {(initialData || pendingFiles.length === 1) && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ファイル名</label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
          )}
          {pendingFiles.length > 1 && (
            <div className="text-sm text-slate-600 mb-4">
              {pendingFiles.length}個のファイルを追加します。
            </div>
          )}
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
            <Button variant="primary" onClick={handleSave}>保存</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
