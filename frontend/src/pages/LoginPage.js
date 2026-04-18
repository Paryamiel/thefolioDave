// src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let newErrors = {};

    if (!formData.email) { newErrors.email = "Email is required."; isValid = false; }
    if (!formData.password) { newErrors.password = "Password is required."; isValid = false; }

    setErrors(newErrors);

    if (isValid) {
      try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        
        // Send login request to our Express backend
        const response = await axios.post('/api/users/login', formData, config);
        
        // Save the user data and token to LocalStorage
        localStorage.setItem('userInfo', JSON.stringify(response.data));

        alert(`Welcome back, ${response.data.ign}!`);
        navigate('/home'); // Redirect to community feed

      } catch (error) {
        setServerError(error.response?.data?.message || 'Invalid email or password.');
      }
    }
  };

  return (
    <main>
      <div className="form-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h2 className="text-center">Member Login</h2>
        
        {serverError && (
            <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
                {serverError}
            </div>
        )}

        <form onSubmit={handleSubmit} className="mt-2">
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} />
                <span className="error-msg">{errors.email}</span>
            </div>

            <div className="form-group">
                <label htmlFor="password">Passcode</label>
                <input type="password" id="password" value={formData.password} onChange={handleChange} />
                <span className="error-msg">{errors.password}</span>
            </div>
            
            <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Login</button>
        </form>

        <p className="text-center" style={{ marginTop: '20px', fontSize: '14px' }}>
            Don't have a team yet? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Register here</Link>
        </p>
      </div>
    </main>
  );
}