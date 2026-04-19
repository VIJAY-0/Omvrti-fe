import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DepthLayout } from '../../components/common/DepthLayout';
import { ToggleRow } from '../../components/trips/TripDetailRow';
import { Button } from '../../components/common/Button';
import { Save } from 'lucide-react';
import { integrationApi } from '../../api';

export default function IntegrationSettings() {
  const [settings, setSettings] = useState({
    autoSync: true,
    twoWay: true,
    notifications: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    integrationApi.getSyncSettings().then(res => {
      setSettings(res);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await integrationApi.updateSyncSettings(settings);
    setSaving(false);
  };

  if (loading) {
    return (
      <DepthLayout title="Sync Settings" showBack>
        <div className="flex flex-col gap-4 animate-pulse">
           <div className="h-40 bg-gray-50 rounded-2xl" />
           <div className="h-16 bg-gray-50 rounded-xl mt-8" />
        </div>
      </DepthLayout>
    );
  }

  return (
    <DepthLayout title="Sync Settings" showBack>
      <div className="flex flex-col gap-6">
        {/* Settings Configuration Card (Layer 03 Foreground) */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 mt-2">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Sync Configuration</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-800">Auto Sync</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Background update</span>
                      </div>
                      <motion.button
                         onClick={() => setSettings(prev => ({ ...prev, autoSync: !prev.autoSync }))}
                         className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.autoSync ? 'bg-[#4CAF50]' : 'bg-gray-200'}`}
                      >
                         <motion.div
                            animate={{ x: settings.autoSync ? 24 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-sm"
                         />
                      </motion.button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-800">Sync Direction</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Two-way synchronization</span>
                      </div>
                      <motion.button
                         onClick={() => setSettings(prev => ({ ...prev, twoWay: !prev.twoWay }))}
                         className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.twoWay ? 'bg-[#4CAF50]' : 'bg-gray-200'}`}
                      >
                         <motion.div
                            animate={{ x: settings.twoWay ? 24 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-sm"
                         />
                      </motion.button>
                  </div>
                </div>

                <div className="mt-8">
                   <Button
                     variant="solid"
                     className="w-full !rounded-[12px] !py-4 !bg-[#D84315] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20"
                     onClick={handleSave}
                     disabled={saving}
                   >
                     {saving ? 'Saving Changes...' : 'Save Changes'}
                   </Button>
                </div>
            </div>
        </div>
      </div>
    </DepthLayout>
  );
}
