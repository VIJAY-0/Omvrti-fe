import { useNavigate, useParams } from 'react-router-dom';
import { DepthLayout } from '../../../components/common/DepthLayout';
import { Button } from '../../../components/common/Button';
import { ROUTES } from '../../../constants';
import { ChevronRight } from 'lucide-react';
import { CarCard } from '../../../components/trips/CarCard';

export default function AutoPilotCar() {
  const navigate = useNavigate();
  const { id } = useParams();

  const carData = {
    provider: "Hertz",
    model: "Kia K5 or similar",
    image: "https://picsum.photos/seed/kia/600/400",
    specs: ["Transmission : Automatic", "Seats : 5", "Fits 3 Luggage", "2WD", "28 MPG"],
    rating: "7.1 Good",
    status: "In Policy",
    price: "$65",
    rewards: "+$5 OmVrti Rewards"
  };

  return (
    <DepthLayout
      title="AutoPilot Booking"
      showBack
      headerContent={
        <div className="mt-1 text-white/70 text-sm font-medium">
          Car Rental Selection
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <CarCard car={carData} variant="hero" />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4 mb-10">
            <Button
                variant="solid"
                className="w-full !py-4 !bg-[#D84315] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20"
                onClick={() => navigate(ROUTES.AUTOPILOT.SUMMARY(id || 'ap-123'))}
            >
                Confirm Booking
                <ChevronRight size={16} />
            </Button>
            <Button
                variant="outline"
                className="w-full !py-4 border-gray-200 text-gray-400 font-black uppercase text-xs tracking-widest"
                onClick={() => navigate(ROUTES.COPILOT.CAR(id || 'ap-123'))}
            >
                Edit Car Rental
            </Button>
        </div>
      </div>
    </DepthLayout>
  );
}
