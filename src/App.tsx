/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import Home from './pages/home/index';
import TripPlanning from './pages/trips/planning';
import TripAutopilot from './pages/trips/autopilot';
import TripDetails from './pages/trips/[id]';
import TripConfirmed from './pages/trips/confirmed';
import IntegrationHome from './pages/integration/index';
import GoogleLogin from './pages/integration/login';
import IntegrationSuccess from './pages/integration/success';
import IntegrationSettings from './pages/integration/settings';
import Alerts from './pages/alerts/index';
import CalendarView from './pages/integration/calendar';
import AutoPilotAlert from './pages/trips/autopilot_flow/Alert';
import AutoPilotFlight from './pages/trips/autopilot_flow/Flight';
import AutoPilotHotel from './pages/trips/autopilot_flow/Hotel';
import AutoPilotCar from './pages/trips/autopilot_flow/Car';
import AutoPilotSummary from './pages/trips/autopilot_flow/Summary';
import CoPilotFlightSelection from './pages/trips/copilot_flow/FlightSelection';
import CoPilotHotelSelection from './pages/trips/copilot_flow/HotelSelection';
import CoPilotCarSelection from './pages/trips/copilot_flow/CarSelection';
import { ROUTES } from './constants';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-canvas">
        <div className="flex-1">
          <Routes>
            {/* Main Home */}
            <Route path={ROUTES.TRIPS.HOME} element={<Home />} />
            
            {/* Trip Routes */}
            <Route path={ROUTES.TRIPS.PLANNING} element={<TripPlanning />} />
            <Route path={ROUTES.TRIPS.AUTOPILOT} element={<TripAutopilot />} />
            <Route path={ROUTES.TRIPS.DETAILS(':id')} element={<TripDetails />} />
            <Route path={ROUTES.TRIPS.CONFIRMED} element={<TripConfirmed />} />

            {/* AutoPilot Flow */}
            <Route path={ROUTES.AUTOPILOT.ALERT(':id')} element={<AutoPilotAlert />} />
            <Route path={ROUTES.AUTOPILOT.FLIGHT(':id')} element={<AutoPilotFlight />} />
            <Route path={ROUTES.AUTOPILOT.HOTEL(':id')} element={<AutoPilotHotel />} />
            <Route path={ROUTES.AUTOPILOT.CAR(':id')} element={<AutoPilotCar />} />
            <Route path={ROUTES.AUTOPILOT.SUMMARY(':id')} element={<AutoPilotSummary />} />

            {/* Co-Pilot Flow */}
            <Route path={ROUTES.COPILOT.FLIGHT(':id')} element={<CoPilotFlightSelection />} />
            <Route path={ROUTES.COPILOT.HOTEL(':id')} element={<CoPilotHotelSelection />} />
            <Route path={ROUTES.COPILOT.CAR(':id')} element={<CoPilotCarSelection />} />

            {/* Notifications */}
            <Route path={ROUTES.ALERTS} element={<Alerts />} />

            {/* Integration Routes */}
            <Route path="/integration" element={<IntegrationHome />} />
            <Route path="/integration/login" element={<GoogleLogin />} />
            <Route path="/integration/success" element={<IntegrationSuccess />} />
            <Route path="/integration/settings" element={<IntegrationSettings />} />
            <Route path={ROUTES.INTEGRATION.CALENDAR} element={<CalendarView />} />
            
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Navbar />
      </div>
    </BrowserRouter>
  );
}
