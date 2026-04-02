import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login delay
    setTimeout(() => {
        onLogin();
    }, 500);
  };

  return (
    <div className="bg-brand-bg min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute w-full h-full overflow-hidden bg-brand-bg pointer-events-none">
         {/* Simple Circles for flat design feel */}
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-yellow rounded-full opacity-10 blur-3xl"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white rounded-full opacity-40 blur-3xl"></div>
      </div>

      {/* Solid Card */}
      <div className="w-full max-w-[520px] bg-white rounded-[40px] relative z-10 shadow-xl p-12 md:p-16 border border-white/60">
        
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Rulesome AI Portal Logo" className="w-24 h-24 rounded-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-brand-text mb-3 tracking-tight">Rulesome AI Portal</h1>
          <p className="text-slate-400 text-sm font-bold tracking-wide">ルーサムAI ポータル</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-brand-text ml-4 uppercase tracking-wider opacity-70" htmlFor="email">メールアドレス</label>
              <input 
                  className="block w-full px-8 py-5 bg-brand-bg border-none rounded-full text-brand-text text-lg placeholder-slate-400 focus:ring-2 focus:ring-brand-yellow/50 transition-all outline-none font-medium" 
                  id="email" 
                  name="email" 
                  placeholder="name@company.com" 
                  required 
                  type="email"
                />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-brand-text ml-4 uppercase tracking-wider opacity-70" htmlFor="password">パスワード</label>
              <input 
                  className="block w-full px-8 py-5 bg-brand-bg border-none rounded-full text-brand-text text-lg placeholder-slate-400 focus:ring-2 focus:ring-brand-yellow/50 transition-all outline-none font-medium" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                />
            </div>

            <button 
                type="submit"
                className="w-full mt-8 py-5 px-8 bg-brand-yellow text-brand-text text-lg font-bold rounded-full hover:opacity-70 transition-opacity duration-300 shadow-none active:scale-[0.98]"
            >
                ログイン
            </button>
        </form>
        
        <div className="mt-12 text-center">
            <p className="text-xs text-slate-400 font-bold tracking-wider">
                ©︎ en design inc. All Rights RESERVED.
            </p>
        </div>
      </div>
    </div>
  );
};