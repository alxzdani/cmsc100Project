import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect } from "react";
import './App.css';
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<LandingPage />}></Route> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
