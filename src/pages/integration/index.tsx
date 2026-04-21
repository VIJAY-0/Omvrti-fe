import { useEffect } from 'react';
import { DepthLayout } from '../../components/common/DepthLayout';
import { useCalendarSync } from '../../hooks/useCalendarSync';

// Sub-components for better hierarchy and readability
import { IntegrationHeader } from '../../components/integration/IntegrationHeader';
import { DiagnosticPanel } from '../../components/integration/DiagnosticPanel';
import { ConnectionItem } from '../../components/integration/ConnectionItem';
import { VendorItem } from '../../components/integration/VendorItem';

/**
 * IntegrationHome Page Component
 * 
 * This component serves as the central hub for managing third-party calendar integrations.
 * It provides a modular interface to:
 * 1. View all available calendar vendors (Google, Outlook, etc.)
 * 2. Manage active synchronization connections.
 * 3. Troubleshoot connectivity issues with the high-depth diagnostic panel.
 * 
 * Refactored into a modular architecture for improved maintainability.
 */
export default function IntegrationHome() {
  // Leverage the centralized useCalendarSync hook for all data and API operations
  const { 
    vendors, 
    connections, 
    loading, 
    error, 
    refreshAll, 
    api 
  } = useCalendarSync();

  /**
   * OAuth Lifecycle Management
   * Listens for successful authentication messages from the provider popup.
   */
  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      // Security Check: You should ideally verify event.origin here if known
      console.log('[IntegrationHome] RECEIVED CROSS-WINDOW MESSAGE:', event);
      if (event.data.type === 'OAUTH_AUTH_SUCCESS') {
        console.log('[IntegrationHome] OAUTH SUCCESS. REFRESHING SYNC DATA...');
        refreshAll();
      }
    };

    window.addEventListener('message', handleAuthMessage);
    
    // Cleanup listener on component unmount
    return () => {
      console.log('[IntegrationHome] TEARING DOWN MESSAGE LISTENER');
      window.removeEventListener('message', handleAuthMessage);
    };
  }, [refreshAll]);

  /**
   * handleConnect
   * Triggers the OAuth flow by fetching the provider-specific URL and opening it in a popup.
   * 
   * @param provider - The name of the calendar provider (e.g., 'google')
   */
  const handleConnect = async (provider: string) => {
    try {
      console.log(`[IntegrationHome] INITIATING SECURE CONNECT FOR: ${provider.toUpperCase()}`);
      const authUrl = await api.getAuthUrl(provider);
      
      console.log(`[IntegrationHome] OPENING AUTH POPUP: ${authUrl}`);
      const popup = window.open(authUrl, 'auth_popup', 'width=500,height=600,status=no,toolbar=no');
      
      if (!popup) {
        console.error('[IntegrationHome] POPUP BLOCKED BY BROWSER SETTINGS');
        alert('Please allow popups to connect your calendar account.');
      }
    } catch (err) {
      console.error(`[IntegrationHome] FAILED TO GENERATE AUTH URL FOR ${provider}:`, err);
      alert('Authentication error: ' + (err as Error).message);
    }
  };

  /**
   * handleDisconnect
   * Requests the backend to terminate a specific sync connection.
   * 
   * @param connectionId - The unique ID of the sync connection to remove
   */
  const handleDisconnect = async (connectionId: number) => {
    console.log(`[IntegrationHome] REQUESTING TERMINATION FOR CONNECTION ID: ${connectionId}`);
    
    const confirmed = window.confirm('Are you sure you want to disconnect this account? Synchronization will stop immediately.');
    
    if (confirmed) {
      try {
        setLoadingStateManually(true); // Internal hook loading state doesn't track manual deletes as cleanly
        await api.disconnectVendor(connectionId);
        console.log(`[IntegrationHome] CONNECTION ${connectionId} SUCCESSFULLY TERMINATED.`);
        await refreshAll();
      } catch (err) {
        console.error(`[IntegrationHome] DISCONNECT FAILED FOR ID ${connectionId}:`, err);
        alert('Disconnection failed: ' + (err as Error).message);
      }
    }
  };

  // Helper to force loading state if needed during manual operations
  // Note: ideally the hook should expose a setLoading method
  const setLoadingStateManually = (val: boolean) => {
    // This is just a conceptual placeholder since the hook handles its own loading usually
  };

  return (
    <DepthLayout
      title="Integrations"
      showBack
      headerContent={<IntegrationHeader loading={loading} />}
    >
      <div className="flex flex-col gap-6 py-2">
        
        {/* RENDER PHASE: Diagnostic Panel
            Only appears if there is a persistent error communicating with the backend.
        */}
        {error && (
          <DiagnosticPanel 
            error={error} 
            baseUrl={(api as any).baseUrl} 
            onRetry={refreshAll} 
          />
        )}

        {/* RENDER PHASE: Active Account Management
            Displays connected identities. Hidden if no connections exist.
        */}
        {connections.length > 0 && (
          <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 overflow-hidden">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col text-left border-b border-gray-50 pb-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Linked Identities</h3>
                <p className="text-[10px] font-bold text-gray-400">Currently active synchronization feeds</p>
              </div>
              
              <div className="flex flex-col gap-3">
                {connections.map((conn) => (
                  <ConnectionItem 
                    key={conn.id} 
                    connection={conn} 
                    onDisconnect={handleDisconnect} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RENDER PHASE: Provider Marketplace
            Lists all available vendors dynamically fetched from the API.
        */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 mb-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col text-left border-b border-gray-50 pb-4">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Provider Network</h3>
              <p className="text-[10px] font-bold text-gray-400">Expand your ecosystem by connecting new utilities</p>
            </div>

            <div className="flex flex-col gap-4">
              {vendors.length > 0 ? (
                vendors.map((vendor) => {
                  // Logic to check if the user already has any connection for this vendor type
                  const isAlreadyConnected = connections.some(c => 
                    c.vendorName.toLowerCase().includes(vendor.name.toLowerCase().split(' ')[0])
                  );
                  
                  return (
                    <VendorItem 
                      key={vendor.id} 
                      vendor={vendor} 
                      isConnected={isAlreadyConnected} 
                      onConnect={handleConnect} 
                    />
                  );
                })
              ) : (
                /* Dynamic Loading State for Vendors */
                <div className="py-12 flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-gray-100 rounded-full" />
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-primary rounded-full animate-spin" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Indexing Vendors</span>
                    <span className="text-[8px] font-bold text-gray-300 uppercase animate-pulse">Contacting Cluster...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DepthLayout>
  );
}
