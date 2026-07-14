import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';    // फाइल का नाम जैसा डिस्क पर है वैसा ही रखें
import Donation from './pages/Donation';
import Signup from './pages/Signup';
import NgoDashboard from './pages/NgoDashboard';  // 'S' बड़ा है तो यहाँ भी बड़ा रखें
import NgoProfile from "./pages/NgoProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/donate" element={<Donation />} />
        <Route path="/ngo-dashboard" element={<NgoDashboard />} />
        <Route
          path="/ngo-profile"
          element={<NgoProfile />}
        />
      </Routes>
    </Router>
  );
}

export default App;