import React, { useEffect, useState, Suspense } from 'react'
import { Route, Routes, useMatch } from 'react-router-dom';
import TopBar from './scenes/global/TopBar'



import { CartProvider } from './components/CartContext';
import { Backdrop, CircularProgress } from '@mui/material';
import ProtectedRoute from './components/Utilities/ProtectedRoute';
import AuthProvider from './components/Utilities/AuthProvider';


const AdminDashboard = React.lazy(() => import('./scenes/AdminDashboard'));
const CheckoutPage = React.lazy(() => import('./scenes/CheckoutPage'));
const RefundPolicy = React.lazy(() => import('./components/RefundPolicy'));
const TermAndConditions = React.lazy(() => import('./components/TermAndConditions'));
const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy'));
const SuccessPage = React.lazy(() => import('./scenes/SuccessPage'));
const RegistrationPage = React.lazy(() => import('./components/RegistrationPage'));
const LoginPage = React.lazy(() => import('./components/LoginPage'));
const AccountDetails = React.lazy(() => import('./scenes/AccountDetails'));
const Shop = React.lazy(() => import('./scenes/Shop'));
const ResetPassword = React.lazy(() => import('./components/ResetPassword'));
const AboutUs = React.lazy(() => import('./components/AboutUs'));
const ShippingPolicy = React.lazy(() => import('./components/ShippingPolicy'));
const Home = React.lazy(() => import('./scenes/Home'));
const Footer = React.lazy(() => import('./scenes/Footer'));
const AgeVerification = React.lazy(() => import('./scenes/AgeVerification'))
const App = () => {


  const [isAgeVerified, setIsAgeVerified] = useState(false);

  const isAdminDashboardRoute = !!useMatch('/api/customer/admin')

  const handleVerify = (verified) => {
    if (verified) {
      localStorage.setItem('isVerified', true);
      setIsAgeVerified(true);
    }
  };
  useEffect(() => {
    // Check session storage
    const isVerified = localStorage.getItem('isVerified');
    if (isVerified) {
      setIsAgeVerified(true);
    }
  }, []);


  return (
    <div>
      <AuthProvider>
        <CartProvider>

          {(!isAdminDashboardRoute) && <TopBar />}
          {!isAgeVerified &&
            <Suspense fallback={
              <CircularProgress />
            }
            >
              <AgeVerification onVerify={handleVerify} />
            </Suspense>
          }
          <Suspense fallback={
            <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
              <CircularProgress color="inherit" />
            </Backdrop>

          }>
            <Routes>
              <Route>

                {/* PROTECTED/LAZY LOADED ADMINDASHBOARD */}
                <Route
                  path="/api/customer/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/details" element={<AccountDetails />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/checkout/:step" element={<CheckoutPage />} />
                <Route path="/refund" element={<RefundPolicy />} />
                <Route path="/terms" element={<TermAndConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/success" element={<SuccessPage />} />
              </Route>
            </Routes>
          </Suspense>
          <Suspense fallback={
            <CircularProgress color="inherit" />
          }>
            <Footer />
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </div >
  )
}

export default App