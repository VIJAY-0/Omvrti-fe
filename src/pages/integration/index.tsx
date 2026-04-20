import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { DepthLayout } from '../../components/common/DepthLayout';
import { ROUTES } from '../../constants';
import { Calendar, Apple, Mail, Loader2, Link2, Unlink, Check } from 'lucide-react';
import { integrationApi } from '../../api';
import { calendarSyncApi } from '../../services/calendarSyncService';

interface Connection {
  id: number;
  vendorName: string;
  syncEmail: string;
  displayName: string;
  isConnected: boolean;
  isTokenExpired: boolean;
}

export default function IntegrationHome() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    try {
      console.log('[IntegrationHome] REFRESHING CONNECTIONS...');
      setLoading(true);
      const data = await calendarSyncApi.getSyncConnections();
      console.log('[IntegrationHome] CONNECTIONS REFRESHED:', data);
      setConnections(data);
    } catch (err) {
      console.error('[IntegrationHome] FAILED TO FETCH CONNECTIONS:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();

    // Listen for auth completion
    const messageListener = (event: MessageEvent) => {
      console.log('[IntegrationHome] RECEIVED CROSS-WINDOW MESSAGE:', event);
      if (event.data.type === 'OAUTH_AUTH_SUCCESS') {
        console.log('[IntegrationHome] OAUTH SUCCESS MESSAGE RECEIVED. REFRESHING DATA...');
        fetchConnections();
      }
    };

    window.addEventListener('message', messageListener);
    return () => {
      console.log('[IntegrationHome] CLEANING UP MESSAGE LISTENER');
      window.removeEventListener('message', messageListener);
    };
  }, [fetchConnections]);

  const handleConnect = async (provider: string) => {
    try {
      console.log(`[IntegrationHome] INITIATING CONNECT FOR ${provider.toUpperCase()}...`);
      const url = await calendarSyncApi.getAuthUrl(provider);
      console.log(`[IntegrationHome] OPENING AUTH POPUP FOR ${provider}:`, url);
      const popup = window.open(url, 'auth', 'width=500,height=600');
      
      if (!popup) {
        console.warn('[IntegrationHome] POPUP BLOCKED. PLEASE ALLOW POPUPS.');
        alert('Popup blocked. Please allow popups to connect your calendar.');
      }
    } catch (err) {
      console.error(`[IntegrationHome] FAILED TO START AUTH FOR ${provider}:`, err);
      alert('Failed to initiate auth: ' + (err as Error).message);
    }
  };

  const handleDisconnect = async (id: number) => {
    console.log(`[IntegrationHome] REQUESTING DISCONNECT FOR ID: ${id}`);
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      try {
        console.log(`[IntegrationHome] EXECUTING DISCONNECT FOR ID: ${id}...`);
        await calendarSyncApi.disconnectVendor(id);
        console.log(`[IntegrationHome] DISCONNECT SUCCESSFUL FOR ID: ${id}. REFRESHING...`);
        fetchConnections();
      } catch (err) {
        console.error(`[IntegrationHome] FAILED TO DISCONNECT ID: ${id}:`, err);
        alert('Failed to disconnect: ' + (err as Error).message);
      }
    }
  };

  const getIcon = (vendor: string) => {
    const v = vendor.toLowerCase();
    if (v.includes('google')) return <Calendar size={24} className="text-red-500" />;
    if (v.includes('apple')) return <Apple size={24} className="text-gray-900" />;
    if (v.includes('microsoft') || v.includes('outlook')) return <Calendar size={24} className="text-blue-600" />;
    return <Calendar size={24} className="text-blue-400" />;
  };

  const providers = [
    { name: 'Google', id: 'google' },
    { name: 'Microsoft', id: 'microsoft' },
    { name: 'Apple', id: 'apple' }
  ];

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
        {/* Connection List */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 mt-2">
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Your Connections</h3>
            
            <div className="flex flex-col gap-2">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-2xl" />)
              ) : connections.length > 0 ? (
                connections.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex flex-col gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          {getIcon(item.vendorName)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-800">{item.displayName || (item.vendorName + ' Calendar')}</span>
                          <span className="text-[10px] font-bold text-gray-400">{item.syncEmail}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDisconnect(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Disconnect"
                        >
                          <Unlink size={18} />
                        </button>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                          item.isTokenExpired ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {item.isTokenExpired ? 'Expired' : 'Live'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-gray-300 gap-2">
                  <Link2 size={32} strokeWidth={1} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">No accounts connected</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Available Providers</h3>
            <div className="grid grid-cols-1 gap-3">
              {providers.map((p) => {
                const isConnected = connections.some(c => c.vendorName.toLowerCase() === p.id);
                return (
                  <button
                    key={p.id}
                    disabled={isConnected || p.id === 'apple'}
                    onClick={() => handleConnect(p.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      isConnected 
                        ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed' 
                        : 'bg-white border-gray-100 hover:border-primary/30 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {getIcon(p.id)}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-black text-gray-800">{p.name} Calendar</span>
                        {p.id === 'apple' && <span className="text-[8px] font-bold text-primary uppercase">Coming Soon</span>}
                      </div>
                    </div>
                    {!isConnected && p.id !== 'apple' && (
                      <span className="text-[10px] font-black text-primary uppercase tracking-tight">Connect</span>
                    )}
                    {isConnected && (
                      <Check size={18} className="text-green-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DepthLayout>
  );
}
