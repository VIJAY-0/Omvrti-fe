import { useParams, useNavigate } from 'react-router-dom';
import { DepthLayout } from '../../components/common/DepthLayout';
import { TripDetailRow, ToggleRow } from '../../components/trips/TripDetailRow';
import { Plane, DollarSign, Calendar, MapPin, User } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useState, useEffect } from 'react';
import { ROUTES } from '../../constants';
import { tripsApi, Trip } from '../../api';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [addons, setAddons] = useState({ accommodation: true, car: false });

  useEffect(() => {
    if (id) {
      tripsApi.getTripById(id).then(res => {
        setTrip(res);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <DepthLayout title="Trip Details" showBack>
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-24 bg-gray-100 rounded-2xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
        </div>
      </DepthLayout>
    );
  }

  if (!trip) return null;

  return (
    <DepthLayout title="Trip Details" showBack>
      <div className="flex flex-col gap-6">
        {/* Detail Form Stack (Layer 03 Foreground) */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 mt-2">
          <div className="flex flex-col gap-6">
            {/* Summary Block */}
            <div className="flex flex-col gap-4">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Trip Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <TripDetailRow
                      label="Purpose"
                      value={trip.name}
                      icon={<MapPin size={20} className="text-[#3A7BD5]" />}
                      className="col-span-2"
                  />
                  <TripDetailRow
                      label="Budget"
                      value={trip.budget}
                      icon={<DollarSign size={20} className="text-[#2E7D32]" />}
                  />
                  <TripDetailRow
                      label="Schedule"
                      value={`${trip.startDate} - ${trip.endDate}`}
                      icon={<Calendar size={20} className="text-[#3A7BD5]" />}
                  />
                </div>
            </div>

            {/* Itinerary Block */}
            <div className="flex flex-col gap-4">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Itinerary</h3>
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                          <span className="text-xl font-black text-gray-800">SFO</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">San Francisco</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col items-center px-4 relative">
                          <div className="w-full h-[1.5px] bg-red-100 relative">
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-red-50 border-dashed">
                                  <Plane size={24} className="text-[#D84315]" />
                               </div>
                          </div>
                          <span className="mt-4 text-[11px] font-bold text-gray-400">5 Days Duration</span>
                      </div>

                      <div className="flex flex-col items-end">
                          <span className="text-xl font-black text-gray-800">JFK</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">New York</span>
                      </div>
                  </div>
                </div>
            </div>

            {/* Add-ons */}
            <div className="flex flex-col gap-4">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Travel Add-ons</h3>
                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex flex-col gap-2">
                  <ToggleRow
                      label="Accommodation"
                      active={addons.accommodation}
                      onToggle={() => setAddons(prev => ({ ...prev, accommodation: !prev.accommodation }))}
                  />
                  <ToggleRow
                      label="Car Rental"
                      active={addons.car}
                      onToggle={() => setAddons(prev => ({ ...prev, car: !prev.car }))}
                  />
                </div>
            </div>

            {/* Traveler */}
            <div className="flex flex-col gap-4">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Passenger</h3>
                <TripDetailRow
                  label="Primary Traveler"
                  value="Mr. Sam Watson"
                  icon={<User size={20} className="text-[#3A7BD5]" />}
                />
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 !py-4 border-[#D84315] text-[#D84315] font-black uppercase text-xs tracking-wider">
                Edit Trip
              </Button>
              <Button 
                  variant="solid" 
                  className="flex-1 !py-4 !bg-[#D84315] text-white font-black uppercase text-xs tracking-wider shadow-[0_5px_15px_rgba(216,67,21,0.3)]"
                  onClick={() => navigate(ROUTES.TRIPS.CONFIRMED)}
              >
                Accept Trip
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DepthLayout>
  );
}
