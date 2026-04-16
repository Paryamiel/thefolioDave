// src/components/Layout.js
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // 1. Check if user is logged in by looking at LocalStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  // 2. Handle Logout Logic
  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // Clear the saved session
    alert("You have been logged out.");
    navigate('/login'); // Send them back to the login page
  };

  return (
    <>
      <header>
          <h2>MLBB Journey</h2>
          <nav>
              {/* Navigation Links */}
              <ul>
                  {/* Renamed to Home Feed and pointed to the root path (/) */}
                  <li><Link to="/home">Home Feed</Link></li>
                  <li><Link to="/about">Stats & Lore</Link></li>
                  <li><Link to="/contact">Squad Up</Link></li>
                  
                  {/* 3. Conditional Rendering: Show Profile & Logout if logged in, else Register/Login */}
                  {userInfo ? (
                      <>
                          {/* NEW PROFILE BUTTON INSTALLED HERE */}
                          <li>
                              <Link to="/profile" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                  My Profile
                              </Link>
                          </li>
                          <li>
                              <button 
                                  onClick={handleLogout} 
                                  style={{ 
                                      background: 'transparent', 
                                      color: 'var(--text-light)', 
                                      border: 'none', 
                                      fontWeight: '600', 
                                      fontSize: '16px', 
                                      cursor: 'pointer', 
                                      padding: 0 
                                  }}
                                  className="nav-btn"
                              >
                                  Logout (@{userInfo.ign})
                              </button>
                          </li>
                      </>
                  ) : (
                      <>
                          <li><Link to="/register">Tournament</Link></li>
                          <li><Link to="/login">Login</Link></li>
                      </>
                  )}
              </ul>
              
              {/* Theme Toggle Button */}
              <button onClick={() => setIsDark(!isDark)} id="theme-toggle" aria-label="Toggle dark mode">
                  <span>{isDark ? "☀️" : "🌙"}</span>
              </button>
          </nav>
      </header>
      
      {/* <Outlet /> is where the current page (Home, About, etc.) will render */}
      <Outlet />

      <footer>
          <p>© 2026 MLBB Journey Project | Full-Stack MERN</p>
      </footer>
    </>
  );
}