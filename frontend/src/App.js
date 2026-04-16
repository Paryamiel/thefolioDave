// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage'; //
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard'; // Adjust path if needed

// Import your global vanilla CSS file directly into React!
//import './style.css'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Splash screen has no header/footer */}
        <Route path="/" element={<SplashPage />} />
        
        {/* All other pages share the Layout (Header/Footer) */}
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;