import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import TopBar from './scenes/global/TopBar'
import Home from './scenes/Home'
import Footer from './scenes/Footer'
//import AdminDashboard from './scenes/AdminDashboard';
import AgeVerification from './scenes/AgeVerification';
import LoginRegistration from './scenes/LoginRegistration';
import RegistrationPage from './components/RegistrationPage';
import AccountDetails from './scenes/AccountDetails';
import Shop from './scenes/Shop';
import { CartProvider } from './components/CartContext';
import CheckoutPage from './scenes/CheckoutPage';
import SuccessPage from './scenes/SuccessPage';
import RefundPolicy from './components/RefundPolicy.jsx';
import TermAndConditions from './components/TermAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';


const App = () => {
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  useEffect(() => {
    // Check session storage
    const isVerified = sessionStorage.getItem('isVerified');
    if (isVerified) {
      setIsAgeVerified(true);
    }
  }, []);

  const handleVerify = (verified) => {
    if (verified) {
      localStorage.setItem('isVerified', true);
      setIsAgeVerified(true);
    }
  };
  return (
    <div>
      <CartProvider>

        <TopBar />
        {/*{!isAgeVerified && <AgeVerification onVerify={handleVerify} />}*/}
        <Routes>
          <Route>
            <Route exact path="/verify-age" Component={AgeVerification} />
            <Route exact path="/" Component={Home} />
            {/*<Route exact path="/admin" Component={AdminDashboard} />*/}
            <Route exact path="/login" Component={LoginRegistration} />
            <Route exact path="/registration" Component={RegistrationPage} />
            <Route exact path="/details" Component={AccountDetails} />
            <Route exact path="/shop" Component={Shop} />
            <Route exact path="/checkout" Component={CheckoutPage} />
            <Route exact path="/refund" Component={RefundPolicy} />
            <Route exact path="/terms" Component={TermAndConditions} />
            <Route exact path="/privacy-policy" Component={PrivacyPolicy} />
            <Route path="/success" Component={SuccessPage} />


          </Route>
        </Routes>
        <Footer />
      </CartProvider>
    </div>
  )
}

export default App