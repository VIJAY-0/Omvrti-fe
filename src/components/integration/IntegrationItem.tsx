import { motion } from 'motion/react';
import React, { ReactNode } from 'react';
import { Card } from '../common/Card';

interface IntegrationItemProps {
  key?: React.Key;
  provider: string;
  status: 'Connected' | 'Connect';
  icon: ReactNode;
  onClick: () => void;
}

export const IntegrationItem = ({ provider, status, icon, onClick }: IntegrationItemProps) => {
  const isConnected = status === 'Connected';

  return (
    <Card onClick={onClick} className="mb-3 flex items-center justify-between !py-3 !px-4">
      <div className="flex items-center gap-4">
        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-center">
          {icon}
        </div>
        <span className="font-bold text-gray-800">{provider}</span>
      </div>
      
      <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
        isConnected ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
      }`}>
        {status}
      </div>
    </Card>
  );
};
