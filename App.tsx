import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { CompanyList } from './pages/CompanyList';
import { PostList } from './pages/PostList';
import { PostDetail } from './pages/PostDetail';
import { AIEmployeeList } from './pages/AIEmployeeList';
import { AIChat } from './pages/AIChat';
import { CompanyGroupList, CompanyEmployeeList, CompanyCategoryList, CompanyPostList } from './pages/CompanySubLists';
import { CompanyStats } from './pages/CompanyStats';
import { Dashboard } from './pages/Dashboard';
import { Ranking } from './pages/Ranking';
import { MasterGroups } from './pages/MasterGroups';
import { MasterUsers } from './pages/MasterUsers';
import { MasterCategories } from './pages/MasterCategories';
import { MasterBasicCategories } from './pages/MasterBasicCategories';
import { PasswordChange } from './pages/PasswordChange';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { ChatModelManagement } from './pages/ChatModelManagement';
import { User, PageView, Company, AIEmployee, ChatSession, ChatModel, BasicCategory } from './types';
import { GripHorizontal } from 'lucide-react';

// Mock User Data
const USERS: Record<string, User> = {
  MASTER: {
    name: '管理者',
    companyName: 'Rulesome AI',
    avatarUrl: '', // Handled by initial in layout
    role: 'master_admin',
    email: 'admin@rulesome.ai'
  },
  ADMIN: {
    name: '田中',
    companyName: '株式会社エンデザイン',
    avatarUrl: '',
    role: 'admin',
    email: 'tanaka@en-design.com'
  },
  USER: {
    name: '一般 花子',
    companyName: 'Acme Corp',
    avatarUrl: '',
    role: 'user',
    email: 'hanako@acme.com'
  }
};

// Mock Chat History Data for AI Employees
const MOCK_CHAT_HISTORY: ChatSession[] = [
  { id: '1', title: '議事録を作成して', timestamp: '2025-10-15 10:00' },
  { id: '2', title: 'Pythonコードのデバッグ', timestamp: '2025-10-14 15:30' },
  { id: '3', title: '来週のプレゼン資料の構成案', timestamp: '2025-10-12 09:15' },
  { id: '4', title: '有給休暇の申請方法について', timestamp: '2025-10-10 11:20' },
  { id: '5', title: '今日のランチのおすすめ', timestamp: '2025-10-08 12:05' },
];

// Mock Chat History Data for Home (General Chat) - Distinct from AI Employee Chat
const MOCK_HOME_CHAT_HISTORY: ChatSession[] = [
  { id: 'h1', title: '新規事業のアイデア出し', timestamp: '2025-10-16 09:30' },
  { id: 'h2', title: 'マーケティング戦略の壁打ち', timestamp: '2025-10-15 14:00' },
  { id: 'h3', title: 'Pythonエラー解決', timestamp: '2025-10-13 11:00' },
];

// Mock Chat Models for Home
const INITIAL_CHAT_MODELS: ChatModel[] = [
    { id: '1', name: 'GPT-5.2 Pro', description: 'Advanced reasoning and coding', icon: '', provider: 'openai', enabled: true },
    { id: '2', name: 'Gemini 3 Pro Preview', description: 'Multimodal capabilities', icon: '', provider: 'google', enabled: true },
    { id: '3', name: 'Claude Opus 4.5', description: 'Nuanced writing and analysis', icon: '', provider: 'anthropic', enabled: true },
    { id: '4', name: 'Claude Haiku 4.5', description: 'Fast and efficient', icon: '', provider: 'anthropic', enabled: true },
];

// Initial Basic Categories
const INITIAL_BASIC_CATEGORIES: BasicCategory[] = [
  { id: '1', name: '文案生成', icon: 'FileText', order: 1 },
  { id: '2', name: '修正・要約', icon: 'Edit', order: 2 },
  { id: '3', name: '分析・推論', icon: 'BarChart', order: 3 },
  { id: '4', name: 'アイデア出し', icon: 'Lightbulb', order: 4 },
  { id: '5', name: '会話', icon: 'MessageCircle', order: 5 },
  { id: '6', name: '創作', icon: 'PenTool', order: 6 },
  { id: '7', name: '説明', icon: 'BookOpen', order: 7 },
  { id: '8', name: 'チェック', icon: 'CheckSquare', order: 8 },
  { id: '9', name: 'コード', icon: 'Code', order: 9 },
];

// AI Employee Data (Moved from AIEmployeeList.tsx)
const INITIAL_AI_EMPLOYEES: AIEmployee[] = [
  // --- BASIC AI EMPLOYEES (Assigned to categories) ---
  // 1. 文案生成
  { id: 'b6', date: '2025-11-05', title: 'キャッチコピー生成', tag: '商品PR文の作成', companyName: 'System', teams: ['全社共通'], clicks: 150, favorites: 20, memos: 5, type: 'basic', basicCategoryId: '1', iconUrl: '' },
  { id: 'b7', date: '2025-11-05', title: 'メルマガ作成アシスタント', tag: '週次のメルマガ草案を作成', companyName: 'System', teams: ['全社共通'], clicks: 120, favorites: 15, memos: 3, type: 'basic', basicCategoryId: '1', iconUrl: '', isNew: true },

  // 2. 修正・要約
  { id: 'b3', date: '2025-11-20', title: '高精度翻訳Bot', tag: 'DeepL API連携', companyName: 'System', teams: ['全社共通'], clicks: 560, favorites: 45, memos: 12, type: 'basic', basicCategoryId: '2', iconUrl: '' },
  { id: 'b4', date: '2025-11-15', title: '議事録要約AI', tag: '長文テキストの要約とアクションアイテム抽出', companyName: 'System', teams: ['全社共通'], clicks: 430, favorites: 90, memos: 30, type: 'basic', basicCategoryId: '2', iconUrl: '' },

  // 3. 分析・推論
  { id: 'b2', date: '2025-12-08', title: 'Gemini Pro Vision', tag: '画像認識・マルチモーダル対応', companyName: 'System', teams: ['全社共通'], clicks: 890, favorites: 80, memos: 20, type: 'basic', basicCategoryId: '3', iconUrl: '', isNew: true },
  { id: 'b8', date: '2025-12-08', title: 'データトレンド分析', tag: 'CSVデータから傾向を読み解く', companyName: 'System', teams: ['全社共通'], clicks: 300, favorites: 40, memos: 10, type: 'basic', basicCategoryId: '3', iconUrl: '' },

  // 4. アイデア出し
  { id: 'b9', date: '2025-12-01', title: '新規事業ブレスト', tag: '市場動向に基づいた事業案出し', companyName: 'System', teams: ['全社共通'], clicks: 250, favorites: 30, memos: 8, type: 'basic', basicCategoryId: '4', iconUrl: '' },
  { id: 'b10', date: '2025-12-01', title: '企画書構成案', tag: 'ラフなアイデアから構成を作成', companyName: 'System', teams: ['全社共通'], clicks: 210, favorites: 25, memos: 6, type: 'basic', basicCategoryId: '4', iconUrl: '' },

  // 5. 会話
  { id: 'b1', date: '2025-12-09', title: 'GPT-4o Chat', tag: '最新の汎用チャットモデル', companyName: 'System', teams: ['全社共通'], clicks: 1240, favorites: 150, memos: 45, type: 'basic', basicCategoryId: '5', iconUrl: '', isNew: true },
  { id: 'b11', date: '2025-12-09', title: '英語コーチ', tag: 'ビジネス英会話の練習相手', companyName: 'System', teams: ['全社共通'], clicks: 400, favorites: 60, memos: 15, type: 'basic', basicCategoryId: '5', iconUrl: '' },

  // 6. 創作
  { id: 'b12', date: '2025-11-25', title: 'ストーリーテラー', tag: 'ショートストーリーの作成', companyName: 'System', teams: ['全社共通'], clicks: 180, favorites: 20, memos: 4, type: 'basic', basicCategoryId: '6', iconUrl: '' },
  { id: 'b13', date: '2025-11-25', title: 'ポエム生成', tag: '感情豊かな詩を作成', companyName: 'System', teams: ['全社共通'], clicks: 150, favorites: 10, memos: 2, type: 'basic', basicCategoryId: '6', iconUrl: '' },

  // 7. 説明
  { id: 'b14', date: '2025-11-30', title: '専門用語解説', tag: '難しいIT用語を子供向けに解説', companyName: 'System', teams: ['全社共通'], clicks: 320, favorites: 40, memos: 10, type: 'basic', basicCategoryId: '7', iconUrl: '' },
  { id: 'b15', date: '2025-11-30', title: 'チュートリアル作成', tag: '操作手順の説明文を作成', companyName: 'System', teams: ['全社共通'], clicks: 280, favorites: 35, memos: 8, type: 'basic', basicCategoryId: '7', iconUrl: '' },

  // 8. チェック
  { id: 'b16', date: '2025-11-10', title: '契約書リスクチェック', tag: '条文のリーガルチェック', companyName: 'System', teams: ['全社共通'], clicks: 450, favorites: 70, memos: 25, type: 'basic', basicCategoryId: '8', iconUrl: '' },
  { id: 'b17', date: '2025-11-10', title: 'コード脆弱性診断', tag: 'セキュリティホールの指摘', companyName: 'System', teams: ['全社共通'], clicks: 380, favorites: 65, memos: 20, type: 'basic', basicCategoryId: '8', iconUrl: '' },

  // 9. コード
  { id: 'b5', date: '2025-11-05', title: 'Pythonコード生成', tag: 'コードスニペットの生成', companyName: 'System', teams: ['全社共通'], clicks: 200, favorites: 50, memos: 10, type: 'basic', basicCategoryId: '9', iconUrl: '' },
  { id: 'b18', date: '2025-11-05', title: 'SQLクエリ作成', tag: '自然言語からSQLを生成', companyName: 'System', teams: ['全社共通'], clicks: 190, favorites: 45, memos: 8, type: 'basic', basicCategoryId: '9', iconUrl: '' },
  
  // --- CUSTOM AI EMPLOYEES ---
  { id: 'c1', date: '2025-12-09', title: 'チャットフローのチャットで画像生成応答のサンプル', tag: 'gemini', companyName: '株式会社エンデザイン', teams: ['営業制作チーム', '技術部アプリ開発部', 'AI開発部タイランド'], clicks: 18, favorites: 0, memos: 0, type: 'custom', iconUrl: '', isNew: true },
  { id: 'c2', date: '2025-12-08', title: '漫才生成くん', tag: '言葉を２つ投げると漫才を書いてくれます', companyName: '株式会社エンデザイン', teams: ['営業制作チーム', 'AI開発部タイランド'], clicks: 16, favorites: 0, memos: 1, type: 'custom', iconUrl: '', etc: 'テーマを2つ入力すると、漫才の台本を生成します。\n例：AI と お笑い' },
  { id: 'c3', date: '2025-12-04', title: '動画内容解析Bot', tag: '動画ファイルをアップロードして内容を質問', companyName: '株式会社エンデザイン', teams: ['技術部アプリ開発部', 'AI開発部'], clicks: 9, favorites: 0, memos: 0, type: 'custom', iconUrl: '' },
  { id: 'c4', date: '2025-11-27', title: '社内規定QAボット', tag: '就業規則や経費精算について回答します', companyName: '株式会社エンデザイン', teams: ['総務部', '人事部'], clicks: 342, favorites: 25, memos: 15, type: 'custom', iconUrl: '' },
  { id: 'c5', date: '2025-11-20', title: 'OCR & データ抽出', tag: '請求書PDFから金額と日付を抽出', companyName: '株式会社エンデザイン', teams: ['経理部', 'デザインチーム'], clicks: 55, favorites: 8, memos: 2, type: 'custom', iconUrl: '' },
  { id: 'c6', date: '2025-10-15', title: '新卒採用面接練習パートナー', tag: '学生役として面接の練習相手になります', companyName: '株式会社エンデザイン', teams: ['人事採用チーム'], clicks: 88, favorites: 12, memos: 5, type: 'custom', iconUrl: '', etc: '面接官として振る舞ってください。\n評価ポイント：論理的思考力、コミュニケーション能力' },
];

const App: React.FC = () => {
  // State for current role and view
  const [currentRoleKey, setCurrentRoleKey] = useState<keyof typeof USERS>('ADMIN');
  const [usersState, setUsersState] = useState(USERS); // To allow updates
  // Default view is now HOME for everyone
  const [currentView, setCurrentView] = useState<PageView>(PageView.HOME);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedAIEmployee, setSelectedAIEmployee] = useState<AIEmployee | null>(null);
  
  // Tab state for AI Employee List to persist selection
  // Changed default to 'custom' as requested
  const [aiEmployeeTab, setAiEmployeeTab] = useState<'basic' | 'custom'>('custom');
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(MOCK_CHAT_HISTORY);
  const [homeChatHistory, setHomeChatHistory] = useState<ChatSession[]>(MOCK_HOME_CHAT_HISTORY);

  // Home Chat Models State
  const [chatModels, setChatModels] = useState<ChatModel[]>(INITIAL_CHAT_MODELS);
  
  // Basic Categories State (Shared between AIEmployeeList and MasterBasicCategories)
  const [basicCategories, setBasicCategories] = useState<BasicCategory[]>(INITIAL_BASIC_CATEGORIES);

  // AI Employees State (Lifted up for Sidebar Notification)
  const [aiEmployees, setAiEmployees] = useState<AIEmployee[]>(INITIAL_AI_EMPLOYEES);

  const currentUser = usersState[currentRoleKey];

  // Check if there are any new AI employees to show notification in sidebar
  const hasNewAIEmployee = aiEmployees.some(emp => emp.isNew);

  // Helper to switch role and set default view
  const switchRole = (roleKey: keyof typeof USERS) => {
    setCurrentRoleKey(roleKey);
    // Always default to Home regardless of role
    setCurrentView(PageView.HOME);
    // Reset tab to 'custom' when switching roles
    setAiEmployeeTab('custom');
  };

  const handleUpdateUser = (updatedUser: Partial<User>) => {
    setUsersState(prev => ({
      ...prev,
      [currentRoleKey]: { ...prev[currentRoleKey], ...updatedUser }
    }));
  };

  const handleNavigate = (page: PageView) => {
    setCurrentView(page);
    if (page === PageView.COMPANY_LIST) {
      setSelectedCompany(null);
    }
    if (page === PageView.AI_EMPLOYEE_LIST) {
        setSelectedAIEmployee(null);
    }
  };

  const handleCompanyAction = (company: Company, view: PageView) => {
    setSelectedCompany(company);
    setCurrentView(view);
  };

  const handleAIEmployeeChat = (employee: AIEmployee) => {
      setSelectedAIEmployee(employee);
      setCurrentView(PageView.AI_CHAT);
  };

  // Chat Handlers
  const handleNewChat = () => {
    if(window.confirm('新しいチャットを開始しますか？')) {
      alert('新しいチャットを開始しました');
      // In a real app, reset chat messages here
    }
  };

  const handleSelectChat = (sessionId: string) => {
    const chat = chatHistory.find(c => c.id === sessionId);
    if (chat) {
       // In a real app, load chat messages for this session
       console.log(`Loading chat: ${chat.title}`);
    }
  };

  // Home Chat Handlers
  const handleNewHomeChat = () => {
    if(window.confirm('ホームチャットをリセットしますか？')) {
      alert('新しいホームチャットを開始しました');
    }
  };

  const handleSelectHomeChat = (sessionId: string) => {
      const chat = homeChatHistory.find(c => c.id === sessionId);
      if (chat) {
          console.log(`Loading home chat: ${chat.title}`);
          // Logic to load chat content would go here
      }
  };

  // If in Login view, render only Login component
  if (currentView === PageView.LOGIN) {
      return (
          <>
             <Login onLogin={() => switchRole('ADMIN')} />
             <DemoSwitcher 
                currentRoleKey={currentRoleKey} 
                onSwitchRole={switchRole}
                onGoToLogin={() => {}} // Already on login
                isLoginPage={true}
             />
          </>
      )
  }

  return (
    <>
      <Layout 
        user={currentUser} 
        currentPage={currentView}
        onNavigate={handleNavigate}
        // Pass Chat Props (AI Employee)
        chatHistory={currentView === PageView.AI_CHAT ? chatHistory : []}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        // Pass Home Chat Props
        homeChatHistory={homeChatHistory}
        onNewHomeChat={handleNewHomeChat}
        onSelectHomeChat={handleSelectHomeChat}
        
        onUpdateUser={handleUpdateUser}
        // New Prop for Sidebar Notification
        hasNewAIEmployee={hasNewAIEmployee}
      >
        <div className="animate-fadeIn h-full">
          {/* Main Home (Chat) */}
          {currentView === PageView.HOME && (
              <Home chatModels={chatModels} currentUser={currentUser} />
          )}

          {/* Admin User Pages */}
          {currentView === PageView.DASHBOARD && (
            <Dashboard onNavigateRanking={() => handleNavigate(PageView.RANKING)} />
          )}
          {currentView === PageView.RANKING && <Ranking />}
          {currentView === PageView.AI_EMPLOYEE_LIST && (
            <AIEmployeeList 
                userRole={currentUser.role} 
                onChatStart={handleAIEmployeeChat} 
                currentTab={aiEmployeeTab}
                onTabChange={setAiEmployeeTab}
                basicCategories={basicCategories}
                employees={aiEmployees}
                onUpdateEmployees={setAiEmployees}
            />
          )}
          {currentView === PageView.AI_CHAT && selectedAIEmployee && (
            <AIChat 
                employee={selectedAIEmployee}
                currentUser={currentUser}
                onBack={() => handleNavigate(PageView.AI_EMPLOYEE_LIST)} 
            />
          )}

          {currentView === PageView.MASTER_GROUPS && <MasterGroups />}
          {currentView === PageView.MASTER_USERS && <MasterUsers />}
          {currentView === PageView.MASTER_CATEGORIES && <MasterCategories />}
          {currentView === PageView.MASTER_BASIC_CATEGORIES && (
             <MasterBasicCategories 
                categories={basicCategories} 
                onUpdate={setBasicCategories} 
             />
          )}
          
          {currentView === PageView.PASSWORD_CHANGE && <PasswordChange />}
          
          {/* Master Admin Pages */}
          {currentView === PageView.CHAT_MODEL_MANAGEMENT && (
              <ChatModelManagement 
                  models={chatModels} 
                  onUpdateModels={setChatModels} 
              />
          )}

          {currentView === PageView.COMPANY_LIST && (
            <CompanyList onNavigateSubPage={handleCompanyAction} />
          )}
          
          {/* Sub Pages for Master Admin */}
          {selectedCompany && currentView === PageView.COMPANY_GROUPS && (
            <CompanyGroupList company={selectedCompany} onBack={() => handleNavigate(PageView.COMPANY_LIST)} />
          )}
          {selectedCompany && currentView === PageView.COMPANY_EMPLOYEES && (
            <CompanyEmployeeList company={selectedCompany} onBack={() => handleNavigate(PageView.COMPANY_LIST)} />
          )}
          {selectedCompany && currentView === PageView.COMPANY_CATEGORIES && (
            <CompanyCategoryList company={selectedCompany} onBack={() => handleNavigate(PageView.COMPANY_LIST)} />
          )}
          {selectedCompany && currentView === PageView.COMPANY_POSTS && (
            <CompanyPostList company={selectedCompany} onBack={() => handleNavigate(PageView.COMPANY_LIST)} />
          )}
          {selectedCompany && currentView === PageView.COMPANY_STATS && (
            <CompanyStats company={selectedCompany} onBack={() => handleNavigate(PageView.COMPANY_LIST)} />
          )}

          {currentView === PageView.POST_LIST && (
            <PostList onPostClick={() => setCurrentView(PageView.POST_DETAIL)} />
          )}
          {currentView === PageView.POST_DETAIL && <PostDetail />}
        </div>
      </Layout>

      <DemoSwitcher 
        currentRoleKey={currentRoleKey} 
        onSwitchRole={switchRole}
        onGoToLogin={() => setCurrentView(PageView.LOGIN)}
      />
    </>
  );
};

const DemoSwitcher: React.FC<{ 
    currentRoleKey: string; 
    onSwitchRole: (role: keyof typeof USERS) => void;
    onGoToLogin: () => void;
    isLoginPage?: boolean;
}> = ({ currentRoleKey, onSwitchRole, onGoToLogin, isLoginPage }) => {
    // Draggable Logic
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const isDragging = React.useRef(false);
    const dragStart = React.useRef({ x: 0, y: 0 });
    const initialPos = React.useRef({ x: 0, y: 0 });

    const handlePointerDown = (e: React.PointerEvent) => {
        // Only start drag if clicking the header or empty space, allow buttons to be clicked
        const target = e.target as HTMLElement;
        if (target.tagName === 'BUTTON') return;

        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        initialPos.current = { ...position };
        
        // Use setPointerCapture to track cursor even if it leaves the element
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;
        
        // Prevent default touch behaviors like scrolling
        e.preventDefault();

        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;

        setPosition({
            x: initialPos.current.x + dx,
            y: initialPos.current.y + dy
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    };

    return (
      <div 
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 touch-none select-none"
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
         <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-200 cursor-move hover:bg-white transition-colors flex items-center gap-2">
           <GripHorizontal size={14} className="text-gray-400" />
           Demo Role Switcher
         </div>
         <div className="flex flex-col gap-2 p-2 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-2xl">
           <RoleButton 
             label="マスタ管理者" 
             isActive={!isLoginPage && currentRoleKey === 'MASTER'} 
             onClick={() => onSwitchRole('MASTER')} 
           />
           <RoleButton 
             label="管理者ユーザー" 
             isActive={!isLoginPage && currentRoleKey === 'ADMIN'} 
             onClick={() => onSwitchRole('ADMIN')} 
           />
           <RoleButton 
             label="一般ユーザー" 
             isActive={!isLoginPage && currentRoleKey === 'USER'} 
             onClick={() => onSwitchRole('USER')} 
           />
           <div className="h-px bg-gray-200 my-1"></div>
           <RoleButton 
             label="ログアウト (Login)" 
             isActive={!!isLoginPage} 
             onClick={onGoToLogin} 
           />
         </div>
      </div>
    );
}

const RoleButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 w-32 text-left
      ${isActive 
        ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
        : 'bg-gray-50 text-gray-600 hover:bg-white hover:text-primary'
      }`}
  >
    {label}
  </button>
);

export default App;