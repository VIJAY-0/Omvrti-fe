import React from 'react';
import { Menu, ChevronLeft, User, Wifi, Battery, Signal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

interface TopBarProps {
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  showBack?: boolean;
}

export const TopBar = ({ onMenuClick, onProfileClick, showBack }: TopBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-[#E0E0E0] h-[66px] flex flex-col justify-center">
      {/* Navigation Bar (66px) */}
      <div className="h-[66px] flex items-center justify-between px-4 relative">
        <div className="w-10">
          {showBack ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="text-[#333333]"
            >
              <ChevronLeft size={24} />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onMenuClick}
              className="text-[#333333]"
            >
              <Menu size={24} />
            </motion.button>
          )}
        </div>

        {/* Logo Placeholder */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <div className="h-8 w-32 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="mvrti.ai logo" 
              className="h-8 object-contain"
            />
          </div>
        </div>

        <div className="w-10 flex justify-end">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onProfileClick}
            className="text-[#4A90E2]"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary/20 shadow-sm transition-transform hover:scale-105">
               <img 
                 src="https://picsum.photos/seed/sam-watson/100/100" 
                 alt="Sam Watson" 
                 className="w-full h-full object-cover"
                 referrerPolicy="no-referrer"
               />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
