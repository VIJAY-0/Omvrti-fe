import React from 'react';
import { Card } from '../common/Card';
import { Car, ShieldCheck, Zap, Star, ChevronRight } from 'lucide-react';

interface CarCardProps {
  car: {
    id?: number | string;
    provider: string;
    logo?: string;
    model: string;
    image: string;
    specs: string[];
    rating: string;
    status: string;
    price: string;
    priceLabel?: string;
    rewards?: string;
    rewards_penalty?: string;
    is_autopilot?: boolean;
  };
  variant?: 'hero' | 'selection';
  onClick?: () => void;
  specIcons?: React.ReactNode[];
}

export const CarCard: React.FC<CarCardProps> = ({ car, variant = 'hero', onClick, specIcons }) => {
  if (variant === 'selection') {
    return (
      <Card
        className={`p-0 overflow-hidden cursor-pointer transition-all hover:shadow-xl ${car.is_autopilot ? 'border-primary/20 bg-primary/5' : 'border-gray-100'}`}
        onClick={onClick}
      >
        <div className="p-4 border-b border-gray-50 flex justify-between items-center text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 p-1 flex items-center justify-center overflow-hidden">
              <img src={car.logo} alt={car.provider} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-gray-800">{car.provider}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{car.model}</span>
            </div>
          </div>
          {car.is_autopilot && (
            <div className="bg-primary/10 text-primary text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-tight flex items-center gap-1">
              <Zap size={10} fill="currentColor" />
              <span>Best Value</span>
            </div>
          )}
        </div>

        <div className="flex h-36 border-b border-gray-50 text-left">
          <div className="w-2/5 p-4 flex items-center justify-center bg-gray-50/50">
            <img src={car.image} alt={car.model} className="w-full h-auto object-contain drop-shadow-lg" referrerPolicy="no-referrer" />
          </div>
          <div className="w-3/5 p-4 flex flex-col justify-center gap-1.5">
            {car.specs && car.specs.slice(0, 3).map((spec, sIdx) => (
              <div key={sIdx} className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{spec}</span>
              </div>
            ))}
            <div className="mt-2 flex items-center gap-1 text-[9px] font-black text-[#FFB300] uppercase">
              <Star size={10} className="fill-current" />
              <span>{car.rating}</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex justify-between items-center text-left">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-gray-800">{car.price}</span>
              {car.priceLabel && <span className="text-[9px] font-bold text-gray-400 uppercase">{car.priceLabel}</span>}
            </div>
            <span className={`text-[10px] font-black uppercase mt-0.5 ${car.rewards ? 'text-primary' : 'text-[#D84315]'}`}>
              {car.rewards || car.rewards_penalty}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {car.status === "In Policy" ? (
              <div className="flex items-center gap-1 text-[#4CAF50] font-black text-[10px] uppercase tracking-widest">
                <ShieldCheck size={14} />
                <span>In Policy</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[#D84315] font-black text-[10px] uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D84315]" />
                <span>Out Policy</span>
              </div>
            )}
            <div className="p-2 bg-gray-100 rounded-xl text-gray-400">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Hero variant (Default)
  return (
    <div className="bg-white rounded-[40px] p-0 shadow-2xl border border-gray-100 mt-2 overflow-hidden text-left">
      <div className="p-6 border-b border-gray-50 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Car size={20} />
        </div>
        <h3 className="text-lg font-black text-gray-800">Car Rental</h3>
      </div>

      <div className="p-0">
        <div className="h-48 w-full bg-gray-50 flex items-center justify-center relative p-8">
          <img
            src={car.image}
            alt={car.model}
            className="w-full h-auto object-contain drop-shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <div className="bg-[#4CAF50] text-white text-[10px] font-black px-2 py-1 rounded-md uppercase flex items-center gap-1 shadow-lg">
              <ShieldCheck size={12} />
              <span>In Policy</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-black text-gray-800 leading-tight mb-1">{car.provider}</h4>
              <span className="text-xl font-black text-[#3A7BD5]">{car.provider}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-tighter">
              <span>{car.model}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            {car.specs.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                {/* Fallback to generic icon if specIcons not provided */}
                <span className="text-gray-300">
                  {/* Since specIcons is hard to map correctly, we'll keep the icons fixed in the page or handle them here */}
                  <div className="w-4 h-4 rounded-full border-2 border-current opacity-20" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-800">{car.price} <span className="text-[10px] text-gray-400 uppercase font-bold">/ day</span></span>
              <span className="text-[10px] font-black text-primary uppercase mt-1">{car.rewards}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
