import { useNavigate } from 'react-router-dom';
import { DepthLayout } from '../../components/common/DepthLayout';
import { InputField } from '../../components/common/InputField';
import { Button } from '../../components/common/Button';
import { Mail, Lock, Eye, Check } from 'lucide-react';
import { ROUTES } from '../../constants';

export default function GoogleLogin() {
  const navigate = useNavigate();

  return (
    <DepthLayout title="Sync Google Calendar" showBack>
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 mt-2">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <InputField
                    label="Email ID"
                    placeholder="Enter your Email"
                    icon={Mail}
                  />
                  <InputField
                    label="Password"
                    placeholder="Enter your Password"
                    type="password"
                    icon={Lock}
                    rightIcon={<Eye size={20} className="text-gray-400" />}
                  />
                </div>

                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4">Authorize Access to Your Calendar :</h4>
                  <ul className="flex flex-col gap-3">
                    {['Read Calendar Events', 'View Scheduling Info', 'Check Availability Status'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <div className="bg-[#4CAF50] p-0.5 rounded-full text-white">
                          <Check size={12} strokeWidth={4} />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                   <Button
                     variant="solid"
                     className="w-full !py-4 !bg-[#D84315] font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20"
                     onClick={() => navigate(ROUTES.INTEGRATION.SUCCESS)}
                   >
                     Sign In
                   </Button>
                   <Button
                     variant="outline"
                     className="w-full !py-4 border-gray-200 text-gray-400 font-black uppercase text-xs tracking-widest"
                     onClick={() => navigate(-1)}
                   >
                     Cancel
                   </Button>
                </div>
            </div>
        </div>
      </div>
    </DepthLayout>
  );
}
