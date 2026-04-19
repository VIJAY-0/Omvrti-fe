import { useNavigate } from 'react-router-dom';
import { DepthLayout } from '../../components/common/DepthLayout';
import { CheckCircle, ExternalLink, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../constants';
import { motion } from 'motion/react';

export default function IntegrationSuccess() {
  const navigate = useNavigate();

  return (
    <DepthLayout title="Sync Success">
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 mt-2 flex flex-col items-center text-center">
            <motion.div
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="bg-[#4CAF50] text-white p-4 rounded-full mb-6 shadow-lg shadow-green-500/20"
            >
              <CheckCircle size={48} strokeWidth={2.5} />
            </motion.div>

            <h2 className="text-xl font-black text-gray-800 mb-1">Calendar Connected!</h2>
            <div className="bg-gray-50 px-4 py-2 rounded-xl mb-12 border border-gray-100 flex items-center gap-2">
               <span className="text-sm font-bold text-gray-600">samwatson@gmail.com</span>
               <span className="px-2 py-0.5 bg-[#4CAF50] text-white text-[9px] font-black uppercase rounded-md tracking-widest">Connected</span>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Button
                variant="solid"
                className="w-full !py-4 !bg-[#D84315] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20"
                onClick={() => navigate(ROUTES.INTEGRATION.SETTINGS)}
              >
                Manage Sync
              </Button>
              
              <Button
                variant="outline"
                className="w-full !py-4 border-gray-200 text-gray-500 font-black uppercase text-xs tracking-widest"
                onClick={() => {}}
              >
                Go To Calendar
              </Button>

              <Button
                variant="outline"
                className="w-full !py-4 border-gray-100 text-gray-300 font-black uppercase text-xs tracking-widest mt-4"
                onClick={() => navigate(ROUTES.INTEGRATION.HOME)}
              >
                Disconnect
              </Button>
            </div>
        </div>
      </div>
    </DepthLayout>
  );
}
