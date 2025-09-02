import React, {Suspense, useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { PageLoader } from './components/LoadingSpinner';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import RequireAuth from './components/auth/RequireAuth';

// Lazy load page components
const HomePage = React.lazy(() => import('./pages/HomePage'));
const IndustrySelectionPage = React.lazy(() => import('./pages/IndustrySelectionPage'));
const TemplateGalleryPage = React.lazy(() => import('./pages/TemplateGalleryPage'));
const RegistrationPage = React.lazy(() => import('./pages/RegistrationPage'));
const TemplateOptionsPage = React.lazy(() => import('./pages/TemplateOptionsPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const PaymentSuccessPage = React.lazy(() => import('./pages/PaymentSuccessPage'));
const VerifyEmailPage = React.lazy(() => import('./pages/auth/VerifyEmailPage'));
const AuthCallbackPage = React.lazy(() => import('./pages/auth/AuthCallbackPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));

// Dashboard pages
const DashboardPage = React.lazy(() => import('./pages/dashboard/DashboardPage'));
const BillingPage = React.lazy(() => import('./pages/dashboard/BillingPage'));
const WebsitePage = React.lazy(() => import('./pages/dashboard/WebsitePage'));
const ProfilePage = React.lazy(() => import('./pages/dashboard/ProfilePage'));

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
            <div className="min-h-screen bg-white">
              <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <main>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/pilih-industri" element={<IndustrySelectionPage />} />
                    <Route path="/template/:industryId" element={<TemplateGalleryPage />} />
                    <Route path="/template-options/:industryId" element={<TemplateOptionsPage />} />
                    <Route path="/daftar" element={<RegistrationPage />} />
                    <Route path="/masuk" element={<LoginPage />} />
                    <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/payment-success" element={<PaymentSuccessPage />} />

                    {/* Dashboard Routes (Protected) */}
                    <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
                    <Route path="/dashboard/billing" element={<RequireAuth><BillingPage /></RequireAuth>} />
                    <Route path="/dashboard/website" element={<RequireAuth><WebsitePage /></RequireAuth>} />
                    <Route path="/dashboard/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

                    {/* Placeholder routes */}
                    <Route path="/setup/bisnis-info" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Setup Bisnis Info</h1></div>} />
                    <Route path="/wp-admin" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">WordPress Dashboard</h1></div>} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>

        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;