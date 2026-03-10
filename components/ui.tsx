import React from 'react';

// --- Card / Panel ---
interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-brand-card rounded-3xl shadow-sm border border-transparent ${className}`}
    >
      {children}
    </div>
  );
};

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass-green' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'huge';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  // Base style: Fully rounded (pill), transition opacity on hover
  const baseStyle = "transition-opacity duration-200 font-bold rounded-full flex items-center justify-center gap-2 active:scale-95 hover:opacity-70 shadow-none border";
  
  let variantStyle = "";
  switch (variant) {
    case 'primary':
      // Accent 1 (Yellow) with Dark Text - No border needed usually, or transparent
      variantStyle = "bg-brand-yellow text-brand-text border-brand-yellow";
      break;
    case 'secondary':
      // White background with Dark text border
      variantStyle = "bg-white text-brand-text border-slate-200";
      break;
    case 'glass-green':
      // Subtle green style
      variantStyle = "bg-emerald-50 text-emerald-800 border-emerald-100";
      break;
    case 'danger':
      variantStyle = "bg-red-50 text-red-600 hover:bg-red-100 border-red-100";
      break;
  }

  let sizeStyle = "";
  switch (size) {
    case 'sm': sizeStyle = "px-4 py-1.5 text-sm"; break;
    case 'md': sizeStyle = "px-6 py-3 text-sm"; break;
    case 'lg': sizeStyle = "px-8 py-4 text-base"; break;
    case 'huge': sizeStyle = "w-full py-5 text-lg font-bold tracking-wide"; break;
  }

  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ className = '', icon, ...props }) => {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {icon}
        </div>
      )}
      {/* Input background set to main background color to contrast with white card */}
      <input
        className={`w-full bg-brand-bg border-none text-brand-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-text/20 rounded-full py-3.5 px-6 ${icon ? 'pl-12' : ''} ${className} transition-all`}
        {...props}
      />
    </div>
  );
};

// --- TextArea ---
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea: React.FC<TextAreaProps> = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`w-full bg-brand-bg border-none text-brand-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-text/20 rounded-3xl py-4 px-6 resize-none ${className} transition-all`}
      {...props}
    />
  );
};

// --- Badges ---
export const Badge: React.FC<{ label: string; count: number; color?: string }> = ({ label, count, color = 'bg-brand-bg' }) => (
  <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 border border-transparent ${color}`}>
    {label} <span className="font-bold ml-1 text-brand-text">{count}</span>
  </span>
);

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  maxWidth?: string;
}

export const GlassModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onSave, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-brand-text/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <GlassPanel className={`relative z-10 w-full ${maxWidth} flex flex-col max-h-[90vh] animate-fadeIn bg-brand-card shadow-2xl`}>
        <div className="p-8 pb-4 flex-shrink-0 border-b border-brand-bg">
             <h2 className="text-2xl font-bold text-brand-text">{title}</h2>
        </div>
        
        <div className="p-8 py-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>

        <div className="p-8 pt-4 flex justify-end gap-3 flex-shrink-0 border-t border-brand-bg">
          <Button variant="secondary" onClick={onClose}>
            キャンセル
          </Button>
          <Button variant="primary" onClick={onSave}>
            保存/作成
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
};