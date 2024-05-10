import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect } from "react";
import './App.css';
import LandingPage from "./pages/LandingPage";
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ShopPage from './pages/ShopPage';
import Dashboard from './pages/adminPages/admin-dashboard';

//log out implemented but not in proper page

function App() {
  const isUserLogIn = !!localStorage.getItem('token')
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
    
        {/* asking if user logged in and if they are they can access shop page and admin dashboard */}
        {isUserLogIn && <Route path="/shop" element={<ShopPage />} />}

        {/* admin dashboard should be protected */}
        {isUserLogIn && <Route path="/admin-dashboard" element={<Dashboard />} />}

      </Routes>
    </div>
  );
}

export default App;
