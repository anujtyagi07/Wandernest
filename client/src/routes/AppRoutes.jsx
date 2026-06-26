import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Eagerly loaded pages (core pages)
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

// Lazy loaded pages for code splitting
const Destinations = lazy(() => import('../pages/Destinations'));
const DestinationDetail = lazy(() => import('../pages/DestinationDetail'));
const Packages = lazy(() => import('../pages/Packages'));
const PackageDetail = lazy(() => import('../pages/PackageDetail'));
const Booking = lazy(() => import('../pages/Booking'));
const BookingSuccess = lazy(() => import('../pages/BookingSuccess'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Auth = lazy(() => import('../pages/Auth'));
const PriceCalculator = lazy(() => import('../pages/PriceCalculator'));
const Hotels = lazy(() => import('../pages/Hotels'));
const HotelDetail = lazy(() => import('../pages/HotelDetail'));
const Profile = lazy(() => import('../pages/Profile'));
const Chat = lazy(() => import('../pages/Chat'));
const BookingReceipt = lazy(() => import('../pages/BookingReceipt'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetail />} />
        <Route path="/booking/:packageId" element={<Booking />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/price-calculator" element={<PriceCalculator />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/bookings/:id" element={<BookingReceipt />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
