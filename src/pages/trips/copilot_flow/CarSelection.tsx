import { useNavigate, useParams } from 'react-router-dom';
import { DepthLayout } from '../../../components/common/DepthLayout';
import { ROUTES } from '../../../constants';
import { motion } from 'motion/react';
import { CarCard } from '../../../components/trips/CarCard';

export default function CoPilotCarSelection() {
  const navigate = useNavigate();
  const { id } = useParams();

  const cars = [
    {
      id: 1,
      provider: "Hertz",
      logo: "https://picsum.photos/seed/hertz/50/50",
      model: "Ford Fiesta",
      image: "https://picsum.photos/seed/fiesta/400/250",
      specs: ["Automatic", "Seats: 4", "Fits 2 Luggage", "2WD", "28 MPG"],
      rating: "7.1 Good (3000+ reviews)",
      status: "In Policy",
      price: "$325",
      priceLabel: "Price for 5 days",
      rewards: "+$25 OmVrti Rewards",
      is_autopilot: true
    },
    {
      id: 2,
      provider: "Thrifty",
      logo: "https://picsum.photos/seed/thrifty/50/50",
      model: "Buick Encore",
      image: "https://picsum.photos/seed/encore/400/250",
      specs: ["Automatic", "Seats: 5", "Fits 3 Luggage", "2WD", "25 MPG"],
      status: "In Policy",
      price: "$245",
      rewards: "+$30 OmVrti Rewards",
      rating: "6.8 OK (1200+ reviews)"
    },
    {
      id: 3,
      provider: "Avis",
      logo: "https://picsum.photos/seed/avis/50/50",
      model: "Kia Rio",
      image: "https://picsum.photos/seed/rio/400/250",
      specs: ["Automatic", "Seats: 5", "Fits 2 Luggage"],
      status: "Out of Policy",
      price: "$563",
      rewards_penalty: "-$15 OmVrti Rewards",
      rating: "8.2 Excellent (500+ reviews)"
    }
  ];

  const handleSelect = () => {
    // Navigate to the final summary
    navigate(ROUTES.AUTOPILOT.SUMMARY(id || 'ap-123'));
  };

  return (
    <DepthLayout
      title="Co-Pilot Booking"
      showBack
      headerContent={
        <div className="mt-1 text-white/70 text-sm font-medium">Car Rental Selection</div>
      }
    >
      <div className="flex flex-col gap-6 mb-20 text-left">
        {cars.map((car, idx) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <CarCard car={car} variant="selection" onClick={handleSelect} />
          </motion.div>
        ))}
      </div>
    </DepthLayout>
  );
}
