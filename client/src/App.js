import React from 'react'
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import TopBar from './scenes/global/TopBar'
import Home from './scenes/Home'
import Footer from './scenes/Footer'
import AdminDashboard from './scenes/AdminDashboard';
import AgeVerification from './scenes/AgeVerification';


const App = () => {
  return (
    <div>
      <TopBar />
      <Routes>
        <Route>
          <Route exact path="/verify-age" Component={AgeVerification} />
          <Route exact path="/" Component={Home} />
          <Route exact path="/admin" Component={AdminDashboard} />
        </Route>
      </Routes>
      <Footer />

    </div>
  )
}

export default App