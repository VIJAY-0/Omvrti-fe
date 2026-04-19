import { LucideIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  icon?: LucideIcon;
  rightIcon?: ReactNode;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const InputField = ({
  label,
  placeholder,
  icon: Icon,
  rightIcon,
  type = 'text',
  value,
  onChange,
  className = '',
}: InputFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl py-4 ${Icon ? 'pl-12' : 'px-4'} pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm`}
        />
        {rightIcon && <div className="absolute right-4">{rightIcon}</div>}
      </div>
    </div>
  );
};
