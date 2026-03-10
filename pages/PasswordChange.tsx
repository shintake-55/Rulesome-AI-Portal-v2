import React, { useState } from 'react';
import { GlassPanel, Input, Button } from '../components/ui';

export const PasswordChange: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }
    alert('パスワードを変更しました');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-[600px] mx-auto pt-10 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">パスワード変更</h2>
      
      <GlassPanel className="p-8 bg-white/80">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block font-bold text-slate-700 mb-2">新しいパスワード(英数字8文字以上）</label>
            <Input 
              type="password" 
              required 
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-8">
            <label className="block font-bold text-slate-700 mb-2">新しいパスワード(英数字8文字以上）（確認）</label>
            <Input 
              type="password" 
              required 
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            変更する
          </Button>
        </form>
      </GlassPanel>
    </div>
  );
};