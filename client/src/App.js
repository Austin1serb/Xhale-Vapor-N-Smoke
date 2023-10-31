import React from 'react'
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import TopBar from './scenes/global/TopBar'
import Home from './scenes/Home'
import Footer from './scenes/Footer'
import AdminDashboard from './scenes/AdminDashboard';
import AgeVerification from './scenes/AgeVerification';
import LoginRegistration from './scenes/LoginRegistration';
import RegistrationPage from './components/RegistrationPage';
import AccountDetails from './scenes/AccountDetails';
import Shop from './scenes/Shop';
import { CartProvider } from './components/CartContext';


const App = () => {
  return (
    <div>
      <CartProvider>
        <TopBar />
        <Routes>
          <Route>
            <Route exact path="/verify-age" Component={AgeVerification} />
            <Route exact path="/" Component={Home} />
            <Route exact path="/admin" Component={AdminDashboard} />
            <Route exact path="/login" Component={LoginRegistration} />
            <Route exact path="/registration" Component={RegistrationPage} />
            <Route exact path="/details" Component={AccountDetails} />
            <Route exact path="/shop" Component={Shop} />
          </Route>
        </Routes>
        <Footer />
      </CartProvider>
    </div>
  )
}

export default App