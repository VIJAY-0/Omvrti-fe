import { useNavigate } from 'react-router-dom';
import { DepthLayout } from '../../components/common/DepthLayout';
import { Card } from '../../components/common/Card';
import { ROUTES } from '../../constants';
import { Bell, Briefcase, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function AlertsPage() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 'ap-123',
      type: 'autopilot',
      title: 'AutoPilot Trip Alert',
      message: 'New business trip detected for Annual Business Summit.',
      time: '2 mins ago',
      isNew: true
    },
    {
      id: '2',
      type: 'general',
      title: 'Reward Earned',
      message: 'You earned $10 rewards from your last trip.',
      time: '2 hours ago',
      isNew: false
    },
    {
      id: '3',
      type: 'general',
      title: 'Flight Delayed',
      message: 'Your flight UA 456 is delayed by 30 mins.',
      time: '1 day ago',
      isNew: false
    }
  ];

  return (
    <DepthLayout 
      title="Notifications"
      headerContent={
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Stay Updated</p>
      }
    >
      <div className="flex flex-col gap-4">
        {notifications.map((notif, idx) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${notif.isNew ? 'border-primary/20 bg-primary/5' : 'border-gray-100'}`}
              onClick={() => {
                if (notif.type === 'autopilot') {
                  navigate(ROUTES.AUTOPILOT.ALERT(notif.id));
                }
              }}
            >
              <div className="flex gap-4">
                <div className={`p-3 rounded-2xl h-fit ${notif.type === 'autopilot' ? 'bg-[#3A7BD5] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {notif.type === 'autopilot' ? <Zap size={20} /> : <Bell size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-black text-sm ${notif.isNew ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-bold uppercase whitespace-nowrap">{notif.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mb-3">
                    {notif.message}
                  </p>
                  {notif.type === 'autopilot' && (
                    <div className="flex items-center gap-1 font-black text-[#3A7BD5] text-[10px] uppercase tracking-widest">
                      <span>View Details</span>
                      <ChevronRight size={12} />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </DepthLayout>
  );
}
