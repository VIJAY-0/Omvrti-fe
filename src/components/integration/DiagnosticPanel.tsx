import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DiagnosticPanelProps {
  error: string;
  baseUrl: string;
  onRetry: () => void;
}

/**
 * A highly visible trouble-shooting component triggered on network failures.
 */
export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({ error, baseUrl, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-100 rounded-[24px] p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-red-100 rounded-lg text-red-600">
          <AlertCircle size={20} />
        </div>
        <div className="flex-1 flex flex-col gap-2 text-left">
          <h4 className="text-sm font-black text-red-900">Connectivity Issue</h4>
          <p className="text-xs text-red-700 font-medium leading-relaxed">
            {error}
          </p>
          <div className="flex flex-col gap-1.5 mt-2 p-3 bg-white/50 rounded-xl border border-red-50 underline-offset-4">
            <span className="text-[10px] font-black text-red-900 uppercase tracking-tighter">Diagnostic Data:</span>
            <ul className="text-[10px] text-red-700 font-bold list-disc pl-4 flex flex-col gap-1">
              <li>Target URL: <code className="bg-red-100 px-1 rounded">{baseUrl}</code></li>
              <li>Local Backend: Requires port 8080 and active CORS policy.</li>
              <li>Cloud Runtime: Use an ngrok tunnel for local host resolution.</li>
            </ul>
          </div>
          <button 
            onClick={onRetry}
            className="mt-2 text-[10px] font-black text-red-800 uppercase underline tracking-widest text-left"
          >
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
};
