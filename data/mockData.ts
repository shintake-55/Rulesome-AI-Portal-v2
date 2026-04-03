export const companies = [
  { id: 'c1', name: '株式会社テクノロジーズ' },
  { id: 'c2', name: 'グローバルソリューションズ株式会社' },
  { id: 'c3', name: 'イノベーション・パートナーズ' },
];

export const kpiData = {
  totalConversations: 12450,
  totalMessages: 84320,
  totalTokens: 145600000,
  activeUserRate: 78.5,
};

export const timeSeriesData = {
  day: Array.from({ length: 24 }, (_, i) => ({
    date: `${i.toString().padStart(2, '0')}:00`,
    conversations: Math.floor(Math.random() * 200) + 50,
    messages: Math.floor(Math.random() * 1000) + 300,
  })),
  month: Array.from({ length: 31 }, (_, i) => ({
    date: `${i + 1}日`,
    conversations: Math.floor(Math.random() * 500) + 200,
    messages: Math.floor(Math.random() * 3000) + 1000,
  })),
  year: Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 11 + i);
    return {
      date: `${d.getMonth() + 1}月`,
      conversations: Math.floor(Math.random() * 15000) + 5000,
      messages: Math.floor(Math.random() * 100000) + 30000,
    };
  })
};

export const popularAIs = [
  { id: 'ai0', name: 'ホームAI', type: 'Basic', conversations: 5200 },
  { id: 'ai1', name: '社内規定ヘルプデスク', type: 'Basic', conversations: 4500 },
  { id: 'ai2', name: '営業資料アシスタント', type: 'Custom', conversations: 3200 },
  { id: 'ai3', name: 'コードレビューAI', type: 'Custom', conversations: 2800 },
  { id: 'ai4', name: '翻訳アシスタント', type: 'Basic', conversations: 2100 },
  { id: 'ai5', name: '経費精算ボット', type: 'Basic', conversations: 1800 },
  { id: 'ai6', name: 'アイデアブレストAI', type: 'Custom', conversations: 1500 },
  { id: 'ai7', name: '議事録サマライザー', type: 'Basic', conversations: 1200 },
  { id: 'ai8', name: '新人メンターAI', type: 'Custom', conversations: 900 },
  { id: 'ai9', name: 'マーケティング分析', type: 'Custom', conversations: 750 },
  { id: 'ai10', name: 'スケジュール調整', type: 'Basic', conversations: 500 },
];

export const activeUsers = [
  { id: 'u1', name: '山田 太郎', email: 'yamada@example.com', messages: 1250, group: '営業部' },
  { id: 'u2', name: '佐藤 花子', email: 'sato@example.com', messages: 1120, group: '開発部' },
  { id: 'u3', name: '鈴木 一郎', email: 'suzuki@example.com', messages: 980, group: '営業部' },
  { id: 'u4', name: '高橋 健太', email: 'takahashi@example.com', messages: 850, group: '開発部' },
  { id: 'u5', name: '田中 美咲', email: 'tanaka@example.com', messages: 720, group: '人事部' },
  { id: 'u6', name: '伊藤 誠', email: 'ito@example.com', messages: 650, group: '総務部' },
  { id: 'u7', name: '渡辺 結衣', email: 'watanabe@example.com', messages: 580, group: '営業部' },
  { id: 'u8', name: '山本 大輔', email: 'yamamoto@example.com', messages: 510, group: '開発部' },
  { id: 'u9', name: '中村 さくら', email: 'nakamura@example.com', messages: 450, group: '人事部' },
  { id: 'u10', name: '小林 翔太', email: 'kobayashi@example.com', messages: 390, group: '総務部' },
];

export const tokenUsage = [
  { name: 'ホームAI', value: 50000000 },
  { name: '社内規定ヘルプデスク', value: 45000000 },
  { name: '営業資料アシスタント', value: 35000000 },
  { name: 'コードレビューAI', value: 25000000 },
  { name: '翻訳アシスタント', value: 15000000 },
  { name: '経費精算ボット', value: 10000000 },
  { name: 'その他', value: 15600000 },
];

export const aiMessageRatio = [
  { name: 'ホームAI', messages: 30000, ratio: 35.5 },
  { name: '社内規定ヘルプデスク', messages: 25000, ratio: 29.6 },
  { name: '営業資料アシスタント', messages: 18000, ratio: 21.3 },
  { name: 'コードレビューAI', messages: 15000, ratio: 17.8 },
  { name: '翻訳アシスタント', messages: 10000, ratio: 11.9 },
  { name: '経費精算ボット', messages: 8000, ratio: 9.5 },
  { name: 'アイデアブレストAI', messages: 4000, ratio: 4.7 },
  { name: '議事録サマライザー', messages: 2000, ratio: 2.4 },
  { name: '新人メンターAI', messages: 1200, ratio: 1.4 },
  { name: 'マーケティング分析', messages: 800, ratio: 0.9 },
  { name: 'スケジュール調整', messages: 320, ratio: 0.4 },
];

export const userDetailsMap: Record<string, any> = {
  'u1': {
    name: '山田 太郎',
    email: 'yamada@example.com',
    mostUsedAI: '社内規定ヘルプデスク',
    totalMessages: 1250,
    totalConversations: 180,
    usage: [
      { aiName: '社内規定ヘルプデスク', conversations: 80, messages: 600, ratio: 48 },
      { aiName: '営業資料アシスタント', conversations: 50, messages: 400, ratio: 32 },
      { aiName: '翻訳アシスタント', conversations: 50, messages: 250, ratio: 20 },
    ]
  },
  'u2': {
    name: '佐藤 花子',
    email: 'sato@example.com',
    mostUsedAI: '営業資料アシスタント',
    totalMessages: 1120,
    totalConversations: 150,
    usage: [
      { aiName: '営業資料アシスタント', conversations: 70, messages: 500, ratio: 44.6 },
      { aiName: '社内規定ヘルプデスク', conversations: 40, messages: 300, ratio: 26.8 },
      { aiName: 'アイデアブレストAI', conversations: 40, messages: 320, ratio: 28.6 },
    ]
  }
};

export const allAIs = [
  { id: 'ai0', name: 'ホームAI', type: 'Basic', conversations: 5200, messages: 30000, tokens: 50000000 },
  { id: 'ai1', name: '社内規定ヘルプデスク', type: 'Basic', conversations: 4500, messages: 25000, tokens: 45000000 },
  { id: 'ai2', name: '営業資料アシスタント', type: 'Custom', conversations: 3200, messages: 18000, tokens: 35000000 },
  { id: 'ai3', name: 'コードレビューAI', type: 'Custom', conversations: 2800, messages: 15000, tokens: 25000000 },
  { id: 'ai4', name: '翻訳アシスタント', type: 'Basic', conversations: 2100, messages: 10000, tokens: 15000000 },
  { id: 'ai5', name: '経費精算ボット', type: 'Basic', conversations: 1800, messages: 8000, tokens: 10000000 },
  { id: 'ai6', name: 'アイデアブレストAI', type: 'Custom', conversations: 1500, messages: 4000, tokens: 5000000 },
  { id: 'ai7', name: '議事録サマライザー', type: 'Basic', conversations: 1200, messages: 2000, tokens: 3000000 },
  { id: 'ai8', name: '新人メンターAI', type: 'Custom', conversations: 900, messages: 1200, tokens: 2000000 },
  { id: 'ai9', name: 'マーケティング分析', type: 'Custom', conversations: 750, messages: 800, tokens: 1500000 },
  { id: 'ai10', name: 'スケジュール調整', type: 'Basic', conversations: 500, messages: 320, tokens: 500000 },
];
