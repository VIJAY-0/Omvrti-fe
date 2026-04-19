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

            {/* Integration Routes */}
            <Route path="/integration" element={<IntegrationHome />} />
            <Route path="/integration/login" element={<GoogleLogin />} />
            <Route path="/integration/success" element={<IntegrationSuccess />} />
            <Route path="/integration/settings" element={<IntegrationSettings />} />
            
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Navbar />
      </div>
    </BrowserRouter>
  );
}
