import { motion } from 'motion/react';
import { Plane } from 'lucide-react';
import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface TripCardProps {
  key?: React.Key;
  name: string;
  status?: 'Accepted' | 'Pending';
  onEdit?: (e?: React.MouseEvent) => void;
  onAccept?: (e?: React.MouseEvent) => void;
  onClick?: () => void;
}

export const TripCard = ({ name, status, onEdit, onAccept, onClick }: TripCardProps) => {
  return (
    <Card onClick={onClick} className="mb-4 !p-4">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-2xl text-primary flex-shrink-0">
          <Plane size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[15px] font-semibold text-gray-800 leading-tight mb-3 truncate">{name}</h4>
          
          <div className="flex justify-between items-center">
            {status === 'Accepted' ? (
              <div className="bg-success text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
                Accepted
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  color="primary"
                  className="flex-1 !py-2 !text-[12px] !rounded-lg"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    onEdit?.(e);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="solid"
                  color="accent"
                  className="flex-1 !py-2 !text-[12px] !rounded-lg"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    onAccept?.(e);
                  }}
                >
                  Accept
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
