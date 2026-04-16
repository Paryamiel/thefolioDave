import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Crosshair, Shield, Swords, Scroll, History, PlusCircle } from 'lucide-react';
import MatchCard from '../components/MatchCard'; 

export default function HomePage() {
  const [matches, setMatches] = useState([]); 
  const [showForm, setShowForm] = useState(false);
  
  // 1. Check if user is logged in
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // 2. Initialize formData. If userInfo exists, auto-fill the teamName
  const [formData, setFormData] = useState({ 
      teamName: userInfo ? userInfo.teamName : '',
      hero: '', 
      role: 'Exp Lane', 
      kda: '', 
      result: 'Victory' 
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/posts');
        setMatches(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) return alert("Please login to post!");

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('http://localhost:5000/api/posts', formData, config);
      
      setMatches([data, ...matches]);
      
      // Close form and reset (keeping the auto-filled team name intact!)
      setShowForm(false);
      setFormData({ teamName: userInfo.teamName, hero: '', role: 'Exp Lane', kda: '', result: 'Victory' });
      
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <main>
      {/* SECTION 1: Personal Introduction */}
      <section className="card flex-center" style={{ flexDirection: 'column', textAlign: 'center' }}>
        <h1>My Mobile Legends Adventure</h1>
        <p>From Warrior to Mythical Immortal. This is a showcase of my mains, my win rates, and my journey.</p>
        <img src="images/homeHero.jpg" alt="Main Gaming Setup" className="hero-img mt-2" />
        
        <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'center' }}>
          <li><Crosshair size={20} /> Fighter Main</li>
          <li><Shield size={20} /> Tank Flex</li>
          <li><Swords size={20} /> 60% Win Rate</li>
        </ul>
      </section>

      {/* SECTION 2: Signature Roles */}
      <section className="card text-center">
        <h2><Swords size={24} /> Signature Roles</h2>
        <div className="image-grid">
          <div className="grid-item">
            <img src="images/MLBB_LapuLapu.jpg" alt="Exp Laner" style={{ border: '2px solid var(--accent-color)' }} />
            <p className="mt-2"><strong>The Exp Laner</strong><br />Carrying the late game.</p>
          </div>
          <div className="grid-item">
            <img src="images/MLBB_Ruby.jpg" alt="Tanker" style={{ border: '2px solid var(--primary-color)' }} />
            <p className="mt-2"><strong>The Tanker</strong><br />Providing vision and setups.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: The Community Feed */}
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <h2><History size={24} /> Community Feed</h2>
            
            {/* The button is exclusive to logged-in users */}
            {userInfo && (
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px' }}
                >
                    <PlusCircle size={18} /> {showForm ? 'Cancel' : 'Post Match'}
                </button>
            )}
        </div>

        {/* The Dropdown Post Form */}
        {showForm && (
            <form onSubmit={handleSubmit} style={{ background: 'var(--nav-bg-light)', padding: '20px', borderRadius: '8px', marginTop: '15px', textAlign: 'left', border: '1px solid var(--primary-color)' }}>
                
                {/* AUTO-FILLED IDENTITIES (Read-Only) */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Captain IGN</label>
                        <input 
                            type="text" 
                            value={userInfo.ign} 
                            readOnly 
                            style={{ background: 'rgba(0,0,0,0.05)', color: '#64748b', cursor: 'not-allowed', fontWeight: 'bold' }} 
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Squad / Team</label>
                        <input 
                            type="text" 
                            value={formData.teamName} 
                            readOnly 
                            style={{ background: 'rgba(0,0,0,0.05)', color: '#64748b', cursor: 'not-allowed', fontWeight: 'bold' }} 
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Hero Played</label>
                        <input type="text" id="hero" value={formData.hero} onChange={handleChange} required placeholder="e.g. Chou" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Role</label>
                        <select id="role" value={formData.role} onChange={handleChange}>
                            <option value="Exp Lane">Exp Lane</option>
                            <option value="Gold Lane">Gold Lane</option>
                            <option value="Mid Lane">Mid Lane</option>
                            <option value="Roam">Roam</option>
                            <option value="Jungler">Jungler</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label>K/D/A</label>
                        <input type="text" id="kda" value={formData.kda} onChange={handleChange} required placeholder="e.g. 5/2/8" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Result</label>
                        <select id="result" value={formData.result} onChange={handleChange}>
                            <option value="Victory">Victory</option>
                            <option value="Defeat">Defeat</option>
                        </select>
                    </div>
                </div>
                <button type="submit" style={{ width: '100%' }}>Submit Post</button>
            </form>
        )}

        <div style={{ marginTop: '20px' }}>
            {matches.length > 0 ? (
                matches.map((match) => (
                    <MatchCard key={match._id} match={match} />
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                    <p style={{ fontStyle: 'italic', color: '#64748b', marginBottom: '10px' }}>
                        The feed is currently quiet.
                    </p>
                    <p style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                        Database integration coming soon! Be the first to post when we go live.
                    </p>
                </div>
            )}
        </div>
      </section>

      {/* SECTION 4: Personal Season Goal */}
      <section className="card">
        <h2><Scroll size={24} /> Current Season Goal</h2>
        <p>Keeping my place at Mythical Immortal. Currently grinding through the solo queue trenches focusing on macro-management, map awareness, and objective control.</p>
      </section>
    </main>
  );
}