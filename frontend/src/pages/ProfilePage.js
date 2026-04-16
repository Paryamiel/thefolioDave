import React, { useState } from 'react';
import axios from 'axios';
import { User, Shield, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  // State for the IGN input form
  const [ign, setIgn] = useState(userInfo ? userInfo.ign : '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!userInfo) {
      return (
          <main className="flex-center">
              <h2>Please log in to view your profile.</h2>
          </main>
      );
  }

  const handleUpdate = async (e) => {
      e.preventDefault();
      try {
          const config = {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${userInfo.token}`,
              },
          };

          // Send the new IGN to the backend
          const { data } = await axios.put('http://localhost:5000/api/users/profile', { ign }, config);
          
          // Update the local storage with the new IGN so the whole app knows!
          localStorage.setItem('userInfo', JSON.stringify(data));
          
          setSuccess(true);
          setError('');
          setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
      } catch (err) {
          setError(err.response?.data?.message || 'Failed to update profile');
          setSuccess(false);
      }
  };

  return (
    <main>
      <section className="card text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2><User size={28} /> Captain Dashboard</h2>
        <p>Manage your identity on the battlefield.</p>

        <div style={{ background: 'rgba(0,0,0,0.05)', padding: '20px', borderRadius: '8px', marginTop: '20px', textAlign: 'left' }}>
            
            {/* Read-Only Team Badge */}
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={24} color="var(--primary-color)" />
                <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>SQUAD ALLEGANCE</p>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>[{userInfo.teamName}]</p>
                </div>
            </div>

            {/* Editable Profile Form */}
            <form onSubmit={handleUpdate}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Account Email</label>
                    <input type="email" value={userInfo.email} readOnly style={{ background: '#e2e8f0', cursor: 'not-allowed', color: '#64748b' }} />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>In-Game Name (IGN)</label>
                    <input 
                        type="text" 
                        value={ign} 
                        onChange={(e) => setIgn(e.target.value)} 
                        placeholder="Enter your MLBB IGN" 
                        required 
                    />
                </div>

                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                {success && <p style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={18} /> Profile Updated Successfully!</p>}

                <button type="submit" style={{ width: '100%' }}>Update IGN</button>
            </form>
        </div>
      </section>
    </main>
  );
}