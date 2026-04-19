import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DepthLayout } from '../../components/common/DepthLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { ROUTES } from '../../constants';
import { tripsApi } from '../../api';
import { Plane, Calendar, User, ChevronRight, Mic, Briefcase, Coins } from 'lucide-react';

export default function TripPlanning() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    autopilot: { total: 0, accepted: 0 },
    copilot: { total: 0, accepted: 0 },
    discover: { total: 0, accepted: 0 },
    overall: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsApi.getCategoryStats().then(res => {
      setStats(res);
      setLoading(false);
    });
  }, []);

  return (
    <DepthLayout
      title="Trip Planning"
      headerContent={
        <div className="flex flex-col gap-1">
            <p className="text-white/60 text-xs font-bold leading-tight uppercase tracking-widest">Workspace</p>
            <h2 className="text-white text-sm font-medium opacity-80">Welcome, Sam Watson</h2>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Total Trips Summary Card (Layer 03 Foreground component) */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 mt-2">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Trip Planning Period</span>
                    <button className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                        <span>Current Year 2026</span>
                        <ChevronRight size={14} className="rotate-90" />
                    </button>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Trips</span>
                    <span className="text-2xl font-black text-gray-800">{stats.overall || 42}</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex justify-between items-center cursor-pointer hover:bg-primary/10 transition-all group" onClick={() => navigate(ROUTES.TRIPS.AUTOPILOT)}>
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-primary">Autopilot Trips</span>
                        <span className="text-xs text-primary/60 font-medium">Almost certain trips</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-primary/40 uppercase tracking-tighter">Accepted</span>
                            <span className="text-xl font-black text-primary font-mono">{stats.autopilot.accepted}/20</span>
                        </div>
                        <ChevronRight size={20} className="text-primary/30 group-hover:text-primary transition-colors" />
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center opacity-80">
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-800">Copilot Trips</span>
                        <span className="text-xs text-gray-400 font-medium">Very Likely trips</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-tighter">Accepted</span>
                            <span className="text-xl font-black text-gray-800 font-mono">{stats.copilot.accepted}/15</span>
                        </div>
                        <ChevronRight size={20} className="text-gray-200" />
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center opacity-80">
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-800">Discover Trips</span>
                        <span className="text-xs text-gray-400 font-medium">Adhoc trips</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-tighter">Accepted</span>
                            <span className="text-xl font-black text-gray-800 font-mono">{stats.discover.accepted}/7</span>
                        </div>
                        <ChevronRight size={20} className="text-gray-200" />
                    </div>
                </div>
            </div>
        </div>

        {/* Add a Meeting Section (Kept as extra functionality) */}
        <Card className="mt-2">
            <h3 className="text-lg font-black text-gray-800 mb-4">Add a Meeting</h3>
            <div className="flex flex-col gap-4">
                <InputField 
                    label="" 
                    placeholder="e.g. Plan my business trip to New York" 
                    rightIcon={<Mic size={20} className="text-primary" />}
                />
                <Button variant="solid" color="accent" className="w-full !rounded-xl !py-4 font-black">
                    Start Planning
                </Button>
            </div>
        </Card>
      </div>
    </DepthLayout>
  );
}
