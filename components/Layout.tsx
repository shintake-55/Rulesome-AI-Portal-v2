import React, { useState, useRef, useEffect } from 'react';
import { User, PageView, ChatSession } from '../types';
import { 
  LayoutDashboard, 
  Building2,
  Bot,
  LogOut,
  Menu,
  X,
  Trophy,
  Database,
  Key,
  ChevronDown,
  ChevronRight,
  Plus,
  MessageSquare,
  Camera,
  User as UserIcon,
  Home,
  Cpu,
  Layers,
  Settings,
  MoreVertical
} from 'lucide-react';
import { Button, GlassModal, Input } from './ui';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  // Chat Sidebar Props (AI Employee Chat)
  chatHistory?: ChatSession[];
  onNewChat?: () => void;
  onSelectChat?: (sessionId: string) => void;
  // Home Chat Sidebar Props (New)
  homeChatHistory?: ChatSession[];
  onNewHomeChat?: () => void;
  onSelectHomeChat?: (sessionId: string) => void;
  onUpdateUser?: (updatedUser: Partial<User>) => void;
  // Sidebar Notification Prop
  hasNewAIEmployee?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  currentPage, 
  onNavigate,
  chatHistory = [],
  onNewChat,
  onSelectChat,
  homeChatHistory = [],
  onNewHomeChat,
  onSelectHomeChat,
  onUpdateUser,
  hasNewAIEmployee = false
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMasterMenuOpen, setIsMasterMenuOpen] = useState(false);
  
  // User Menu Popover State
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // User Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editUserName, setEditUserName] = useState('');
  const [editUserAvatar, setEditUserAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNavigate = (page: PageView) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      alert('ログアウトしました（デモ）');
    }
    setIsUserMenuOpen(false);
  };

  const handleOpenProfileModal = () => {
      setEditUserName(user.name);
      setEditUserAvatar(user.avatarUrl);
      setIsProfileModalOpen(true);
      setIsUserMenuOpen(false);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              setEditUserAvatar(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveProfile = () => {
      if (onUpdateUser) {
          onUpdateUser({
              name: editUserName,
              avatarUrl: editUserAvatar
          });
      }
      setIsProfileModalOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if current page is a master page to auto-expand menu
  useEffect(() => {
    if ([PageView.MASTER_GROUPS, PageView.MASTER_USERS, PageView.MASTER_CATEGORIES, PageView.MASTER_BASIC_CATEGORIES, PageView.CHAT_MODEL_MANAGEMENT].includes(currentPage)) {
      setIsMasterMenuOpen(true);
    }
  }, [currentPage]);

  // Permission check for editing user name
  const canEditName = user.role === 'master_admin' || user.role === 'admin';

  // --- RENDER SIDEBAR CONTENT BASED ON VIEW ---
  const renderSidebarContent = () => {
    // 1. CHAT MODE SIDEBAR (Specific to AI Employee Chat)
    if (currentPage === PageView.AI_CHAT) {
      return (
        <div className="flex flex-col h-full px-4 py-6">
           <div className="mb-6">
             <Button 
                variant="secondary" 
                className="w-full justify-start pl-6 shadow-none bg-white text-brand-text border-none hover:opacity-80" 
                onClick={onNewChat}
             >
                <Plus size={18} /> 
                新規チャット
             </Button>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
              <div className="mb-2 px-3 text-xs font-bold text-brand-text/50">チャット履歴</div>
              <div className="space-y-1">
                {chatHistory.length === 0 && (
                   <div className="text-xs text-brand-text/50 px-3 py-2">履歴はありません</div>
                )}
                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat && onSelectChat(chat.id)}
                    className="w-full text-left px-4 py-3 rounded-full text-sm text-brand-text hover:bg-white/30 transition-all truncate flex items-center gap-2 group font-medium"
                  >
                    <MessageSquare size={16} className="flex-shrink-0 text-brand-text/70" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                ))}
              </div>
           </div>
           
           <div className="mt-4 pt-4 border-t border-brand-text/10">
             <SidebarItem 
               icon={<LayoutDashboard size={18} />} 
               label="ポータルへ戻る" 
               onClick={() => handleNavigate(PageView.AI_EMPLOYEE_LIST)}
             />
           </div>
        </div>
      );
    }

    // 2. STANDARD NAVIGATION SIDEBAR
    return (
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        
        {/* --- Home (All Roles) --- */}
        <SidebarItem 
            icon={<Home size={20} />} 
            label="ホーム" 
            isActive={currentPage === PageView.HOME}
            onClick={() => handleNavigate(PageView.HOME)}
        />
          
        {/* --- Master Admin Menu --- */}
        {user.role === 'master_admin' && (
          <>
            <SidebarItem 
              icon={<Building2 size={20} />} 
              label="企業一覧" 
              isActive={currentPage === PageView.COMPANY_LIST}
              onClick={() => handleNavigate(PageView.COMPANY_LIST)}
            />
            <SidebarItem 
              icon={<Bot size={20} />} 
              label="AI社員一覧" 
              isActive={currentPage === PageView.AI_EMPLOYEE_LIST} 
              onClick={() => handleNavigate(PageView.AI_EMPLOYEE_LIST)}
              hasNotification={hasNewAIEmployee}
            />
          </>
        )}

        {/* --- Admin & General User Menu (Common Items) --- */}
        {(user.role === 'admin' || user.role === 'user') && (
          <>
            <SidebarItem 
              icon={<LayoutDashboard size={20} />} 
              label="ダッシュボード" 
              isActive={currentPage === PageView.DASHBOARD}
              onClick={() => handleNavigate(PageView.DASHBOARD)}
            />

            <SidebarItem 
              icon={<Bot size={20} />} 
              label="AI社員一覧" 
              isActive={currentPage === PageView.AI_EMPLOYEE_LIST} 
              onClick={() => handleNavigate(PageView.AI_EMPLOYEE_LIST)}
              hasNotification={hasNewAIEmployee}
            />
          </>
        )}

        {/* --- Admin Only Menu (Master Data) --- */}
        {(user.role === 'admin' || user.role === 'master_admin') && (
          <div className="pt-2">
            <button 
              onClick={() => setIsMasterMenuOpen(!isMasterMenuOpen)}
              className={`
                w-full flex items-center justify-between px-6 py-3.5 rounded-full transition-all duration-200 font-bold group
                ${[PageView.MASTER_GROUPS, PageView.MASTER_USERS, PageView.MASTER_CATEGORIES, PageView.MASTER_BASIC_CATEGORIES].includes(currentPage)
                  ? 'bg-brand-text text-white shadow-lg' 
                  : 'text-brand-text hover:bg-white/30'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Database size={20} className={ [PageView.MASTER_GROUPS, PageView.MASTER_USERS, PageView.MASTER_CATEGORIES, PageView.MASTER_BASIC_CATEGORIES].includes(currentPage) ? 'text-brand-yellow' : 'text-brand-text'} />
                <span>マスタデータ</span>
              </div>
              {isMasterMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${isMasterMenuOpen ? 'max-h-52 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <div className="ml-6 pl-4 border-l border-brand-text/20 space-y-1">
                {/* Admin sees Groups, Users, Categories */}
                {user.role === 'admin' && (
                  <>
                    <SidebarSubItem 
                      label="グループ" 
                      isActive={currentPage === PageView.MASTER_GROUPS}
                      onClick={() => handleNavigate(PageView.MASTER_GROUPS)}
                    />
                    <SidebarSubItem 
                      label="ユーザー" 
                      isActive={currentPage === PageView.MASTER_USERS}
                      onClick={() => handleNavigate(PageView.MASTER_USERS)}
                    />
                    <SidebarSubItem 
                      label="カテゴリ" 
                      isActive={currentPage === PageView.MASTER_CATEGORIES}
                      onClick={() => handleNavigate(PageView.MASTER_CATEGORIES)}
                    />
                  </>
                )}
                
                {/* Master Admin Only sees Basic Categories in this tab */}
                {user.role === 'master_admin' && (
                    <SidebarSubItem 
                    label="ベーシックカテゴリ" 
                    isActive={currentPage === PageView.MASTER_BASIC_CATEGORIES}
                    onClick={() => handleNavigate(PageView.MASTER_BASIC_CATEGORIES)}
                    />
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- Master Admin: Chat Model Management --- */}
        {user.role === 'master_admin' && (
            <div className="pt-2">
                 <SidebarItem 
                    icon={<Cpu size={20} />} 
                    label="チャットモデル管理" 
                    isActive={currentPage === PageView.CHAT_MODEL_MANAGEMENT} 
                    onClick={() => handleNavigate(PageView.CHAT_MODEL_MANAGEMENT)}
                />
            </div>
        )}

        {/* Note: Password Change & Logout moved to User Menu */}

        {/* --- HOME SPECIFIC: Chat History & New Chat --- */}
        {currentPage === PageView.HOME && (
          <div className="mt-8 pt-6 border-t border-brand-text/10">
             <div className="mb-4">
               <Button 
                  variant="secondary" 
                  className="w-full justify-start pl-6 shadow-none bg-white text-brand-text border-none hover:opacity-80" 
                  onClick={onNewHomeChat}
               >
                  <Plus size={18} /> 
                  新規チャット
               </Button>
             </div>
             
             <div className="px-2">
                <div className="mb-2 px-3 text-xs font-bold text-brand-text/50">ホームチャット履歴</div>
                <div className="space-y-1">
                  {(!homeChatHistory || homeChatHistory.length === 0) && (
                     <div className="text-xs text-brand-text/50 px-3 py-2">履歴はありません</div>
                  )}
                  {homeChatHistory && homeChatHistory.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => onSelectHomeChat && onSelectHomeChat(chat.id)}
                      className="w-full text-left px-4 py-3 rounded-full text-sm text-brand-text hover:bg-white/30 transition-all truncate flex items-center gap-2 group font-medium"
                    >
                      <MessageSquare size={16} className="flex-shrink-0 text-brand-text/70" />
                      <span className="truncate">{chat.title}</span>
                    </button>
                  ))}
                </div>
             </div>
          </div>
        )}

      </nav>
    );
  };

  return (
    <div className="flex h-screen w-full bg-brand-bg text-brand-text overflow-hidden font-sans">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-brand-text/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Main Color is Yellow #fbe233 */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-80
        bg-brand-yellow md:bg-brand-yellow
        flex flex-col flex-shrink-0 z-40 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="h-24 flex items-center px-8 flex-shrink-0">
          <div className="flex items-center font-bold text-xl tracking-tight">
             {/* Desktop Logo (Visible only on md+) */}
             <div className="hidden md:flex items-center">
                 <span className="w-10 h-10 bg-brand-text rounded-full flex items-center justify-center mr-3 text-brand-yellow shadow-sm">
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                 </span>
                 <span className="text-brand-text text-lg">Rulesome AI Portal</span>
             </div>
          </div>
          <button className="md:hidden text-brand-text ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation / Chat Sidebar Content */}
        {renderSidebarContent()}

        {/* User Profile Footer */}
        <div className="p-6 flex-shrink-0 mt-auto relative" ref={userMenuRef}>
           
           {/* User Menu Popover */}
           {isUserMenuOpen && (
               <div className="absolute bottom-[calc(100%-10px)] left-4 right-4 mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fadeIn z-50 flex flex-col p-1">
                   <button 
                     onClick={handleOpenProfileModal}
                     className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-left transition-colors text-sm font-bold text-slate-700"
                   >
                       <Settings size={18} className="text-slate-400" />
                       ユーザー設定
                   </button>
                   <button 
                     onClick={() => { setIsUserMenuOpen(false); handleNavigate(PageView.PASSWORD_CHANGE); }}
                     className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-left transition-colors text-sm font-bold text-slate-700"
                   >
                       <Key size={18} className="text-slate-400" />
                       パスワード変更
                   </button>
                   <div className="h-px bg-slate-100 my-1 mx-2"></div>
                   <button 
                     onClick={handleLogout}
                     className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-left transition-colors text-sm font-bold text-red-500"
                   >
                       <LogOut size={18} />
                       ログアウト
                   </button>
               </div>
           )}

           <button 
             onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
             className={`w-full flex items-center gap-3 px-4 py-4 bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm hover:opacity-100 transition-all text-left border ${isUserMenuOpen ? 'border-brand-text ring-2 ring-brand-text/20' : 'border-white'}`}
           >
             <div className="w-10 h-10 rounded-full bg-brand-bg text-brand-text flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden relative group border border-slate-200">
               {user.avatarUrl ? (
                 <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
               ) : (
                 <UserIcon size={20} className="text-slate-400" />
               )}
             </div>
             <div className="flex-1 overflow-hidden">
               <div className="text-xs text-slate-500 truncate font-medium">{user.companyName}</div>
               <div className="text-sm font-bold text-brand-text truncate">{user.name}</div>
             </div>
             <div className="text-slate-400">
                 <MoreVertical size={16} />
             </div>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-24 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-white rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="flex md:hidden items-center text-brand-text font-bold text-lg tracking-tight">
               <span className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center mr-2 text-brand-text shadow-sm">
                 <span className="material-symbols-outlined text-lg">auto_awesome</span>
               </span>
               <span>Rulesome AI Portal</span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className={`flex-1 relative ${currentPage === PageView.HOME ? 'overflow-hidden' : 'overflow-y-auto px-8 pb-8 custom-scrollbar'}`}>
          {children}
        </div>
      </main>

      {/* User Profile Settings Modal */}
      <GlassModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        title="ユーザー設定" 
        onSave={handleSaveProfile}
      >
          <div className="space-y-6 flex flex-col items-center">
             <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full bg-brand-bg text-slate-400 flex items-center justify-center font-bold text-3xl overflow-hidden border-4 border-white shadow-sm">
                   {editUserAvatar ? (
                       <img src={editUserAvatar} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                       <UserIcon size={48} className="text-slate-400" />
                   )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                />
             </div>
             <p className="text-xs text-slate-400">アイコンをクリックして変更</p>

             <div className="w-full space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">ユーザー名</label>
                    <Input 
                      value={editUserName} 
                      onChange={(e) => setEditUserName(e.target.value)} 
                      placeholder="ユーザー名"
                      disabled={!canEditName}
                      className={!canEditName ? "bg-slate-200 text-slate-500 cursor-not-allowed" : ""}
                    />
                    {!canEditName && <p className="text-xs text-red-500">※ユーザー名の変更は管理者に依頼してください</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">会社名</label>
                    <div className="w-full bg-slate-200 text-slate-500 rounded-full py-3.5 px-6 text-sm">
                        {user.companyName}
                    </div>
                 </div>
             </div>
          </div>
      </GlassModal>

    </div>
  );
};

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  isActive?: boolean; 
  onClick?: () => void; 
  isDanger?: boolean;
  hasNotification?: boolean; 
}> = ({ icon, label, isActive, onClick, isDanger, hasNotification }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-6 py-3.5 rounded-full transition-all duration-200 font-bold relative
        ${isActive 
          ? 'bg-brand-text text-white shadow-lg scale-105' 
          : isDanger 
            ? 'text-brand-text/70 hover:text-red-600 hover:bg-white/50' 
            : 'text-brand-text hover:bg-white/30'
        }
      `}
    >
      <span className={`relative z-10`}>
          {icon}
      </span>
      <span className="relative z-10">{label}</span>
      {hasNotification && (
          <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm relative z-10">
              NEW
          </span>
      )}
    </button>
  );
};

const SidebarSubItem: React.FC<{ 
  label: string; 
  isActive?: boolean; 
  onClick?: () => void;
}> = ({ label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 text-sm font-bold
        ${isActive 
          ? 'text-brand-text bg-white shadow-sm' 
          : 'text-brand-text/70 hover:text-brand-text hover:bg-white/30'
        }
      `}
    >
      <span>{label}</span>
    </button>
  );
};