import { useNavigate } from 'react-router-dom';
import { DepthLayout } from '../../components/common/DepthLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../constants';
import { Plane, Calendar, ChevronRight, Briefcase } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <DepthLayout
      title="App Home"
      headerContent={
        <div className="flex flex-col gap-1">
            <h2 className="text-white text-2xl font-black leading-tight">Hello,<br />Sam Watson!</h2>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Featured Trip Card */}
        <Card className="!p-0 overflow-hidden shadow-xl border-none group cursor-pointer" onClick={() => navigate(ROUTES.TRIPS.PLANNING)}>
          <div className="relative h-48 overflow-hidden">
            <img 
              src="https://picsum.photos/seed/nyc-skyline/800/400" 
              alt="New York Skyline" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-5">
               <span className="bg-[#4CAF50] text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">Vibrant Experience</span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Upcoming Trip</span>
              <span className="text-xs font-bold text-[#D84315]">12 days away</span>
            </div>

            <div className="flex justify-between items-center py-4 border-y border-gray-50">
                <div className="flex flex-col">
                    <span className="text-2xl font-black text-gray-800 leading-none">SFO</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">San Francisco</span>
                </div>
                <div className="flex flex-col items-center gap-1 group-hover:px-4 transition-all">
                    <Plane size={24} className="text-[#D84315] -rotate-45" />
                    <div className="w-16 h-[2.5px] bg-[#C6D9F1] rounded-full" />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-gray-800 leading-none">JFK</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">New York</span>
                </div>
            </div>

            <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-1.5 text-gray-500 font-bold text-sm">
                    <Calendar size={16} className="text-[#3A7BD5]" />
                    <span>Jun 1 - Jun 5</span>
                </div>
                <div className="flex items-center gap-1 font-black text-[#3A7BD5] text-xs uppercase tracking-widest">
                    <span>Manage</span>
                    <ChevronRight size={14} />
                </div>
            </div>
          </div>
        </Card>

        {/* Quick Access to Trip Planner */}
        <div className="flex flex-col gap-4 mb-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-lg font-black text-white">Trip Planner</h3>
                <span className="text-xs font-bold text-white/60 cursor-pointer" onClick={() => navigate(ROUTES.TRIPS.PLANNING)}>View Dashboard</span>
            </div>
            <Card className="hover:bg-gray-50 transition-all cursor-pointer border-white/20 frosted-glass" onClick={() => navigate(ROUTES.TRIPS.PLANNING)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl text-white">
                            <Briefcase size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-black text-white">Plan your next adventure</span>
                            <span className="text-xs text-white/60 font-medium tracking-tight">Access your autopilot dashboard</span>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-white/40" />
                </div>
            </Card>
        </div>
      </div>
    </DepthLayout>
  );
}
