import { Home as HomeIcon, Compass, Bell, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: HomeIcon, label: 'Home', path: ROUTES.TRIPS.HOME },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Alerts', path: ROUTES.ALERTS },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-[#E0E0E0] flex justify-between items-center z-50 px-6">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path || 
                        (item.path === ROUTES.TRIPS.HOME && location.pathname === ROUTES.TRIPS.PLANNING) ||
                        (item.path === ROUTES.ALERTS && location.pathname.startsWith('/trips/autopilot/'));
        return (
          <motion.button
            key={index}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(item.path)}
            className={`relative flex flex-col items-center justify-center w-14 h-14 transition-colors ${isActive ? 'text-primary' : 'text-[#A0A0A0]'}`}
          >
            <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-[#F0F0F0]' : 'bg-transparent'}`}>
                <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} fill={isActive && index === 0 ? "currentColor" : "none"} />
            </div>
            {isActive && index !== 0 && (
              <motion.div
                layoutId="nav-glow"
                className="absolute -bottom-1 w-1.5 h-1.5 bg-primary rounded-full"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
