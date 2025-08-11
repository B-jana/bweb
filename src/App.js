import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Booking from './components/Booking';
import Training from './components/Training';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard ';


function App() {
  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/training" element={<Training />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        <Footer />
      </Router>
    </>
  );
}

export default App;

