import { motion } from 'motion/react';
import React, { ReactNode } from 'react';

interface DetailRowProps {
  label: string;
  value: string | ReactNode;
  icon?: ReactNode;
  subValue?: string;
  className?: string;
}

export const TripDetailRow = ({ label, value, icon, subValue, className = '' }: DetailRowProps) => {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 ${className}`}>
      {icon && (
        <div className="bg-white p-2.5 rounded-xl shadow-sm text-primary">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">{label}</div>
        <div className="text-sm font-bold text-gray-800">{value}</div>
        {subValue && <div className="text-xs text-gray-500 font-medium">{subValue}</div>}
      </div>
    </div>
  );
};

export const ToggleRow = ({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) => {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <motion.button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-colors ${active ? 'bg-success' : 'bg-gray-200'}`}
      >
        <motion.div
           animate={{ x: active ? 24 : 0 }}
           className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </motion.button>
    </div>
  );
};
