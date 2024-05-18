import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect } from "react";
import './App.css';
import LandingPage from "./pages/LandingPage";
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ShopPage from './pages/ShopPage';
import Dashboard from './pages/adminPages/AdminDashboard';
import ProductListing from './pages/adminPages/ProductListing';
import UserManagement from './pages/adminPages/UserManagement';
import SalesReport from './pages/adminPages/SalesReport';
import OrderFulfillment from "./pages/adminPages/OrderFulfillment";

//log out implemented but not in proper page

function App() {
  const isUserLogIn = !!localStorage.getItem('token')
  const isAdminLogIn = localStorage.getItem('userType') === 'admin';

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
    
        {/* asking if user logged in and if they are they can access shop page and admin dashboard */}
        {isUserLogIn && <Route path="/shop" element={<ShopPage />} />}

        {/* admin dashboard should be protected */}
        {isAdminLogIn && <Route path="/admin-dashboard" element={<Dashboard />} />}
        {isAdminLogIn && <Route path="/product-listing" element={<ProductListing />} />}
        {isAdminLogIn && <Route path="/user-management" element={<UserManagement />} />}
        {isAdminLogIn && <Route path="/sales-report" element={<SalesReport />} />}
        {isAdminLogIn && <Route path="/order-fulfillment" element={<OrderFulfillment />} />}

      </Routes>
    </div>
  );
}

export default App;
