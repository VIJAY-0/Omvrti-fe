import { useNavigate, useParams } from 'react-router-dom';
import { DepthLayout } from '../../../components/common/DepthLayout';
import { Button } from '../../../components/common/Button';
import { ROUTES } from '../../../constants';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { FlightCard } from '../../../components/trips/FlightCard';

export default function AutoPilotFlight() {
  const navigate = useNavigate();
  const { id } = useParams();

  const flights = [
    {
      type: "Departing flight",
      date: "Mon, Jun 1, 2026",
      times: "8:30 AM (SFO) — 4:55 PM (JFK)",
      carrier: "United UA 435",
      details: "Economy • Non stop • 5h 25m",
      tags: ["-22% emissions"]
    },
    {
      type: "Returning flight",
      date: "Fri, Jun 5, 2026",
      times: "8:10 PM (JFK) — 11:55 PM (SFO)",
      carrier: "United UA 1289",
      details: "Economy • Non stop • 6h 45m",
      tags: ["-22% emissions"]
    }
  ];

  return (
    <DepthLayout
      title="AutoPilot Booking"
      showBack
      headerContent={
        <div className="mt-1 text-white/70 text-sm font-medium">
          Outbound & Return Selection
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-[40px] p-6 shadow-2xl border border-gray-100 mt-2">
            <h3 className="text-lg font-black text-gray-800 mb-6 text-left">Selected Flights</h3>
            
            <div className="flex flex-col gap-8">
                {flights.map((flight, idx) => (
                    <div key={idx} className={`${idx === 0 ? 'pb-8 border-b border-gray-100' : ''}`}>
                      <FlightCard flight={flight} variant="summary" />
                    </div>
                ))}
            </div>

            <div className="mt-10 p-5 bg-[#F8F9FA] rounded-3xl border border-gray-100 flex justify-between items-center">
                <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5 text-[#4CAF50] font-black text-[10px] uppercase tracking-widest mb-1">
                        <ShieldCheck size={14} />
                        <span>In Policy</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-gray-800">$515</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Round Trip</span>
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase mt-1">+$10 OmVrti Rewards</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                    <span className="transform -rotate-45 block">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                    </span>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4 mb-10">
            <Button
                variant="solid"
                className="w-full !py-4 !bg-[#D84315] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20"
                onClick={() => navigate(ROUTES.AUTOPILOT.HOTEL(id || 'ap-123'))}
            >
                View Hotel
                <ChevronRight size={16} />
            </Button>
            <Button
                variant="outline"
                className="w-full !py-4 border-gray-200 text-gray-400 font-black uppercase text-xs tracking-widest"
                onClick={() => navigate(ROUTES.COPILOT.FLIGHT(id || 'ap-123'))}
            >
                Edit Flight
            </Button>
        </div>
      </div>
    </DepthLayout>
  );
}
