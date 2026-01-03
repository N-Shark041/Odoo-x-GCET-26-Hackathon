
import React, { useState, useMemo } from 'react';
import { calculatePasswordStrength, isPasswordValid } from '../../utils/passwordUtils';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  showChecklist?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  value, 
  onChange, 
  label = "Password", 
  placeholder = "••••••••",
  showChecklist = true 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const strength = useMemo(() => calculatePasswordStrength(value), [value]);

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest pl-1">
          {label}
        </label>
        {value.length > 0 && (
          <span className={`text-[10px] font-bold uppercase ${strength.label === 'Strong' ? 'text-emerald-500' : 'text-gray-400'}`}>
            {strength.label}
          </span>
        )}
      </div>
      
      <div className="relative">
        <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input 
          type={showPassword ? "text" : "password"} 
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-gray-900 dark:text-white"
          required
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
        >
          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
      </div>

      {/* Strength Bar */}
      <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden transition-all">
        <div 
          className={`h-full transition-all duration-500 ${strength.color}`}
          style={{ width: `${value.length > 0 ? strength.score : 0}%` }}
        ></div>
      </div>

      {/* Checklist */}
      {showChecklist && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
          <CheckItem met={strength.metCriteria.length15} text="15+ characters" />
          <span className="text-[10px] text-gray-400 font-bold uppercase md:col-span-2 text-center my-1">— OR —</span>
          <CheckItem met={strength.metCriteria.length8} text="8+ characters" />
          <CheckItem met={strength.metCriteria.hasUpper} text="Uppercase letter" />
          <CheckItem met={strength.metCriteria.hasLower} text="Lowercase letter" />
          <CheckItem met={strength.metCriteria.hasNumber} text="A number" />
          <CheckItem met={strength.metCriteria.hasSpecial} text="Special character" />
        </div>
      )}
    </div>
  );
};

const CheckItem = ({ met, text }: { met: boolean; text: string }) => (
  <div className={`flex items-center space-x-2 text-xs font-medium transition-colors ${met ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
    <i className={`fa-solid ${met ? 'fa-circle-check' : 'fa-circle-dot opacity-30'} text-[10px]`}></i>
    <span className={met ? 'line-through opacity-70' : ''}>{text}</span>
  </div>
);

export default PasswordInput;
