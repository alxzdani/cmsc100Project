import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect } from "react";
import './App.css';
import { SnackbarProvider } from './components/SnackbarContext';
import Snackbar from './components/Snackbar';
import LandingPage from "./pages/LandingPage";
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ShopPage from './pages/ShopPage';
import Dashboard from './pages/AdminDashboard';
import ProductListing from './pages/ProductListing';
import UserManagement from './pages/UserManagement';
import SalesReport from './pages/SalesReport';
import OrderFulfillment from "./pages/OrderFulfillment";
import CartPage from "./pages/CartPage";
import ManageOrdersPage from "./pages/ManageOrders";
import ProfilePage from "./pages/ProfilePage";

//log out implemented but not in proper page

function App() {
  return (
    <div className="App">
      <SnackbarProvider>
      <Snackbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/manage-orders" element={<ManageOrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
    
        {/* admin dashboard should be protected */}
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/product-listing" element={<ProductListing />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/sales-report" element={<SalesReport />} />
        <Route path="/order-fulfillment" element={<OrderFulfillment />} />

      </Routes>
      </SnackbarProvider>
    </div>
  );
}

export default App;
