// src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', confirmPassword: '', dob: '', level: '', terms: false
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let newErrors = {};

    // Local Validation
    if (formData.name.trim() === "") { newErrors.name = "Team name is required."; isValid = false; }
    if (formData.username.length < 5) { newErrors.username = "Captain IGN must be at least 5 characters."; isValid = false; }
    if (!formData.email.includes('@')) { newErrors.email = "Valid email is required."; isValid = false; }
    if (formData.password.length < 8) { newErrors.password = "Passcode must be at least 8 characters."; isValid = false; }
    if (formData.password !== formData.confirmPassword || formData.confirmPassword === "") { newErrors.confirmPassword = "Passcodes do not match."; isValid = false; }
    if (!formData.dob) { newErrors.dob = "Please select the date."; isValid = false; }
    if (!formData.level) { newErrors.level = "Please select a rank level."; isValid = false; }
    if (!formData.terms) { newErrors.terms = "You must agree to the rules."; isValid = false; }

    setErrors(newErrors);

    if (isValid) {
      try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        
        // Map frontend fields to match our new backend Schema perfectly
        const body = { 
            teamName: formData.name, 
            ign: formData.username, 
            email: formData.email,
            password: formData.password,
            dob: formData.dob,
            level: formData.level,
            terms: formData.terms
        };

        // Send to MongoDB!
        const response = await axios.post('http://localhost:5000/api/users/register', body, config);
        
        // Save login session
        localStorage.setItem('userInfo', JSON.stringify(response.data));

        alert("Registration successful! See you in the arena.");
        navigate('/home'); // Send them to the community feed

      } catch (error) {
        setServerError(error.response?.data?.message || 'Something went wrong during registration.');
      }
    }
  };

  return (
    <main>
      <div className="form-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="text-center">Local Tournament Registration</h2>
        
        {serverError && (
            <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
                {serverError}
            </div>
        )}

        <form onSubmit={handleSubmit} className="mt-2">
            <div className="form-group">
                <label htmlFor="name">Team Name</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} />
                <span className="error-msg">{errors.name}</span>
            </div>
            <div className="form-group">
                <label htmlFor="username">Captain IGN (Min 5 chars)</label>
                <input type="text" id="username" value={formData.username} onChange={handleChange} />
                <span className="error-msg">{errors.username}</span>
            </div>
            {/* Added Email Field for Login Capabilities */}
            <div className="form-group">
                <label htmlFor="email">Captain Email</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} />
                <span className="error-msg">{errors.email}</span>
            </div>
            <div className="form-group">
                <label htmlFor="password">Secret Passcode (Min 8 chars)</label>
                <input type="password" id="password" value={formData.password} onChange={handleChange} />
                <span className="error-msg">{errors.password}</span>
            </div>
            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Passcode</label>
                <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                <span className="error-msg">{errors.confirmPassword}</span>
            </div>
            <div className="form-group">
                <label htmlFor="dob">Date of Registration</label>
                <input type="date" id="dob" value={formData.dob} onChange={handleChange} />
                <span className="error-msg">{errors.dob}</span>
            </div>
            <div className="form-group">
                <label htmlFor="level">Average Squad Rank</label>
                <select id="level" value={formData.level} onChange={handleChange}>
                    <option value="">--Select Rank--</option>
                    <option value="epic">Epic/Legend</option>
                    <option value="mythic">Mythic</option>
                    <option value="glory">Mythical Glory</option>
                </select>
                <span className="error-msg">{errors.level}</span>
            </div>
            <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="checkbox" id="terms" checked={formData.terms} onChange={handleChange} style={{ width: 'auto' }} />
                <label htmlFor="terms" style={{ margin: 0, fontWeight: 'normal' }}>Agree to Fair Play Rules</label>
            </div>
            <span className="error-msg" style={{ marginBottom: '15px', display: 'block' }}>{errors.terms}</span>
            
            <button type="submit" style={{ width: '100%' }}>Register Team</button>
        </form>
      </div>
    </main>
  );
}