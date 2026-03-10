import React, { useState, useRef, useEffect } from 'react';
import { Button, GlassPanel, Input, GlassModal, TextArea } from '../components/ui';
import { ArrowLeft, RefreshCw, Send, Paperclip, MessageSquare, Edit2, UploadCloud, Mic, Users, Bot, User as UserIcon, Settings, Sparkles } from 'lucide-react';
import { AIEmployee, User } from '../types';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AIChatProps {
  employee: AIEmployee;
  currentUser: User;
  onBack: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ employee, currentUser, onBack }) => {
  // Mode: 'config' (Initial Setup) or 'chat' (Timeline)
  const [isConfiguring, setIsConfiguring] = useState(true);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration State
  const [attendees, setAttendees] = useState('');
  const [fileName, setFileName] = useState('');

  // Memo State
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [memo, setMemo] = useState('');

  // Initial Message on Load (Only once)
  useEffect(() => {
    if (messages.length === 0) {
        setMessages([
            { 
                id: 'init', 
                role: 'ai', 
                text: `${employee.companyName}の${employee.title}です。\n会議の音声ファイルをアップロードし、開始ボタンを押してください。`, 
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }
        ]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isConfiguring]);

  const handleStartChat = () => {
    if (!fileName && !attendees) {
        // Optional validation
    }
    setIsConfiguring(false);
  };

  const handleEditSettings = () => {
    setIsConfiguring(true);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate AI Response
    setTimeout(() => {
        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: '承知いたしました。アップロードされたデータに基づき、議事録の作成とタスクの抽出を行います。\n\n【ドラフト作成中...】\n・決定事項：次回定例は水曜日に変更\n・TODO：佐藤様が資料を共有\n\n他に修正点はございますか？',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setFileName(e.target.files[0].name);
      }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-100px)] flex flex-col pt-2 pb-4 animate-fadeIn relative">
      
      {/* --- HEADER (Employee Info) --- */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0 px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="hover:text-brand-blue text-slate-500 transition-colors p-3 rounded-full hover:bg-white">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                {employee.iconUrl ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-200 bg-white">
                        <img src={employee.iconUrl} alt="icon" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-text shadow-sm">
                        {employee.type === 'basic' ? <Bot size={24} /> : <Sparkles size={22} />}
                    </div>
                )}
                {employee.title}
            </h2>
            {employee.etc && (
                <div className="text-xs text-slate-500 mt-2 max-w-2xl whitespace-pre-wrap bg-white px-4 py-2 rounded-xl border border-transparent inline-block">
                    {employee.etc}
                </div>
            )}
          </div>
        </div>
        
        <button 
            onClick={() => setIsMemoModalOpen(true)}
            className="text-slate-400 hover:text-brand-blue transition-colors p-3 rounded-full hover:bg-white"
            title="メモ設定"
        >
            <Settings size={20} />
        </button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 relative bg-brand-bg rounded-3xl overflow-hidden flex flex-col">
        
        {/* VIEW 1: CONFIGURATION MODE (Centered Card) */}
        {isConfiguring && (
            <div className="absolute inset-0 z-20 bg-brand-bg/80 backdrop-blur-md flex items-center justify-center p-4">
                <GlassPanel className="w-full max-w-2xl bg-white shadow-2xl p-0 overflow-hidden animate-fadeIn">
                    <div className="px-8 py-6 border-b border-brand-bg flex items-center gap-3">
                        <div className="p-2 bg-brand-yellow rounded-lg text-brand-text">
                            <MessageSquare size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-brand-text">チャット設定</h3>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        {/* Voice Data Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                音声データ
                            </label>
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    id="audio-upload" 
                                    className="hidden" 
                                    onChange={handleFileUpload}
                                />
                                <label 
                                    htmlFor="audio-upload"
                                    className="flex items-center justify-center gap-3 w-full py-6 bg-brand-bg hover:bg-slate-200 text-slate-600 rounded-3xl cursor-pointer transition-colors border-2 border-transparent hover:border-brand-blue/30"
                                >
                                    <UploadCloud size={24} />
                                    <span className="font-bold text-sm">{fileName || 'ローカルアップロード'}</span>
                                </label>
                            </div>
                        </div>

                        {/* Attendees Input */}
                        <div className="space-y-3">
                             <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                出席者 <span className="text-xs font-normal text-slate-400">※呼称は括弧 例：佐藤、田中、山田（やまちゃん）</span>
                            </label>
                            <Input
                                value={attendees}
                                onChange={(e) => setAttendees(e.target.value)}
                                placeholder="出席者 ※呼称は括弧 例：佐藤、田中、山田（やまちゃん）"
                            />
                        </div>

                        {/* Start Button */}
                        <div className="pt-4">
                            <button 
                                onClick={handleStartChat}
                                className="w-full bg-brand-yellow hover:opacity-80 text-brand-text font-bold py-5 rounded-full shadow-lg transition-all active:scale-[0.98]"
                            >
                                チャットを開始
                            </button>
                        </div>
                    </div>
                </GlassPanel>
            </div>
        )}

        {/* VIEW 2: CHAT INTERFACE */}
        
        {/* Chat Settings Header Bar (Visible in Chat Mode) */}
        {!isConfiguring && (
            <div className="h-16 px-6 border-b border-white bg-brand-bg flex items-center justify-between flex-shrink-0 z-10">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <div className="p-1.5 bg-brand-text rounded text-white">
                        <MessageSquare size={16} />
                    </div>
                    <span>チャット設定</span>
                </div>
                <button 
                    onClick={handleEditSettings}
                    className="text-sm text-slate-500 hover:text-brand-blue font-medium px-4 py-2 hover:bg-white rounded-full transition-colors"
                >
                    編集
                </button>
            </div>
        )}

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fadeIn`}>
                    
                    {/* Icon Logic: AI Employee Icon vs User Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden border border-transparent ${
                        msg.role === 'ai' 
                          ? (employee.iconUrl ? 'bg-white' : 'bg-brand-yellow text-brand-text') 
                          : 'bg-brand-text text-white'
                    }`}>
                        {msg.role === 'ai' ? (
                            employee.iconUrl ? <img src={employee.iconUrl} alt="AI" className="w-full h-full object-cover" /> : (employee.type === 'basic' ? <Bot size={24} /> : <Sparkles size={22} />)
                        ) : (
                            currentUser.avatarUrl ? <img src={currentUser.avatarUrl} alt="User" className="w-full h-full object-cover" /> : <UserIcon size={24} />
                        )}
                    </div>

                    <div className={`max-w-[80%] rounded-3xl p-6 text-base leading-relaxed shadow-sm ${
                        msg.role === 'ai' 
                            ? 'bg-white text-brand-text rounded-tl-none' 
                            : 'bg-brand-yellow text-brand-text rounded-tr-none'
                    }`}>
                        <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                        <div className={`text-[10px] mt-2 text-right opacity-50 ${msg.role === 'ai' ? 'text-slate-400' : 'text-slate-800'}`}>
                            {msg.timestamp}
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Footer Input */}
        <div className="p-6 bg-brand-bg">
            <div className="flex gap-3 items-end max-w-4xl mx-auto bg-white p-2 rounded-full shadow-lg">
                <div className="flex-1 rounded-full px-2 flex items-center">
                    <input 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        placeholder="AI社員と話す"
                        className="w-full bg-transparent border-none focus:ring-0 outline-none focus:outline-none px-4 py-4 text-brand-text placeholder-slate-400 text-base"
                    />
                </div>
                <button 
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="p-4 bg-brand-yellow hover:opacity-80 text-brand-text rounded-full shadow-none disabled:opacity-50 transition-all active:scale-95 flex-shrink-0"
                >
                    <Send size={24} />
                </button>
            </div>
        </div>
      </div>

      {/* Memo Modal */}
      <GlassModal
        isOpen={isMemoModalOpen}
        onClose={() => setIsMemoModalOpen(false)}
        title="チャットメモ"
        onSave={() => setIsMemoModalOpen(false)}
      >
        <div className="space-y-4">
            <p className="text-sm text-slate-500">このチャットに関するメモを残せます。</p>
            <TextArea 
                value={memo} 
                onChange={(e) => setMemo(e.target.value)} 
                rows={10} 
                placeholder="メモを入力..." 
                className="min-h-[200px]"
            />
        </div>
      </GlassModal>
    </div>
  );
};