import { useNavigate, useParams } from 'react-router-dom';
import { DepthLayout } from '../../../components/common/DepthLayout';
import { ROUTES } from '../../../constants';
import { Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { FlightCard } from '../../../components/trips/FlightCard';

export default function CoPilotFlightSelection() {
  const navigate = useNavigate();
  const { id } = useParams();

  const sections = [
    {
      date_header: "Departing flight - Mon, Jun 1, 2026",
      cards: [
        {
          is_autopilot_recommendation: true,
          airline: "United UA 435",
          carrier: "United UA 435",
          times: "8:30 AM (SFO) — 4:55 PM (JFK)",
          status: "In Policy",
          price: "$515",
          subtitle: "round trip",
          rewards: "+$10 OmVrti Rewards",
          emissions_tag: "Avg emissions",
          type: "Economy • Non stop • 5h 25m",
          details: "Economy • Non stop • 5h 25m"
        },
        {
          is_autopilot_recommendation: false,
          airline: "United UA 2441",
          carrier: "United UA 2441",
          times: "11:15 AM (SFO) — 7:45 PM (JFK)",
          status: "Out of Policy",
          price: "$625",
          subtitle: "round trip",
          rewards_penalty: "-$85 OmVrti Rewards",
          type: "Economy • Non stop • 5h 30m",
          details: "Economy • Non stop • 5h 30m"
        }
      ]
    },
    {
       date_header: "Sun, May 31, 2026 (Depart 1 day prior)",
       cards: [
         {
           airline: "United UA 467",
           carrier: "United UA 467",
           times: "6:00 AM (SFO) — 2:15 PM (JFK)",
           price: "$375",
           subtitle: "round trip",
           rewards: "+$40 OmVrti Rewards",
           status: "In Policy",
           type: "Economy • Non stop • 5h 15m",
           details: "Economy • Non stop • 5h 15m"
         }
       ]
     }
  ];

  const handleSelect = () => {
    // After selection, move back to the next step in AutoPilot flow (Hotel)
    navigate(ROUTES.AUTOPILOT.HOTEL(id || 'ap-123'));
  };

  return (
    <DepthLayout
      title="Co-Pilot Booking"
      showBack
      headerContent={
        <div className="mt-1 flex items-center justify-between w-full">
          <div className="text-white/70 text-sm font-medium text-left">Flights to New York</div>
          <button className="bg-white/10 p-2 rounded-xl text-white">
            <Filter size={18} />
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-8 mb-20 text-left">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="flex flex-col gap-4">
             <h3 className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">
               {section.date_header}
             </h3>
             <div className="flex flex-col gap-4">
                {section.cards.map((flight, fIdx) => (
                  <motion.div
                    key={fIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: fIdx * 0.1 }}
                  >
                    <FlightCard flight={flight} variant="selection" onClick={handleSelect} />
                  </motion.div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </DepthLayout>
  );
}
