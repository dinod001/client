import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
// Guest Pages
import GuestLayout from './layouts/GuestLayout';
import Home from './pages/guest/Home';
import About from './pages/guest/About';
import Services from './pages/guest/Services';
import Blog from './pages/guest/Blog';
import GuestInquiry from './pages/guest/GuestInquiry';
// Customer Pages
import CustomerLayout from './layouts/CustomerLayout';
import Dashboard from './pages/customer/Dashboard';
import RequestPickupDashboard from './pages/customer/RequestPickupDashboard';
import ServiceBookingDashboard from './pages/customer/ServiceBookingDashboard';
import RequestPickup from './pages/customer/RequestPickup';
import TrackStatus from './pages/customer/TrackStatus';
import PickupHistory from './pages/customer/PickupHistory';
import RewardPoints from './pages/customer/RewardPoints';
import Inquiry from './pages/customer/Inquiry';
import Notifications from './pages/customer/Notifications';
import Profile from './pages/customer/Profile';
import BookService from './pages/customer/BookService';

export function App() {
  const { isSignedIn } = useUser();

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Guest Routes - Available to everyone */}
          <Route path="/" element={<GuestLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="blog" element={<Blog />} />
            <Route path="inquiry" element={<GuestInquiry />} />
          </Route>
          
          {/* Standalone Booking Route */}
          <Route 
            path="/book-service" 
            element={
              isSignedIn ? (
                <BookService />
              ) : (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                  <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Please Sign In</h2>
                    <p>You need to be signed in to book a service.</p>
                    <Link to="/" className="text-blue-600 hover:underline">Go back to home</Link>
                  </div>
                </div>
              )
            } 
          />
          
          {/* Customer Routes - Protected */}
          {isSignedIn && (
            <Route path="/" element={<CustomerLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="request-pickup" element={<RequestPickupDashboard />} />
              <Route path="service-booking" element={<ServiceBookingDashboard />} />
              <Route path="new-pickup-request" element={<RequestPickup />} />
              <Route path="track-status" element={<TrackStatus />} />
              <Route path="pickup-history" element={<PickupHistory />} />
              <Route path="rewards" element={<RewardPoints />} />
              <Route path="inquiry" element={<Inquiry />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          )}
          
          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}