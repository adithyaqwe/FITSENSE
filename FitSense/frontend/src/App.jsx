import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HealthForm from './pages/HealthForm';
import HealthReport from './pages/HealthReport';
import GymPlan from './pages/GymPlan';
import DietPlan from './pages/DietPlan';
// import ProtectedRoute from './components/ProtectedRoute';

import About from "./pages/About";
import Connect from "./pages/Connect";


import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/connect" element={<Connect />} />

            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submit-report" element={<HealthForm />} />
            <Route path="/report" element={<HealthReport />} />
            <Route path="/gym-plan" element={<GymPlan />} />
            <Route path="/diet-plan" element={<DietPlan />} />
          </Routes>
        </div>
        <Footer />
      </div>

    </Router>
  );
}

export default App;
