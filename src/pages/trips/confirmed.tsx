import { useNavigate } from 'react-router-dom';
import { DepthLayout } from '../../components/common/DepthLayout';
import { CheckCircle, Calendar } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../constants';
import { motion } from 'motion/react';

export default function TripConfirmed() {
  const navigate = useNavigate();

  return (
    <DepthLayout title="Trip Accepted">
      <div className="flex flex-col gap-6">
        {/* Success Confirmation Dialog (Layer 03 Foreground) */}
        <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100 mt-2 flex flex-col items-center text-center">
            <motion.div
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ type: 'spring', damping: 15, stiffness: 300 }}
               className="bg-[#4CAF50] text-white p-6 rounded-full mb-8 shadow-xl shadow-green-500/30"
            >
              <CheckCircle size={64} strokeWidth={2.5} />
            </motion.div>

            <h2 className="text-xl font-black text-gray-800 mb-2">Trip Accepted</h2>
            <p className="text-sm text-gray-400 font-bold max-w-[200px] mb-10 leading-relaxed">
              Your trip has been accepted successfully
            </p>

            {/* Context Card */}
            <div className="w-full bg-gray-50 rounded-3xl p-6 mb-12 text-left border border-[#4CAF50]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-[#4CAF50]">
                 <CheckCircle size={80} />
              </div>
              <h3 className="text-base font-black text-gray-800 mb-2">Annual Business Summit</h3>
              <div className="flex items-center gap-2 text-gray-400 font-black text-[11px] uppercase tracking-tighter">
                <Calendar size={16} />
                <span>1 Jun - 5 Jun 2026</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full">
              <Button
                variant="solid"
                className="w-full !py-4 !bg-[#D84315] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20"
                onClick={() => {}}
              >
                Continue Booking
              </Button>
              <Button
                variant="outline"
                className="w-full !py-4 border-gray-200 text-gray-400 font-black uppercase text-xs tracking-widest"
                onClick={() => navigate(ROUTES.TRIPS.HOME)}
              >
                Back to Trips
              </Button>
            </div>
        </div>
      </div>
    </DepthLayout>
  );
}
