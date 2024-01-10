import React, { useEffect, useState, Suspense } from 'react'
import { Route, Routes, useLocation, useMatch } from 'react-router-dom';
import TopBar from './pages/global/TopBar'



import { CartProvider } from './components/CartContext';
import { Backdrop, CircularProgress } from '@mui/material';
import ProtectedRoute from './components/Utilities/ProtectedRoute';
import AuthProvider from './components/Utilities/AuthProvider';
import useThrottle from './components/Utilities/useThrottle';


const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const RefundPolicy = React.lazy(() => import('./pages/RefundPolicy'));
const TermAndConditions = React.lazy(() => import('./pages/TermAndConditions'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const SuccessPage = React.lazy(() => import('./pages/SuccessPage'));
const RegistrationPage = React.lazy(() => import('./pages/RegistrationPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const AccountDetails = React.lazy(() => import('./pages/AccountDetails'));
const Shop = React.lazy(() => import('./pages/Shop'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const ShippingPolicy = React.lazy(() => import('./pages/ShippingPolicy'));
const Home = React.lazy(() => import('./pages/Home'));
const Footer = React.lazy(() => import('./pages/Footer'));
const AgeVerification = React.lazy(() => import('./pages/AgeVerification'))
const Contact = React.lazy(() => import('./pages/Contact'));



const App = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const handleResize = useThrottle(() => {
    setScreenWidth(window.innerWidth);
  }, 200); // Throttle for 200ms, adjust as needed

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]); // Add handleResize to the dependency array

  const location = useLocation();
  //initially set to true for bots that dont run JS
  const [isAgeVerified, setIsAgeVerified] = useState(true);

  const isAdminDashboardRoute = !!useMatch('/customer/admin')
  // Define paths where Age Verification should not be shown
  const excludedRoutes = ['/privacy-policy', '/terms', '/shipping-policy', '/refund', '/customer/admin'];

  // Check if the current route is one of the excluded ones
  const isExcludedRoute = excludedRoutes.includes(location.pathname)


  const handleVerify = (verified) => {
    if (verified) {
      localStorage.setItem('isVerified', true);
      setIsAgeVerified(true);
    }
  };
  useEffect(() => {
    // Check if the user has already verified their age in this session.
    const isVerified = localStorage.getItem('isVerified');
    if (isVerified === 'true') {
      setIsAgeVerified(true);
    }
    else {
      // If the user has not verified their age, set isAgeVerified to false.
      localStorage.setItem('isVerified', false);

      setIsAgeVerified(false);
    }

    // Detect if the user-agent is a known crawler.
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isBot = /Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|ia_archiver|Facebot|Twitterbot|MJ12bot|BLEXBot|SemrushBot|Dotbot|BLEXBot|rogerbot|AhrefsBot|UptimeRobot|CCBot|Applebot|AdsBot-Google|SeznamBot|SISTRIX|Ezooms|pingdom|Mail.RU_Bot|HubSpot|Facebot|Omgili|BLEXBot|Screaming Frog|FAST-WebCrawler|YandexBot|Cliqzbot|ltx71|AddThis|BUbiNG|PetalBot|BUbiNG|Petaybot|MLBot|TweetmemeBot|PaperLiBot|Googlebot-Image|BingPreview|Discordbot|Yahoo|facebookexternalhit/i.test(userAgent);

    // If it's a bot, consider it "verified" to bypass the overlay.
    if (isBot) {
      setIsAgeVerified(true);
    }
  }, []);



  return (
    <div>

      <AuthProvider>
        <CartProvider>

          {(!isAdminDashboardRoute) && <TopBar screenWidth={screenWidth} />}
          {!isAgeVerified && !isExcludedRoute &&
            <Suspense fallback={<CircularProgress />}>
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
                  path="/customer/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Home screenWidth={screenWidth} />} />
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
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
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