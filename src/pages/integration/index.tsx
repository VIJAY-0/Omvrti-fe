import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DepthLayout } from '../../components/common/DepthLayout';
import { IntegrationItem } from '../../components/integration/IntegrationItem';
import { ROUTES } from '../../constants';
import { Calendar, Apple, Mail } from 'lucide-react';
import { integrationApi, Integration } from '../../api';

export default function IntegrationHome() {
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    integrationApi.getIntegrations().then(res => {
      setIntegrations(res);
      setLoading(false);
    });
  }, []);

  const getIcon = (provider: string) => {
    if (provider.includes('Google')) return <Calendar size={24} className="text-red-500" />;
    if (provider.includes('Apple')) return <Apple size={24} className="text-gray-900" />;
    if (provider.includes('Outlook')) return <Calendar size={24} className="text-blue-600" />;
    return <Calendar size={24} className="text-blue-400" />;
  };

  return (
    <DepthLayout
      title="App Integration"
      headerContent={
        <div className="mt-2 text-white/70 text-sm font-medium">
          Connect your favorite apps to sync data
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Layer 03: Integration List */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 mt-2">
          <div className="flex flex-col gap-2">
            {loading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl" />)
            ) : (
                integrations.map((item, idx) => (
                    <div 
                        key={idx} 
                        className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                            if (item.provider === 'Google Calendar') {
                                navigate(item.status === 'Connected' ? ROUTES.INTEGRATION.SETTINGS : ROUTES.INTEGRATION.LOGIN);
                            }
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                {getIcon(item.provider)}
                            </div>
                            <span className="text-sm font-black text-gray-800">{item.provider}</span>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                            item.status === 'Connected' 
                            ? 'bg-[#4CAF50] text-white' 
                            : 'bg-[#3A7BD5] text-white'
                        }`}>
                            {item.status === 'Connected' ? 'Connected' : 'Connect'}
                        </span>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </DepthLayout>
  );
}
