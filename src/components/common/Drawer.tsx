import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Briefcase, Clock, Gift, User, Settings, Shield, CreditCard, Wallet, HelpCircle, Phone, Bell, LogOut } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'menu' | 'profile';
  userName?: string;
}

export const Drawer = ({ isOpen, onClose, type, userName = "Sam Watson" }: DrawerProps) => {
  const isProfile = type === 'profile';
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const menuItems = {
    TRIPS: [
        { icon: Briefcase, label: "My Bookings" },
        { icon: Briefcase, label: "Trip Planner", path: ROUTES.TRIPS.PLANNING },
        { icon: Clock, label: "Travel History" }
    ],
    REWARDS: [
        { icon: Gift, label: "OmVrti.ai Rewards" }
    ],
    PROFILE: [
        { icon: User, label: "My Profile" },
        { icon: Settings, label: "My Preferences" },
        { icon: Shield, label: "Travel Policy" },
        { icon: CreditCard, label: "Payment Methods" },
        { icon: Wallet, label: "My Wallet" }
    ],
    SUPPORT: [
        { icon: HelpCircle, label: "Help" },
        { icon: Phone, label: "Contact us" }
    ],
    SETTINGS: [
        { icon: Bell, label: "Notifications", path: ROUTES.ALERTS }
    ]
  };

  const profileItems = [
    { icon: User, label: "My Profile" },
    { icon: Gift, label: "OmVrti.ai Rewards" },
    { icon: Settings, label: "My Preferences" },
    { icon: Bell, label: "Notifications", path: ROUTES.ALERTS },
    { icon: Shield, label: "App", path: ROUTES.INTEGRATION.HOME },
    { icon: Settings, label: "Linked Accounts", path: ROUTES.INTEGRATION.HOME },
    { icon: CreditCard, label: "Payment Methods" },
    { icon: Wallet, label: "My wallet" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100]"
          />
          <motion.div
            initial={{ x: isProfile ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isProfile ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 ${isProfile ? 'right-0' : 'left-0'} bottom-0 w-[85%] max-w-sm bg-white z-[101] shadow-2xl flex flex-col p-6 overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-8">
              {isProfile ? (
                 <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-primary/10 overflow-hidden shadow-md">
                      <img 
                        src="https://picsum.photos/seed/sam-watson/100/100" 
                        alt="Sam Watson" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                        <div className="font-bold text-lg">{userName}</div>
                        <div className="text-xs text-gray-400 font-medium">sam.watson@omvrti.ai</div>
                    </div>
                 </div>
              ) : (
                 <div className="flex items-center">
                    <img 
                      src="/logo.png" 
                      alt="mvrti.ai logo" 
                      className="h-8 object-contain"
                    />
                 </div>
              )}
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {isProfile ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        {profileItems.map((item, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => item.path && handleNavigate(item.path)}
                                className="flex items-center gap-4 py-3 border-b border-gray-50 hover:bg-gray-50 rounded-lg px-2 text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                <item.icon size={20} className="text-gray-400" />
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 py-3 text-sm font-medium text-red-500 cursor-pointer px-2">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </div>
                  </div>
              ) : (
                Object.entries(menuItems).map(([category, items]) => (
                    <div key={category} className="flex flex-col gap-3">
                        <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{category}</div>
                        <div className="flex flex-col gap-1">
                            {items.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => item.path && handleNavigate(item.path)}
                                    className="flex items-center gap-4 py-2 hover:bg-gray-50 rounded-lg px-2 text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                    <item.icon size={20} className="text-gray-400" />
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
              )}
            </div>

            {isProfile && (
                <div className="mt-auto pt-6 flex justify-end">
                    <div className="p-3 bg-gray-100 rounded-full text-gray-500">
                        <Settings size={20} />
                    </div>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
