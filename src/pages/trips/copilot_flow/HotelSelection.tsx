import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { DepthLayout } from '../../../components/common/DepthLayout';
import { Button } from '../../../components/common/Button';
import { ROUTES } from '../../../constants';
import { ChevronRight, MapPin, Calendar, ShieldCheck, X, Star, Car, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HotelCard } from '../../../components/trips/HotelCard';

export default function CoPilotHotelSelection() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  const hotels = [
    {
      id: 1,
      name: "Residence Inn Marriott New York Downtown",
      image: "https://picsum.photos/seed/hotel1/400/300",
      address: "150 Delancey St, New York, NY 10002",
      status: "In Policy",
      price: "$1,100",
      priceLabel: "Price for 4 nights",
      rewards: "+$30 OmVrti Rewards",
      is_autopilot: true,
      rating: 4
    },
    {
      id: 2,
      name: "Holiday Inn NYC - Lower East Side",
      image: "https://picsum.photos/seed/hotel2/400/300",
      address: "150 Delancey St, New York, NY 10002",
      status: "Out of Policy",
      price: "$1,450",
      priceLabel: "Price for 4 nights",
      rewards_penalty: "-$275 OmVrti Rewards",
      rating: 3
    }
  ];

  const handleSelect = (hotel: any) => {
    setSelectedHotel(hotel);
  };

  const handleConfirm = () => {
    // Navigate back to the next step in AutoPilot flow (Car)
    navigate(ROUTES.AUTOPILOT.CAR(id || 'ap-123'));
  };

  return (
    <DepthLayout
      title="Co-Pilot Booking"
      showBack
      headerContent={
        <div className="mt-1 text-white/70 text-sm font-medium">Stay at New York</div>
      }
    >
      <div className="flex flex-col gap-6 mb-20 text-left">
        {hotels.map((hotel, idx) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <HotelCard hotel={hotel} variant="compact" onClick={() => handleSelect(hotel)} />
          </motion.div>
        ))}
      </div>

      {/* Modal Overlay for Hotel Details */}
      <AnimatePresence>
        {selectedHotel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHotel(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[40px] p-8 shadow-2xl max-h-[85vh] overflow-y-auto text-left"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-800">Hotel Details</h2>
                <button onClick={() => setSelectedHotel(null)} className="p-2 bg-gray-100 rounded-full text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-black text-gray-800 leading-tight">{selectedHotel.name}</h3>
                    <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                        <MapPin size={14} />
                        <span>{selectedHotel.address}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 py-6 border-y border-gray-50">
                    {[
                        { icon: Calendar, text: "Check In: Tue, Jun 1, 2026 • 12 PM" },
                        { icon: Calendar, text: "Check Out: Fri, Jun 5, 2026 • 11 AM" },
                        { icon: Car, text: "Free Parking" },
                        { icon: Coffee, text: "Buffet breakfast included" },
                        { icon: Star, text: "Rated 4-Star" },
                        { icon: MapPin, text: "Distance from Meeting Place: 1.2 miles" }
                    ].map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                            <amenity.icon size={18} className="text-primary/40" />
                            <span>{amenity.text}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-6 rounded-[32px]">
                   <div className="flex flex-col">
                        <span className="text-2xl font-black text-gray-800">{selectedHotel.price}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedHotel.priceLabel}</span>
                   </div>
                   <div className="text-right flex flex-col items-end">
                      <div className="flex items-center gap-1 text-[#4CAF50] font-black text-xs uppercase tracking-widest mb-1">
                        <ShieldCheck size={16} />
                        <span>{selectedHotel.status}</span>
                      </div>
                      <span className="text-xs font-black text-primary uppercase">{selectedHotel.rewards || selectedHotel.rewards_penalty}</span>
                   </div>
                </div>

                <Button 
                  variant="solid" 
                  className="w-full !py-5 !bg-[#D84315] shadow-lg shadow-orange-500/20 text-white font-black uppercase text-sm tracking-widest mt-2"
                  onClick={handleConfirm}
                >
                  Select this Hotel
                  <ChevronRight size={20} />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DepthLayout>
  );
}
