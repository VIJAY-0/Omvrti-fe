import { useNavigate, useParams } from 'react-router-dom';
import { DepthLayout } from '../../../components/common/DepthLayout';
import { Button } from '../../../components/common/Button';
import { ROUTES } from '../../../constants';
import { ChevronRight, Calendar, Car, Coffee, Star, MapPin } from 'lucide-react';
import { HotelCard } from '../../../components/trips/HotelCard';

export default function AutoPilotHotel() {
  const navigate = useNavigate();
  const { id } = useParams();

  const hotelData = {
    name: "Residence Inn Marriott New York Downtown",
    image: "https://picsum.photos/seed/hotelnyc/800/600",
    address: "Manhattan/WTC Area",
    status: "In Policy",
    price: "$275",
    rating: 4
  };

  const amenities = [
    { icon: Calendar, text: "Check In • Mon, Jun 1, 2026 • 12 PM" },
    { icon: Calendar, text: "Check Out • Fri, Jun 5, 2026 • 11 AM" },
    { icon: Car, text: "Free Parking" },
    { icon: Coffee, text: "Buffet breakfast included" },
    { icon: Star, text: "Rated 4-Star" },
    { icon: MapPin, text: "10 mins walk to downtown" }
  ];

  return (
    <DepthLayout
      title="AutoPilot Booking"
      showBack
      headerContent={
        <div className="mt-1 text-white/70 text-sm font-medium">
          Accommodation Selection
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <HotelCard hotel={hotelData} variant="hero" amenities={amenities} />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4 mb-10 text-left">
            <Button
                variant="solid"
                className="w-full !py-4 !bg-[#D84315] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20"
                onClick={() => navigate(ROUTES.AUTOPILOT.CAR(id || 'ap-123'))}
            >
                View Car Rental
                <ChevronRight size={16} />
            </Button>
            <Button
                variant="outline"
                className="w-full !py-4 border-gray-200 text-gray-400 font-black uppercase text-xs tracking-widest"
                onClick={() => navigate(ROUTES.COPILOT.HOTEL(id || 'ap-123'))}
            >
                Edit Hotel
            </Button>
        </div>
      </div>
    </DepthLayout>
  );
}
