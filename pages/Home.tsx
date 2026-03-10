import React, { useState, useRef, useEffect } from 'react';
import { Button, Input } from '../components/ui';
import { Send, Plus, Paperclip, Mic, ChevronUp, Bot, Sparkles, Globe, BrainCircuit, Trash, Edit, FileText, X, GripVertical, MessageSquare, Menu, Wrench } from 'lucide-react';
import { ChatModel, User, Message, PromptItem, FileItem, FolderItem } from '../types';
import { PromptModal } from '../components/chat/PromptModal';
import { FileModal } from '../components/chat/FileModal';
import { FolderModal } from '../components/chat/FolderModal';
import { RightSidebar } from '../components/chat/RightSidebar';

interface HomeProps {
  chatModels: ChatModel[];
  currentUser: User;
}

const MOCK_COMPANIES = [
  { id: 'c1', name: '株式会社エンデザイン' },
  { id: 'c2', name: '株式会社テスト' },
  { id: 'c3', name: 'Acme Corp' },
];

const MOCK_PROMPTS: PromptItem[] = [
  { id: 'p1', title: '文章の要約', content: '以下の文章を要約してください：\n\n', isMaster: true, companyId: 'c1', isOfficial: true },
  { id: 'p2', title: '翻訳（英→日）', content: '以下の英語を自然な日本語に翻訳してください：\n\n', isMaster: true, isOfficial: true },
];

const MOCK_FILES: FileItem[] = [
  { id: 'f1', name: '社内規定マニュアル.pdf', size: '2.4 MB', isMaster: true, companyId: 'c1', isOfficial: true },
  { id: 'f2', name: '2025年営業資料.pptx', size: '5.1 MB', isMaster: true, isOfficial: true },
];

export const Home: React.FC<HomeProps> = ({ chatModels, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedModelId, setSelectedModelId] = useState<string>(chatModels[0]?.id || '1');
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [isWebSearch, setIsWebSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sidebar States
  const [prompts, setPrompts] = useState<PromptItem[]>(MOCK_PROMPTS);
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<FileItem[]>([]);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  
  // Drag & Drop State
  const [isDragOver, setIsDragOver] = useState(false);

  // Prompt Modal State
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptItem | null>(null);
  const [isAddingOfficial, setIsAddingOfficial] = useState(true);

  // File Modal State
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [pendingFiles, setPendingFiles] = useState<FileItem[]>([]);

  // Folder Modal State
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null);
  const [folderType, setFolderType] = useState<'prompt' | 'file'>('prompt');
  const [folderIsOfficial, setFolderIsOfficial] = useState(true);

  const selectedModel = chatModels.find(m => m.id === selectedModelId) || chatModels[0];

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() && attachedFiles.length === 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedFiles: [...attachedFiles]
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachedFiles([]);
    setIsModelSelectorOpen(false); // Close selector if open

    // Simulate AI Response
    setTimeout(() => {
        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: `[${selectedModel.name}] からの応答サンプルです。\n\nあなたは「${userMsg.text}」と言いましたね。${userMsg.attachedFiles && userMsg.attachedFiles.length > 0 ? `\n${userMsg.attachedFiles.length}個のファイルを受け取りました。` : ''}このチャットはDify API等を通じて汎用モデルと接続することを想定しています。`,
            modelName: selectedModel.name,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            modelIcon: selectedModel.icon,
            modelProvider: selectedModel.provider
        };
        setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const hasStarted = messages.length > 0;

  // Helper to render icon for ChatModel
  const renderModelIcon = (model: ChatModel, size: number) => {
      if (model.icon && (model.icon.startsWith('data:') || model.icon.startsWith('http'))) {
          return <img src={model.icon} alt={model.name} className="w-full h-full object-cover" />;
      }
      // Default icons based on provider
      switch (model.provider) {
          case 'openai': return <BrainCircuit size={size} />;
          case 'google': return <Sparkles size={size} />;
          case 'anthropic': return <Bot size={size} />;
          default: return <Bot size={size} />;
      }
  };

  // Helper to render icon for Message
  const renderMessageIcon = (msg: Message, size: number) => {
      if (msg.modelIcon && (msg.modelIcon.startsWith('data:') || msg.modelIcon.startsWith('http'))) {
          return <img src={msg.modelIcon} alt="" className="w-full h-full object-cover" />;
      }
      // Default icons based on provider
      switch (msg.modelProvider) {
          case 'openai': return <BrainCircuit size={size} />;
          case 'google': return <Sparkles size={size} />;
          case 'anthropic': return <Bot size={size} />;
          default: return <Bot size={size} />;
      }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const promptData = e.dataTransfer.getData('application/json/prompt');
    if (promptData) {
      const prompt = JSON.parse(promptData);
      setInputText(prev => prev ? prev + '\n' + prompt.content : prompt.content);
    }
    
    const fileData = e.dataTransfer.getData('application/json/file');
    if (fileData) {
      const file = JSON.parse(fileData);
      if (!attachedFiles.find(f => f.id === file.id)) {
        setAttachedFiles(prev => [...prev, file]);
      }
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        id: Date.now().toString() + Math.random().toString(),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        isMaster: false,
        isOfficial: false
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Reordering Handlers
  const handlePromptDragStart = (e: React.DragEvent, index: number, p: PromptItem) => {
    e.dataTransfer.setData('application/json/prompt', JSON.stringify(p));
    e.dataTransfer.setData('text/plain/prompt-index', index.toString());
  };

  const handlePromptDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndexStr = e.dataTransfer.getData('text/plain/prompt-index');
    if (dragIndexStr) {
      const dragIndex = parseInt(dragIndexStr, 10);
      if (dragIndex !== dropIndex && !isNaN(dragIndex)) {
        const newPrompts = [...prompts];
        const [draggedItem] = newPrompts.splice(dragIndex, 1);
        newPrompts.splice(dropIndex, 0, draggedItem);
        setPrompts(newPrompts);
      }
    }
  };

  const handleFileDragStart = (e: React.DragEvent, index: number, f: FileItem) => {
    e.dataTransfer.setData('application/json/file', JSON.stringify(f));
    e.dataTransfer.setData('text/plain/file-index', index.toString());
  };

  const handleFileDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndexStr = e.dataTransfer.getData('text/plain/file-index');
    if (dragIndexStr) {
      const dragIndex = parseInt(dragIndexStr, 10);
      if (dragIndex !== dropIndex && !isNaN(dragIndex)) {
        const newFiles = [...files];
        const [draggedItem] = newFiles.splice(dragIndex, 1);
        newFiles.splice(dropIndex, 0, draggedItem);
        setFiles(newFiles);
      }
    }
  };

  // Prompt Handlers
  const handleSavePrompt = (data: { id?: string; title: string; content: string; companyId: string; isOfficial: boolean; folderId?: string }) => {
    if (data.id) {
      setPrompts(prev => prev.map(p => p.id === data.id ? { ...p, title: data.title, content: data.content, companyId: data.companyId, isOfficial: data.isOfficial, folderId: data.folderId } : p));
    } else {
      setPrompts(prev => [...prev, {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        isMaster: currentUser.role === 'master_admin',
        companyId: data.companyId,
        isOfficial: data.isOfficial,
        folderId: data.folderId,
        userId: currentUser.email
      }]);
    }
    setIsPromptModalOpen(false);
    setEditingPrompt(null);
  };

  const editPrompt = (p: PromptItem) => {
    setEditingPrompt(p);
    setIsPromptModalOpen(true);
  };

  const deletePrompt = (id: string) => {
    if (confirm('このプロンプトを削除しますか？')) {
      setPrompts(prev => prev.filter(p => p.id !== id));
    }
  };

  // File Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isOfficial: boolean) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Date.now().toString() + Math.random().toString(),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        isMaster: currentUser.role === 'master_admin',
        companyId: '',
        isOfficial: isOfficial,
        userId: currentUser.email
      }));
      
      if (currentUser.role === 'master_admin' && isOfficial) {
        setPendingFiles(newFiles);
        setIsFileModalOpen(true);
      } else {
        setFiles(prev => [...prev, ...newFiles]);
      }
    }
  };

  const handleSaveFile = (data: { id?: string; name: string; companyId: string; isOfficial: boolean; folderId?: string }) => {
    if (pendingFiles.length > 0) {
      const filesWithCompany = pendingFiles.map(f => ({ 
        ...f, 
        companyId: data.companyId, 
        name: pendingFiles.length === 1 && data.name ? data.name : f.name,
        isOfficial: data.isOfficial,
        folderId: data.folderId
      }));
      setFiles(prev => [...prev, ...filesWithCompany]);
      setPendingFiles([]);
    } else if (data.id) {
      setFiles(prev => prev.map(f => f.id === data.id ? { ...f, name: data.name, companyId: data.companyId, isOfficial: data.isOfficial, folderId: data.folderId } : f));
      setAttachedFiles(prev => prev.map(f => f.id === data.id ? { ...f, name: data.name, companyId: data.companyId, isOfficial: data.isOfficial, folderId: data.folderId } : f));
    }
    setIsFileModalOpen(false);
    setEditingFile(null);
  };

  const editFile = (f: FileItem) => {
    setEditingFile(f);
    setIsFileModalOpen(true);
  };

  const deleteFile = (id: string) => {
    if (confirm('このファイルを削除しますか？')) {
      setFiles(prev => prev.filter(f => f.id !== id));
      setAttachedFiles(prev => prev.filter(af => af.id !== id));
    }
  };

  // Folder Handlers
  const handleAddFolder = (type: 'prompt' | 'file', isOfficial: boolean) => {
    setFolderType(type);
    setFolderIsOfficial(isOfficial);
    setEditingFolder(null);
    setIsFolderModalOpen(true);
  };

  const handleEditFolder = (folder: FolderItem) => {
    setEditingFolder(folder);
    setIsFolderModalOpen(true);
  };

  const saveFolder = (name: string) => {
    if (!editingFolder) {
      setFolders(prev => [...prev, {
        id: Date.now().toString(),
        name,
        type: folderType,
        isOfficial: folderIsOfficial,
        companyId: folderIsOfficial ? 'c1' : undefined, // Default to first company for demo
        userId: folderIsOfficial ? undefined : currentUser.email
      }]);
    } else {
      setFolders(prev => prev.map(f => f.id === editingFolder.id ? { ...f, name } : f));
    }
    setIsFolderModalOpen(false);
    setEditingFolder(null);
  };

  const handleDeleteFolder = (id: string) => {
    if (confirm('このフォルダを削除しますか？中のアイテムはルートに移動します。')) {
      setFolders(prev => prev.filter(f => f.id !== id));
      setPrompts(prev => prev.map(p => p.folderId === id ? { ...p, folderId: undefined } : p));
      setFiles(prev => prev.map(f => f.folderId === id ? { ...f, folderId: undefined } : f));
    }
  };

  const handleMoveItemToFolder = (itemId: string, itemType: 'prompt' | 'file', folderId: string | null) => {
    if (itemType === 'prompt') {
      setPrompts(prev => prev.map(p => p.id === itemId ? { ...p, folderId: folderId || undefined } : p));
    } else {
      setFiles(prev => prev.map(f => f.id === itemId ? { ...f, folderId: folderId || undefined } : f));
    }
  };

  return (
    <div className="flex h-full bg-brand-bg overflow-hidden relative">
      {/* Main Chat Area */}
      <div className={`flex-1 relative flex flex-col min-w-0 transition-all duration-300 ${isRightSidebarOpen ? 'md:mr-80' : ''}`}>
        <div className={`flex-1 overflow-y-auto px-4 md:px-8 pb-40 custom-scrollbar transition-all duration-500 ${hasStarted ? '' : 'flex flex-col items-center justify-center'}`}>
          
          {/* 1. Initial Greeting View */}
          {!hasStarted && (
             <div className="text-center space-y-2 mb-20 animate-fadeIn">
                 <h1 className="text-4xl font-bold text-brand-text tracking-tight">こんにちは、{currentUser.name}さん</h1>
             </div>
          )}

          {/* 2. Timeline View */}
          {hasStarted && (
              <div className="max-w-3xl mx-auto w-full space-y-8 py-4">
                   {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fadeIn`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100 overflow-hidden ${
                              msg.role === 'ai' ? 'bg-white text-brand-text' : 'bg-brand-text text-white'
                          }`}>
                              {msg.role === 'ai' ? (
                                  renderMessageIcon(msg, 18)
                              ) : (
                                  currentUser.avatarUrl ? (
                                      <img src={currentUser.avatarUrl} alt="User" className="w-full h-full object-cover" />
                                  ) : (
                                      <span className="font-bold text-sm">U</span>
                                  )
                              )}
                          </div>
                          <div className={`max-w-[80%] rounded-3xl p-5 text-base leading-relaxed shadow-sm ${
                              msg.role === 'ai' 
                                  ? 'bg-white text-brand-text rounded-tl-none' 
                                  : 'bg-brand-bg text-brand-text rounded-tr-none'
                          }`}>
                              {msg.role === 'ai' && <div className="text-xs font-bold text-brand-yellow mb-1">{msg.modelName}</div>}
                              
                              {/* Attached Files Display in Message */}
                              {msg.attachedFiles && msg.attachedFiles.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {msg.attachedFiles.map(f => (
                                    <div key={f.id} className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg text-sm border border-slate-200/50">
                                      <FileText size={14} className="text-slate-500" />
                                      <span className="truncate max-w-[150px]">{f.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="whitespace-pre-wrap">{msg.text}</div>
                          </div>
                      </div>
                  ))}
                  <div ref={messagesEndRef} />
              </div>
          )}
        </div>

        {/* 3. Bottom Input Bar (Floating) */}
        <div className={`absolute bottom-6 left-0 right-0 px-4 transition-all duration-500 z-20`}>
            <div className="max-w-3xl mx-auto relative group">
                
                 {/* Model Selector Popover */}
                 {isModelSelectorOpen && (
                     <div className="absolute bottom-[110%] left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-fadeIn mb-2 overflow-hidden">
                         <div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">モデルを選択</div>
                         <div className="max-h-60 overflow-y-auto custom-scrollbar">
                             {chatModels.filter(m => m.enabled).map(model => (
                                 <button 
                                    key={model.id}
                                    onClick={() => { setSelectedModelId(model.id); setIsModelSelectorOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left ${selectedModelId === model.id ? 'bg-brand-bg' : 'hover:bg-slate-50'}`}
                                 >
                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ${selectedModelId === model.id ? 'bg-brand-text text-white' : 'bg-slate-100 text-slate-500'}`}>
                                         {renderModelIcon(model, 16)}
                                     </div>
                                     <div>
                                         <div className={`text-sm font-bold ${selectedModelId === model.id ? 'text-brand-text' : 'text-slate-700'}`}>{model.name}</div>
                                         <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{model.description}</div>
                                     </div>
                                     {selectedModelId === model.id && <div className="ml-auto w-2 h-2 rounded-full bg-brand-yellow"></div>}
                                 </button>
                             ))}
                         </div>
                         
                         <div className="border-t border-slate-100 mt-2 pt-2 px-1">
                             <button 
                               onClick={() => setIsWebSearch(!isWebSearch)}
                               className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                             >
                                 <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                     <Globe size={16} className="text-blue-500" />
                                     ウェブ検索
                                 </div>
                                 <div className={`w-10 h-5 rounded-full relative transition-colors ${isWebSearch ? 'bg-blue-500' : 'bg-slate-200'}`}>
                                     <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isWebSearch ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                 </div>
                             </button>
                         </div>
                     </div>
                 )}

                <div 
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border ${isDragOver ? 'border-brand-yellow bg-yellow-50/50 scale-[1.02]' : 'border-slate-200'} p-2 flex flex-col relative transition-all duration-200`}
                >
                     {/* Attached Files Display */}
                     {attachedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1">
                          {attachedFiles.map(f => (
                            <div key={f.id} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-sm border border-slate-200">
                              <FileText size={14} className="text-slate-500" />
                              <span className="truncate max-w-[150px] font-medium text-slate-700">{f.name}</span>
                              <button onClick={() => setAttachedFiles(prev => prev.filter(af => af.id !== f.id))} className="text-slate-400 hover:text-red-500 transition-colors">
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                     <textarea
                         value={inputText}
                         onChange={(e) => setInputText(e.target.value)}
                         onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                         placeholder={isDragOver ? "ここにドロップして追加" : "本日は何をお手伝いできますか？"}
                         className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-base p-4 min-h-[60px] max-h-[200px] resize-none text-brand-text placeholder-slate-400"
                         rows={1}
                     />
                     
                     <div className="flex items-center justify-between px-2 pb-1">
                         {/* Left Actions (Model Select) */}
                         <div className="flex items-center gap-2">
                             <button 
                               onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
                               className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-sm font-bold text-slate-700"
                             >
                                 <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-brand-yellow shadow-sm overflow-hidden flex-shrink-0">
                                     {renderModelIcon(selectedModel, 12)}
                                 </span>
                                 {selectedModel.name}
                                 <ChevronUp size={14} className={`text-slate-400 transition-transform ${isModelSelectorOpen ? 'rotate-180' : ''}`} />
                             </button>
                             
                             {isWebSearch && (
                                 <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                                     <Globe size={12} /> Search ON
                                 </div>
                             )}
                         </div>

                         {/* Right Actions (Send) */}
                         <div className="flex items-center gap-2">
                              <button 
                                className={`p-2 rounded-full transition-colors ${isRightSidebarOpen ? 'text-brand-yellow bg-yellow-50' : 'text-slate-400 hover:text-brand-text hover:bg-slate-100'}`}
                                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                                title="ツールを開く"
                              >
                                  <Wrench size={20} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-brand-text hover:bg-slate-100 rounded-full transition-colors">
                                  <Paperclip size={20} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-brand-text hover:bg-slate-100 rounded-full transition-colors">
                                  <Mic size={20} />
                              </button>
                              <button 
                                  onClick={handleSendMessage}
                                  disabled={!inputText.trim() && attachedFiles.length === 0}
                                  className="w-10 h-10 flex items-center justify-center bg-brand-text text-white rounded-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
                              >
                                  <Send size={18} />
                              </button>
                         </div>
                     </div>
                </div>
            </div>
            <div className="text-center mt-4 text-[10px] text-slate-400 font-medium">
               AIは間違いを犯す可能性があります。重要な情報は確認してください。
            </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isRightSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsRightSidebarOpen(false)}
        />
      )}

      {/* Right Sidebar */}
      <RightSidebar
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        currentUser={currentUser}
        prompts={prompts}
        files={files}
        folders={folders}
        attachedFiles={attachedFiles}
        companies={MOCK_COMPANIES}
        onPromptDragStart={handlePromptDragStart}
        onPromptDrop={handlePromptDrop}
        onPromptClick={(p: PromptItem) => setInputText(prev => prev ? prev + '\n' + p.content : p.content)}
        onEditPrompt={editPrompt}
        onDeletePrompt={deletePrompt}
        onAddPrompt={(isOfficial) => {
          setEditingPrompt(null);
          setIsAddingOfficial(isOfficial);
          setIsPromptModalOpen(true);
        }}
        onFileDragStart={handleFileDragStart}
        onFileDrop={handleFileDrop}
        onFileClick={(f: FileItem) => {
          if (!attachedFiles.find(af => af.id === f.id)) {
            setAttachedFiles(prev => [...prev, f]);
          }
        }}
        onEditFile={editFile}
        onDeleteFile={deleteFile}
        onFileUpload={(files, isOfficial) => {
          setIsAddingOfficial(isOfficial);
          handleFileUpload(files, isOfficial);
        }}
        onAddFolder={handleAddFolder}
        onEditFolder={handleEditFolder}
        onDeleteFolder={handleDeleteFolder}
        onMoveItemToFolder={handleMoveItemToFolder}
      />

      {/* Prompt Modal */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => {
          setIsPromptModalOpen(false);
          setEditingPrompt(null);
        }}
        onSave={handleSavePrompt}
        initialData={editingPrompt}
        currentUser={currentUser}
        companies={MOCK_COMPANIES}
        isOfficial={isAddingOfficial}
      />

      {/* File Modal */}
      <FileModal
        isOpen={isFileModalOpen}
        onClose={() => {
          setIsFileModalOpen(false);
          setPendingFiles([]);
          setEditingFile(null);
        }}
        onSave={handleSaveFile}
        pendingFiles={pendingFiles}
        initialData={editingFile}
        currentUser={currentUser}
        companies={MOCK_COMPANIES}
        isOfficial={isAddingOfficial}
      />
      {/* Folder Modal */}
      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false);
          setEditingFolder(null);
        }}
        onSave={saveFolder}
        initialData={editingFolder}
      />
    </div>
  );
};
