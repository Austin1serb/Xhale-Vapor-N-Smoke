import React, { useEffect, useState, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom';
import TopBar from './scenes/global/TopBar'
import Home from './scenes/Home'
import Footer from './scenes/Footer'
import AgeVerification from './scenes/AgeVerification';
import { CartProvider } from './components/CartContext';
import { Backdrop, CircularProgress } from '@mui/material';
import ProtectedRoute from './components/Utilities/ProtectedRoute';

const App = () => {
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

  const [isAgeVerified, setIsAgeVerified] = useState(false);


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
      <CartProvider>
        <TopBar />
        {!isAgeVerified && <AgeVerification onVerify={handleVerify} />}
        <Suspense fallback={
          <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
            <CircularProgress color="inherit" />
          </Backdrop>

        }>
          <Routes>
            <Route>

              <Route exact path="/" Component={Home} />
              {/*<Route exact path="/admin" element={<AdminDashboard />} />*/}

              {/* PROTECTED/LAZY LOADED ADMINDASHBOARD */}

              <Route
                path="/api/customer/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />



              <Route exact path="/login" element={<LoginPage />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route exact path="/registration" element={<RegistrationPage />} />
              <Route exact path="/details" element={<AccountDetails />} />
              <Route exact path="/shop" element={<Shop />} />
              <Route path="/checkout/:step" element={<CheckoutPage />} />
              <Route exact path="/refund" element={<RefundPolicy />} />
              <Route exact path="/terms" element={<TermAndConditions />} />
              <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/success" element={<SuccessPage />} />
            </Route>
          </Routes>
        </Suspense>
        <Footer />
      </CartProvider>
    </div >
  )
}

export default App