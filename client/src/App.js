import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing_page';
import Signup from './pages/signup';
import Login from './pages/login';
import ShopPage from './pages/shop';
import Dashboard from './pages/adminPages/admin-dashboard';

//log out implemented but not in proper page

function App() {
  const isUserLogIn = !!localStorage.getItem('token')
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
    
        {/* asking if user logged in and if they are they can access shop page and admin dashboard */}
        {isUserLogIn && <Route path="/shop" element={<ShopPage />} />}

        {/* admin dashboard should be protected */}
        {isUserLogIn && <Route path="/admin-dashboard" element={<Dashboard />} />}

      </Routes>
    </div>
  );
}

export default App;
