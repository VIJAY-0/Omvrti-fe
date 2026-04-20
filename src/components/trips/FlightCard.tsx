import React from 'react';
import { Card } from '../common/Card';
import { Zap, ShieldCheck, Leaf, ChevronRight, Plane } from 'lucide-react';

interface FlightCardProps {
  flight: {
    type?: string;
    date?: string;
    times: string;
    carrier: string;
    details: string;
    tags?: string[];
    status?: string;
    price?: string;
    subtitle?: string;
    rewards?: string;
    rewards_penalty?: string;
    is_autopilot_recommendation?: boolean;
    emissions_tag?: string;
  };
  variant?: 'summary' | 'selection';
  onClick?: () => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, variant = 'summary', onClick }) => {
  if (variant === 'selection') {
    return (
      <Card
        className={`relative overflow-hidden cursor-pointer transition-all hover:shadow-xl ${flight.is_autopilot_recommendation ? 'border-primary/30 bg-primary/5' : 'border-gray-100'}`}
        onClick={onClick}
      >
        {flight.is_autopilot_recommendation && (
          <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1">
            <Zap size={10} fill="currentColor" />
            <span>Recommended</span>
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-black text-gray-800 text-left">{flight.carrier}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase text-left">{flight.details}</span>
            </div>
            {flight.status === "In Policy" ? (
              <div className="flex items-center gap-1 text-[#4CAF50] font-black text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={14} />
                  <span>In Policy</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[#D84315] font-black text-[10px] uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D84315]" />
                  <span>Out of Policy</span>
              </div>
            )}
          </div>

          <div className="py-4 border-y border-gray-50 text-left">
             <h4 className="text-lg font-black text-gray-800">{flight.times}</h4>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex flex-col text-left">
              <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-gray-800">{flight.price}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{flight.subtitle}</span>
              </div>
              {flight.rewards ? (
                <span className="text-[10px] font-black text-primary uppercase mt-1">{flight.rewards}</span>
              ) : (
                <span className="text-[10px] font-black text-[#D84315] uppercase mt-1">{flight.rewards_penalty}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {flight.emissions_tag && (
                  <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                      <Leaf size={12} />
                      <span>{flight.emissions_tag}</span>
                  </div>
              )}
              <div className={`p-2 rounded-xl ${flight.is_autopilot_recommendation ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <ChevronRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Summary variant (Default)
  return (
    <div className={`flex flex-col gap-3`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{flight.type}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase">{flight.date}</span>
      </div>
      <div className="flex flex-col gap-1 text-left">
        <h4 className="text-base font-black text-gray-800">{flight.times}</h4>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <span>{flight.carrier}</span>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{flight.details}</span>
        </div>
      </div>
      {flight.tags && flight.tags.length > 0 && (
        <div className="flex gap-2">
          <div className="inline-flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md text-[10px] font-black text-[#4CAF50] uppercase tracking-tighter">
            <Leaf size={12} />
            <span>{flight.tags[0]}</span>
          </div>
        </div>
      )}
    </div>
  );
};
