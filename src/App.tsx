import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { CategoryPage } from './pages/CategoryPage';
import { ServiceDetail } from './pages/ServiceDetail';
import { BookingWizard } from './pages/BookingWizard';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { AIAssistant } from './components/AIAssistant';
import { ProtectedRoute } from './components/auth/ProtectedRoute';


import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { VerifyOTP } from './pages/auth/VerifyOTP';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';


const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const Overview = lazy(() => import('./pages/dashboard/Overview').then(m => ({ default: m.Overview })));
const Invoices = lazy(() => import('./pages/dashboard/Invoices').then(m => ({ default: m.Invoices })));
const Reviews = lazy(() => import('./pages/dashboard/Reviews').then(m => ({ default: m.Reviews })));
const Support = lazy(() => import('./pages/dashboard/Support').then(m => ({ default: m.Support })));
const Profile = lazy(() => import('./pages/dashboard/Profile').then(m => ({ default: m.Profile })));
const BookingTracker = lazy(() => import('./pages/dashboard/BookingTracker').then(m => ({ default: m.BookingTracker })));
const Addresses = lazy(() => import('./pages/dashboard/Addresses').then(m => ({ default: m.Addresses })));
const Bookings = lazy(() => import('./pages/dashboard/Bookings').then(m => ({ default: m.Bookings })));


const TechnicianOnboarding = lazy(() => import('./pages/technician/Onboarding').then(m => ({ default: m.Onboarding })));
const TechnicianDashboardLayout = lazy(() => import('./components/technician/TechnicianDashboardLayout').then(m => ({ default: m.TechnicianDashboardLayout })));
const TechnicianDashboardOverview = lazy(() => import('./pages/technician/DashboardOverview').then(m => ({ default: m.TechnicianDashboardOverview })));
const NewJobs = lazy(() => import('./pages/technician/NewJobs').then(m => ({ default: m.NewJobs })));
const ActiveJobs = lazy(() => import('./pages/technician/ActiveJobs').then(m => ({ default: m.ActiveJobs })));


const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminOverview = lazy(() => import('./pages/admin/DashboardOverview').then(m => ({ default: m.DashboardOverview })));
const AdminUsers = lazy(() => import('./pages/admin/Users').then(m => ({ default: m.Users })));
const AdminTechnicians = lazy(() => import('./pages/admin/Technicians').then(m => ({ default: m.Technicians })));
const AdminServices = lazy(() => import('./pages/admin/Services').then(m => ({ default: m.Services })));
const AdminBookings = lazy(() => import('./pages/admin/Bookings').then(m => ({ default: m.Bookings })));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews').then(m => ({ default: m.AdminReviews })));
const AdminSupport = lazy(() => import('./pages/admin/AdminSupport').then(m => ({ default: m.AdminSupport })));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons').then(m => ({ default: m.AdminCoupons })));
const AdminAuditLogs = lazy(() => import('./pages/admin/AuditLogs').then(m => ({ default: m.AuditLogs })));
const AdminSettings = lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.Settings })));

import './App.css';

const Loader = () => <div style={{ padding: '4rem', textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="dot-pulse">...</span></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="app-container">
        <Routes>
          
          <Route path="/" element={<><Header /><Home /><Footer /></>} />
          <Route path="/services" element={<><Header /><Services /><Footer /></>} />
          <Route path="/services/:categorySlug" element={<><Header /><CategoryPage /><Footer /></>} />
          <Route path="/services/:categorySlug/:serviceSlug" element={<><Header /><ServiceDetail /><Footer /></>} />
          
          <Route path="/book/:serviceId" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'SUPER_ADMIN']}>
              <><Header /><BookingWizard /><Footer /></>
            </ProtectedRoute>
          } />
          
          <Route path="/booking-confirmation/:id" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'SUPER_ADMIN']}>
              <><Header /><BookingConfirmation /><Footer /></>
            </ProtectedRoute>
          } />
          
          
          <Route path="/auth/login" element={<><Header /><Login /><Footer /></>} />
          <Route path="/auth/signup" element={<><Header /><SignUp /><Footer /></>} />
          <Route path="/auth/verify-otp" element={<><Header /><VerifyOTP /><Footer /></>} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
          <Route path="/technician/register" element={<TechnicianOnboarding />} />

          
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'SUPER_ADMIN']}>
              <Suspense fallback={<Loader />}><DashboardLayout /></Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<BookingTracker />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="support" element={<Support />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          
          <Route path="/technician/dashboard" element={
            <ProtectedRoute allowedRoles={['TECHNICIAN']}>
              <Suspense fallback={<Loader />}><TechnicianDashboardLayout /></Suspense>
            </ProtectedRoute>
          }>
            <Route path="overview" element={<TechnicianDashboardOverview />} />
            <Route path="jobs/new" element={<NewJobs />} />
            <Route path="active" element={<ActiveJobs />} />
            <Route path="bookings/:id" element={<BookingTracker />} />
            <Route path="history" element={<ActiveJobs />} />
          </Route>

          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <Suspense fallback={<Loader />}><AdminLayout /></Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard/overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="technicians" element={<AdminTechnicians />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
        <AIAssistant />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
