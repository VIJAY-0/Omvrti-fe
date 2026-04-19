import { motion } from 'motion/react';
import React from 'react';

interface ProgressHeaderProps {
  accepted: number;
  total: number;
}

export const ProgressHeader = ({ accepted, total }: ProgressHeaderProps) => {
  const percentage = (accepted / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-gray-800">Accepted : {accepted} out of {total}</span>
        <span className="text-xs font-bold text-success">{Math.round(percentage)}% Complete</span>
      </div>
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-success"
        />
      </div>
    </div>
  );
};
