import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect } from "react";
import './App.css';
import LandingPage from "./pages/LandingPage";
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ShopPage from './pages/ShopPage';
import Dashboard from './pages/AdminDashboard';
import ProductListing from './pages/adminPages/ProductListing';
import UserManagement from './pages/adminPages/UserManagement';
import SalesReport from './pages/adminPages/SalesReport';
import OrderFulfillment from "./pages/adminPages/OrderFulfillment";
import CartPage from "./pages/CartPage";

//log out implemented but not in proper page

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
    

        {/* admin dashboard should be protected */}
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/product-listing" element={<ProductListing />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/sales-report" element={<SalesReport />} />
        <Route path="/order-fulfillment" element={<OrderFulfillment />} />

      </Routes>
    </div>
  );
}

export default App;
