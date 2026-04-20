import { useNavigate, useParams } from 'react-router-dom';
import { DepthLayout } from '../../../components/common/DepthLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { ROUTES } from '../../../constants';
import { Briefcase, Calendar, DollarSign, MapPin, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function AutoPilotAlert() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <DepthLayout
      title="AutoPilot Trip Alert"
      showBack
      headerContent={
        <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
           <Zap size={14} className="text-yellow-400" />
           <span>System Generated Trip</span>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Hero Card (Screen 1.011) */}
        <div className="bg-gradient-to-r from-[#3A7BD5] to-[#2E66B1] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap size={120} />
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <Zap size={32} />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-xl font-black">AutoPilot Trip Alert</h2>
                    <p className="text-xs text-white/60 font-medium">Mon, Mar 2, 2026</p>
                </div>
            </div>
        </div>

        {/* Details Card */}
        <Card className="shadow-xl">
            <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-50">
                    <div className="p-2 bg-primary/5 rounded-xl text-primary">
                        <Briefcase size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Purpose</span>
                        <span className="text-sm font-black text-gray-800">Annual Business Summit</span>
                    </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-gray-50">
                    <div className="p-2 bg-success/5 rounded-xl text-success">
                        <DollarSign size={20} />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Budget</span>
                        <span className="text-sm font-black text-success">$2,500</span>
                    </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-gray-50 text-left">
                    <div className="p-2 bg-accent/5 rounded-xl text-accent">
                        <Calendar size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meeting Schedule</span>
                        <p className="text-xs font-bold text-gray-700 leading-relaxed">
                            First Meeting: 4 PM – 6 PM, Mon, Jun 1, 2026<br />
                            Last Meeting: 2 PM – 4 PM, Fri, Jun 5, 2026
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                    <div className="p-2 bg-gray-100 rounded-xl text-gray-500">
                        <MapPin size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meeting Location</span>
                        <span className="text-sm font-black text-gray-800">200 Hertz Ave, New York, NY</span>
                    </div>
                </div>
            </div>
        </Card>

        {/* Flight Summary Card */}
        <Card className="bg-gray-50 border-gray-100 shadow-sm text-left">
            <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                    <span className="text-2xl font-black text-gray-800 leading-tight">SFO</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">San Francisco, CA</span>
                </div>
                <div className="flex flex-col items-center gap-1 mt-2">
                    <div className="flex gap-2 text-accent">
                        <Zap size={14} className="fill-current" />
                        <Zap size={14} className="fill-current" />
                    </div>
                    <div className="w-16 h-[2.5px] bg-[#C6D9F1] rounded-full" />
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-2xl font-black text-gray-800 leading-tight">NYC</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">New York, NY</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Depart Date</span>
                        <span className="text-xs font-black text-gray-700">Mon, Jun 1, 2026 (5:00 AM - 10:00 AM)</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Return Date</span>
                        <span className="text-xs font-black text-gray-700">Fri, Jun 5, 2026 (8:00 PM - 12:00 AM)</span>
                    </div>
                </div>
                <div className="mt-2 py-2 border-t border-gray-200 inline-flex items-center gap-2 text-xs font-black text-[#3A7BD5] uppercase tracking-tighter">
                    <Calendar size={14} />
                    <span>Trip Duration: 5 Days</span>
                </div>
            </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4 mb-10">
            <Button
                variant="solid"
                className="w-full !py-4 !bg-[#D84315] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20"
                onClick={() => navigate(ROUTES.AUTOPILOT.FLIGHT(id || 'ap-123'))}
            >
                View Flights
                <ChevronRight size={16} />
            </Button>
            <Button
                variant="outline"
                className="w-full !py-4 border-gray-200 text-gray-400 font-black uppercase text-xs tracking-widest"
                onClick={() => navigate(ROUTES.COPILOT.FLIGHT(id || 'ap-123'))}
            >
                Edit Trip
            </Button>
        </div>
      </div>
    </DepthLayout>
  );
}
