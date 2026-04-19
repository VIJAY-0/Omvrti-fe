import { motion } from 'motion/react';
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card } from '../common/Card';

interface CategoryCardProps {
  key?: React.Key;
  title: string;
  subtitle: string;
  total: number;
  accepted: number;
  onClick: () => void;
  colorClass: string;
}

export const CategoryCard = ({
  title,
  subtitle,
  total,
  accepted,
  onClick,
  colorClass,
}: CategoryCardProps) => {
  return (
    <Card onClick={onClick} className="mb-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
          <div className="flex gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full font-bold bg-[#E3EEFF] text-primary">Total: {total}</span>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${accepted > 0 ? 'bg-[#E6F4EA] text-success' : 'bg-gray-100 text-gray-400'}`}>Accepted: {accepted}</span>
          </div>
        </div>
        <div className="bg-white w-8 h-8 rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-primary font-bold">
          <ChevronRight size={18} />
        </div>
      </div>
    </Card>
  );
};
