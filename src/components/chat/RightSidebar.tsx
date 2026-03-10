import React, { useRef } from 'react';
import { Plus, X, GripVertical, Edit, Trash, MessageSquare, FileText } from 'lucide-react';
import { PromptItem, FileItem, User } from '../../types';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  prompts: PromptItem[];
  files: FileItem[];
  attachedFiles: FileItem[];
  companies: { id: string; name: string }[];
  onPromptDragStart: (e: React.DragEvent, index: number, p: PromptItem) => void;
  onPromptDrop: (e: React.DragEvent, dropIndex: number) => void;
  onPromptClick: (p: PromptItem) => void;
  onEditPrompt: (p: PromptItem) => void;
  onDeletePrompt: (id: string) => void;
  onAddPrompt: () => void;
  onFileDragStart: (e: React.DragEvent, index: number, f: FileItem) => void;
  onFileDrop: (e: React.DragEvent, dropIndex: number) => void;
  onFileClick: (f: FileItem) => void;
  onEditFile: (f: FileItem) => void;
  onDeleteFile: (id: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  currentUser,
  prompts,
  files,
  attachedFiles,
  companies,
  onPromptDragStart,
  onPromptDrop,
  onPromptClick,
  onEditPrompt,
  onDeletePrompt,
  onAddPrompt,
  onFileDragStart,
  onFileDrop,
  onFileClick,
  onEditFile,
  onDeleteFile,
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Right Sidebar */}
      <div className={`fixed right-0 top-0 bottom-0 w-80 border-l border-slate-200 bg-white flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-30 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-2 border-b border-slate-100">
          <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Prompts Section */}
        <div className="flex-1 flex flex-col min-h-0 border-b border-slate-100">
          <div className="p-3 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
              <MessageSquare size={16} className="text-brand-yellow" />
              <span>プロンプト</span>
            </div>
            <button 
              onClick={onAddPrompt}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-brand-text hover:border-brand-yellow transition-colors shadow-sm"
              title="プロンプトを追加"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-slate-50/30">
            {prompts.map((p, index) => (
              <div 
                key={p.id}
                draggable 
                onDragStart={(e) => onPromptDragStart(e, index, p)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.stopPropagation();
                  onPromptDrop(e, index);
                }}
                onClick={() => onPromptClick(p)}
                className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-yellow cursor-pointer transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-xs text-slate-700 flex items-center gap-2">
                    <GripVertical size={12} className="text-slate-300 cursor-grab active:cursor-grabbing" />
                    {p.title}
                  </div>
                  {(currentUser.role === 'master_admin' || !p.isMaster) && (
                    <div className="hidden group-hover:flex gap-1 bg-white pl-2">
                      <button onClick={(e) => { e.stopPropagation(); onEditPrompt(p); }} className="p-1 text-slate-400 hover:text-blue-500 rounded"><Edit size={12}/></button>
                      <button onClick={(e) => { e.stopPropagation(); onDeletePrompt(p.id); }} className="p-1 text-slate-400 hover:text-red-500 rounded"><Trash size={12}/></button>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-2 pl-5">{p.content}</div>
                {p.isMaster && <div className="absolute bottom-1.5 right-1.5 text-[8px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100">公式</div>}
                {p.companyId && currentUser.role === 'master_admin' && (
                  <div className="absolute bottom-1.5 right-10 text-[8px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200 truncate max-w-[80px]">
                    {companies.find(c => c.id === p.companyId)?.name || '不明'}
                  </div>
                )}
              </div>
            ))}
            {prompts.length === 0 && (
              <div className="text-center text-xs text-slate-400 py-6">
                プロンプトがありません
              </div>
            )}
          </div>
        </div>

        {/* Files Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-3 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
              <FileText size={16} className="text-blue-500" />
              <span>ファイル</span>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-brand-text hover:border-brand-yellow transition-colors shadow-sm"
              title="ファイルをアップロード"
            >
              <Plus size={14} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileUpload} 
              className="hidden" 
              multiple 
            />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-slate-50/30">
            {files.map((f, index) => (
              <div 
                key={f.id}
                draggable 
                onDragStart={(e) => onFileDragStart(e, index, f)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.stopPropagation();
                  onFileDrop(e, index);
                }}
                onClick={() => onFileClick(f)}
                className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all group flex items-center gap-2 relative overflow-hidden"
              >
                <GripVertical size={12} className="text-slate-300 cursor-grab active:cursor-grabbing flex-shrink-0" />
                <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <FileText size={12} />
                </div>
                <div className="flex-1 min-w-0 pr-12">
                  <div className="font-bold text-xs text-slate-700 truncate">{f.name}</div>
                  <div className="text-[10px] text-slate-400">{f.size}</div>
                </div>
                {(currentUser.role === 'master_admin' || !f.isMaster) && (
                  <div className="absolute right-2 hidden group-hover:flex items-center gap-1 bg-white pl-2">
                    <button 
                      className="flex items-center justify-center w-5 h-5 bg-white text-slate-400 hover:text-blue-500 rounded-full shadow-sm border border-slate-100" 
                      onClick={(e) => { e.stopPropagation(); onEditFile(f); }}
                    >
                      <Edit size={10} />
                    </button>
                    <button 
                      className="flex items-center justify-center w-5 h-5 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm border border-slate-100" 
                      onClick={(e) => { e.stopPropagation(); onDeleteFile(f.id); }}
                    >
                      <Trash size={10} />
                    </button>
                  </div>
                )}
                {f.isMaster && <div className="absolute top-1.5 right-1.5 text-[8px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100">公式</div>}
                {f.companyId && currentUser.role === 'master_admin' && (
                  <div className="absolute bottom-1.5 right-1.5 text-[8px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200 truncate max-w-[80px]">
                    {companies.find(c => c.id === f.companyId)?.name || '不明'}
                  </div>
                )}
              </div>
            ))}
            {files.length === 0 && (
              <div className="text-center text-xs text-slate-400 py-6">
                ファイルがありません
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
