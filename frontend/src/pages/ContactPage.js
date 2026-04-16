import React, { useState } from 'react';
import axios from 'axios'; // 1. Import axios

export default function ContactPage() {
  // State for form inputs
  const [formData, setFormData] = useState({ ign: '', email: '', message: '' });
  // State for error messages
  const [errors, setErrors] = useState({ ign: '', email: '', message: '' });
  // State to control our popup modal
  const [showModal, setShowModal] = useState(false);

  // Updates state instantly as the user types
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    // Clear the specific error when they start typing
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  // 2. Make the submit handler async
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    let isValid = true;
    let newErrors = { ign: '', email: '', message: '' };

    if (formData.ign.trim() === "") { newErrors.ign = "Field required"; isValid = false; }
    
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!formData.email.match(emailPattern)) { newErrors.email = "Valid email required."; isValid = false; }
    
    if (formData.message.trim() === "") { newErrors.message = "Field required"; isValid = false; }

    setErrors(newErrors);

    // 3. Send the data to the backend!
    if (isValid) {
      try {
        // Send a POST request to our new route
        await axios.post('http://localhost:5000/api/invites', formData);
        
        // If successful, show the modal and clear the form
        setShowModal(true); 
        setFormData({ ign: '', email: '', message: '' }); 
      } catch (error) {
        console.error("Error sending invite:", error);
        alert(error.response?.data?.message || "Failed to send invite. Is the backend running?");
      }
    }
  };

  return (
    <main>
      <div className="form-container">
        <h2 className="text-center">Send a Party Invite</h2>
        <form onSubmit={handleSubmit} className="mt-2">
            <div className="form-group">
                <label htmlFor="ign">In-Game Name (IGN)</label>
                <input type="text" id="ign" value={formData.ign} onChange={handleChange} style={{ borderColor: errors.ign ? 'red' : '#ccc' }} />
                <span className="error-msg">{errors.ign}</span>
            </div>
            <div className="form-group">
                <label htmlFor="email">Player ID (Email Format)</label>
                <input type="text" id="email" value={formData.email} onChange={handleChange} style={{ borderColor: errors.email ? 'red' : '#ccc' }} />
                <span className="error-msg">{errors.email}</span>
            </div>
            <div className="form-group">
                <label htmlFor="message">Message / Role Preference</label>
                <textarea id="message" rows="4" value={formData.message} onChange={handleChange} style={{ borderColor: errors.message ? 'red' : '#ccc' }}></textarea>
                <span className="error-msg">{errors.message}</span>
            </div>
            <button type="submit" style={{ width: '100%' }}>Send Invite</button>
        </form>
      </div>

      {/* Conditional Rendering for the Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
            <div style={{ background: 'var(--card-bg-light)', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--text-light)'}}>Invite Sent! ⚔️</h2>
                <p style={{ color: 'var(--text-light)'}}>I will check my in-game mail shortly.</p>
                <button onClick={() => setShowModal(false)} className="mt-2">Close</button>
            </div>
        </div>
      )}
    </main>
  );
}