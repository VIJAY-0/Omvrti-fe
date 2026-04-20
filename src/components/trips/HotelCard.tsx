import React from 'react';
import { Card } from '../common/Card';
import { Bed, MapPin, Star, ShieldCheck, ChevronRight, Calendar, Car, Coffee } from 'lucide-react';

interface HotelCardProps {
  hotel: {
    id?: number | string;
    name: string;
    image: string;
    address: string;
    status: string;
    price: string;
    priceLabel?: string;
    rewards?: string;
    rewards_penalty?: string;
    is_autopilot?: boolean;
    rating: number;
  };
  variant?: 'hero' | 'compact';
  onClick?: () => void;
  amenities?: Array<{ icon: any; text: string }>;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, variant = 'hero', onClick, amenities }) => {
  if (variant === 'compact') {
    return (
      <Card
        className={`p-0 overflow-hidden cursor-pointer transition-all hover:shadow-xl ${hotel.is_autopilot ? 'border-primary/20 bg-primary/5' : 'border-gray-100'}`}
        onClick={onClick}
      >
        <div className="flex h-32">
          <div className="w-1/3 h-full overflow-hidden">
            <img src={hotel.image} className="w-full h-full object-cover" alt={hotel.name} referrerPolicy="no-referrer" />
          </div>
          <div className="w-2/3 p-4 flex flex-col justify-between text-left">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-xs font-black text-gray-800 line-clamp-2 leading-tight flex-1">{hotel.name}</h4>
                <div className="flex items-center gap-0.5 ml-2">
                  <Star size={10} className="fill-[#FFB300] text-[#FFB300]" />
                  <span className="text-[10px] font-bold text-gray-600">{hotel.rating}</span>
                </div>
              </div>
              <p className="text-[9px] text-gray-400 font-bold truncate uppercase tracking-tighter mb-2">{hotel.address}</p>
              
              <div className="flex items-center gap-2">
                {hotel.status === "In Policy" ? (
                  <div className="inline-flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded text-[8px] font-black text-[#4CAF50] uppercase tracking-widest">
                    <ShieldCheck size={10} />
                    <span>In Policy</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 bg-red-50 px-1.5 py-0.5 rounded text-[8px] font-black text-[#D84315] uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-[#D84315]" />
                    <span>Out of Policy</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-50">
              <div className="flex flex-col">
                <span className="text-sm font-black text-gray-800">{hotel.price}</span>
                <span className="text-[10px] font-black text-primary uppercase leading-none mt-0.5">
                  {hotel.rewards || hotel.rewards_penalty}
                </span>
              </div>
              <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400">
                <ChevronRight size={14} />
              </div>
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
          <Bed size={20} />
        </div>
        <h3 className="text-lg font-black text-gray-800">Stay at New York</h3>
      </div>

      <div className="p-0">
        <div className="h-48 w-full relative">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
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
            <h4 className="text-lg font-black text-gray-800 leading-tight mb-1">{hotel.name}</h4>
            <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-tighter">
              <MapPin size={14} />
              <span>{hotel.address}</span>
            </div>
          </div>

          {amenities && (
            <div className="flex flex-col gap-4 mb-8">
              {amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <item.icon size={16} className="text-gray-300" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-800">{hotel.price} <span className="text-[10px] text-gray-400 uppercase font-bold">/ night</span></span>
              <span className="text-[10px] font-black text-primary uppercase mt-1">+$10 OmVrti Rewards</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(hotel.rating)].map((_, i) => <Star key={i} size={14} className="fill-[#FFB300] text-[#FFB300]" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
