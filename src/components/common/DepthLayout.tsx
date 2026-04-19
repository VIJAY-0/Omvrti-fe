import { motion } from 'motion/react';
import React, { ReactNode, useState } from 'react';
import { TopBar } from './TopBar';
import { Drawer } from './Drawer';

interface DepthLayoutProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  headerContent?: ReactNode;
}

export const DepthLayout = ({
  children,
  title,
  showBack,
  onBack,
  headerContent,
}: DepthLayoutProps) => {
  const [drawerType, setDrawerType] = useState<'menu' | 'profile' | null>(null);

  const isDrawerOpen = drawerType !== null;

  return (
    <div className="page-container bg-canvas pb-24 relative">
      <TopBar 
        showBack={showBack} 
        onMenuClick={() => setDrawerType('menu')}
        onProfileClick={() => setDrawerType('profile')}
      />

      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setDrawerType(null)} 
        type={drawerType || 'menu'} 
      />

      {/* Layer 02: Midground Gradient */}
      <div className="absolute top-0 left-0 right-0 h-full layer-02-gradient z-0 pointer-events-none" />

      {/* Layer 03: Foreground Content Stack */}
      <div className="relative z-10 flex flex-col pt-[66px] px-5 pb-8 min-h-screen">
        <div className="flex flex-col gap-1 mb-6 mt-6">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {headerContent}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col gap-4"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
