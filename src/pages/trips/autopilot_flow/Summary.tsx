import { useNavigate, useParams } from 'react-router-dom';
import { DepthLayout } from '../../../components/common/DepthLayout';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { ROUTES } from '../../../constants';
import { ChevronRight, Briefcase, Calendar, Bed, Car, PartyPopper, TrendingDown, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function AutoPilotSummary() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <DepthLayout
      title="AutoPilot Summary"
      headerContent={
        <div className="mt-1 text-[#C6D9F1] text-sm font-black uppercase tracking-widest">
           Booking Secured
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Purpose Card */}
        <Card className="mt-2 text-left">
            <div className="flex items-center gap-4">
                <div className="bg-primary/5 p-3 rounded-2xl text-primary">
                    <Briefcase size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Purpose</span>
                    <span className="text-sm font-black text-gray-800">Client Meeting • Smart Client Inc</span>
                </div>
            </div>
        </Card>

        {/* Savings Card */}
        <div className="bg-white rounded-[40px] p-0 shadow-2xl border border-gray-100 overflow-hidden text-left">
             <div className="bg-[#E8F5E9] p-4 flex items-center justify-center gap-3">
                <PartyPopper size={20} className="text-[#2E7D32]" />
                <span className="text-sm font-black text-[#2E7D32]">Congrats! You’ve Earned $75 OmVrti Rewards</span>
             </div>
             
             <div className="p-8">
                <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trip Cost</span>
                        <span className="text-3xl font-black text-gray-800">$1,875</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Budget</span>
                        <span className="text-xl font-black text-gray-300 line-through">$2,500</span>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Direct Savings</span>
                        <span className="text-sm font-black text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">$375 (15%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Overhead Savings</span>
                        <span className="text-sm font-black text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">$250 (10%)</span>
                    </div>
                    <div className="mt-4 pt-6 border-t border-gray-50 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Total Savings</span>
                            <span className="text-2xl font-black text-[#2E7D32]">$625 (25%)</span>
                        </div>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E8F5E9] text-[#2E7D32]">
                            <TrendingDown size={28} />
                        </div>
                    </div>
                </div>
             </div>
        </div>

        {/* Itinerary Card */}
        <Card className="text-left">
            <h3 className="text-sm font-black text-gray-800 mb-6 flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span>Trip Itinerary</span>
            </h3>
            
            <div className="mb-6 flex flex-col gap-1">
                <span className="text-lg font-black text-gray-800">San Francisco to New York</span>
                <span className="text-xs font-bold text-gray-400 uppercase">Mon, Jun 1, 2026 - Fri, Jun 5, 2026 (5 Days)</span>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded-xl text-gray-400">
                        <Bed size={18} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">Residence Inn Marriott, New York Downtown</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded-xl text-gray-400">
                        <Car size={18} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">Hertz – Standard 2/4 Door</span>
                </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-2">
                <div className="bg-[#E8F5E9] text-[#2E7D32] p-1.5 rounded-lg">
                    <ShieldCheck size={16} />
                </div>
                <span className="text-[10px] font-black text-[#2E7D32] uppercase tracking-widest">All bookings are in policy</span>
            </div>
        </Card>

        {/* Final Action */}
        <div className="flex flex-col gap-3 mt-4 mb-20">
            <Button
                variant="solid"
                className="w-full !py-4 !bg-[#3A7BD5] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20"
                onClick={() => navigate(ROUTES.TRIPS.HOME)}
            >
                Back to Dashboard
            </Button>
            <Button
                variant="outline"
                className="w-full !py-4 border-gray-100 text-gray-300 font-bold text-xs uppercase cursor-not-allowed"
                disabled
            >
                Email Itinerary
            </Button>
        </div>
      </div>
    </DepthLayout>
  );
}
