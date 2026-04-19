import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DepthLayout } from '../../components/common/DepthLayout';
import { ROUTES } from '../../constants';
import { Button } from '../../components/common/Button';
import { tripsApi, Trip } from '../../api';

export default function TripAutopilot() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsApi.getTrips().then(res => {
      setTrips(res.filter(t => t.category === 'Autopilot'));
      setLoading(false);
    });
  }, []);

  return (
    <DepthLayout
      title="Autopilot Trips"
      showBack
      headerContent={
        <div className="mt-2 text-white/70 text-sm font-medium">
          Manage your almost certain trips
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Progress Header (Layer 03 component) */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 mt-2">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-black text-gray-800">Accepted : 5 out of 20</span>
                <span className="text-xs font-bold text-gray-400">25% Done</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-8">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '25%' }}
                    className="h-full bg-[#8BC34A]" 
                />
            </div>

            <div className="bg-[#4CAF50] rounded-2xl p-4 flex justify-between items-center mb-6 shadow-md shadow-green-500/20">
                <span className="text-white font-black text-sm">Accept All Trips</span>
                <Button 
                    variant="solid" 
                    className="!py-1.5 !px-4 !text-[10px] !bg-white !text-[#4CAF50] !rounded-lg font-black uppercase shadow-sm"
                    onClick={() => {}}
                >
                    Fast Track
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Trip List</h3>
                
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-2xl" />)
                ) : (
                    <div className="flex flex-col gap-3">
                        {/* Example from spec: Annual Business Summit (Accepted) */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-800">Annual Business Summit</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">1 Jun - 5 Jun 2026</span>
                            </div>
                            <span className="bg-[#4CAF50] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Accepted</span>
                        </div>

                        {/* Example from spec: Tech Leadership (Action required) */}
                        <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-gray-800">Tech Leadership Conference</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">15 Jul - 18 Jul 2026</span>
                                </div>
                                <span className="text-accent font-black text-[10px] uppercase">Action Req.</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 !py-2 !text-xs border-gray-200">Edit</Button>
                                <Button 
                                    variant="solid" 
                                    color="accent" 
                                    className="flex-1 !py-2 !text-xs !bg-[#D84315]"
                                    onClick={() => navigate(ROUTES.TRIPS.CONFIRMED)}
                                >
                                    Accept
                                </Button>
                            </div>
                        </div>

                        {/* Example from spec: Marketing Strategy (Action required) */}
                        <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-gray-800">Marketing Strategy Workshop</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">22 Aug - 25 Aug 2026</span>
                                </div>
                                <span className="text-accent font-black text-[10px] uppercase">Action Req.</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 !py-2 !text-xs border-gray-200">Edit</Button>
                                <Button 
                                    variant="solid" 
                                    color="accent" 
                                    className="flex-1 !py-2 !text-xs !bg-[#D84315]"
                                    onClick={() => navigate(ROUTES.TRIPS.DETAILS('marketing-workshop'))}
                                >
                                    Accept
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </DepthLayout>
  );
}
