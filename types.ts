
export interface User {
  name: string;
  companyName: string;
  avatarUrl: string;
  role: 'master_admin' | 'admin' | 'user';
  email?: string;
}

export interface Company {
  id: string;
  displayId: string;
  name: string;
  groupCount: number;
  employeeCount: number;
  categoryCount: number;
  postCount: number;
  initials: string;
  colorClass: string;
  gptPassword?: string; // Added for settings
}

export interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  views: number;
  memos: number;
  favorites: number;
}

export interface BasicCategory {
  id: string;
  name: string;
  icon: string; // lucide icon name or similar identifier
  order: number;
}

export interface AIEmployee {
  id: string;
  title: string;
  date: string;
  tag: string;
  companyName: string;
  teams: string[];
  clicks: number;
  favorites: number;
  memos: number;
  type: 'basic' | 'custom';
  basicCategoryId?: string; // Linked to BasicCategory
  iconUrl?: string; // Added for custom icon upload
  etc?: string; // Added for remarks/template
  isNew?: boolean; // 新規作成マーク用
}

export interface PromptItem {
  id: string;
  title: string;
  content: string;
  isMaster: boolean;
  companyId?: string;
  userId?: string;
  isOfficial: boolean;
  folderId?: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  isMaster: boolean;
  companyId?: string;
  userId?: string;
  isOfficial: boolean;
  folderId?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  type: 'prompt' | 'file';
  isOfficial: boolean;
  companyId?: string;
  userId?: string;
  parentId?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  modelName?: string;
  timestamp: string;
  modelIcon?: string;
  modelProvider?: 'openai' | 'google' | 'anthropic' | 'other';
  attachedFiles?: FileItem[];
}

// New Interface for Home Chat Models
export interface ChatModel {
  id: string;
  name: string;
  description: string;
  icon: string; // URL or icon name
  provider: 'openai' | 'google' | 'anthropic' | 'other';
  // Dify Settings
  apiKey?: string;
  baseUrl?: string;
  appId?: string;
  isPrompt?: boolean;
  enabled: boolean;
}

// New Interfaces for Sub-lists based on screenshots
export interface CompanyGroup {
  id: string;
  name: string;
  order: number;
  createdAt: string;
}

export interface CompanyEmployee {
  id: string;
  name: string;
  email: string;
  passwordPlaceholder: string;
  group: string;
  twoFactor: 'ON' | 'OFF';
  loginInfo: boolean; // Button 'Send Email'
  createdAt: string;
  type: 'admin' | 'user';
}

export interface CompanyCategory {
  id: string;
  name: string;
  order: number;
  createdAt: string;
}

export interface CompanyPost {
  id: string;
  title: string;
  hasUrl: boolean;
  destination: string;
  group: string;
  category: string;
  clicks: number;
  favorites: number;
  memos: number;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
}

export enum PageView {
  LOGIN = 'login',
  HOME = 'home', // New Home Tab
  DASHBOARD = 'dashboard',
  RANKING = 'ranking',
  AI_EMPLOYEE_LIST = 'ai_employee_list', // Formerly POST_LIST
  AI_CHAT = 'ai_chat', // Added for Chat Screen
  POST_LIST = 'post_list',
  
  // Master Data
  MASTER_GROUPS = 'master_groups',
  MASTER_USERS = 'master_users',
  MASTER_CATEGORIES = 'master_categories',
  MASTER_BASIC_CATEGORIES = 'master_basic_categories', // New
  CHAT_MODEL_MANAGEMENT = 'chat_model_management', // New Master Admin Tab
  
  PASSWORD_CHANGE = 'password_change',

  // Master Admin Views
  COMPANY_LIST = 'company_list',
  COMPANY_GROUPS = 'company_groups',
  COMPANY_EMPLOYEES = 'company_employees',
  COMPANY_CATEGORIES = 'company_categories',
  COMPANY_POSTS = 'company_posts',
  COMPANY_STATS = 'company_stats',
  
  POST_DETAIL = 'post_detail',
}