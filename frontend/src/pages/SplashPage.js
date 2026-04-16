import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

export default function SplashPage() {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Finding Match...");
  const [fadeOut, setFadeOut] = useState(false);
  
  const navigate = useNavigate(); // 2. Initialize the navigation hook

  useEffect(() => {
    // 3. THE FIX: Check if they've already seen the splash screen this session!
    if (sessionStorage.getItem('splashSeen')) {
        navigate('/home'); // Instantly skip to the Home Feed
        return; // Stop the rest of the animation code from running
    }

    // 1. Matrix Canvas Effect
    const canvas = canvasRef.current;
    if (!canvas) return; // Quick safety check
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const letters = "SAVAGE MANIAC LEGEND MYTHIC GLORY".split("");
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const matrixInterval = setInterval(() => {
        ctx.fillStyle = "rgba(11, 17, 32, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#3b82f6";
        ctx.font = fontSize + "px monospace";
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }, 50);

    // 2. Progress Bar Logic
    const steps = ["Finding Match...", "Banning Phase...", "Selecting Heroes...", "Welcome to Mobile Legends!"];
    let width = 0;
    
    const progressInterval = setInterval(() => {
        width += Math.random() * 15;
        if (width >= 100) {
            width = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                setFadeOut(true);
                // 4. Mark the splash screen as seen in sessionStorage!
                sessionStorage.setItem('splashSeen', 'true'); 
                
                // 5. Use React's navigate instead of window.location for a smooth SPA transition
                setTimeout(() => navigate('/home'), 500); 
            }, 500);
        }
        setProgress(width);
        const stepIdx = Math.min(Math.floor((width/100) * steps.length), steps.length - 1);
        setStatus(steps[stepIdx]);
    }, 300);

    // Cleanup intervals when component unmounts
    return () => {
        clearInterval(matrixInterval);
        clearInterval(progressInterval);
    };
  }, [navigate]); // Add navigate to dependency array

  return (
    <div style={{ margin: 0, padding: 0, height: '100vh', background: '#0b1120', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#fff', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, opacity: 0.3 }}></canvas>
      
      <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '40px', borderRadius: '15px', border: '1px solid #3b82f6', textAlign: 'center', width: '350px', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)', zIndex: 2, transition: 'opacity 0.5s', opacity: fadeOut ? 0 : 1 }}>
          <h2>Welcome to the Land of Dawn</h2>
          <p style={{ marginTop: '10px', color: '#94a3b8' }}>{status}</p>
          <div style={{ width: '100%', height: '10px', background: '#334155', borderRadius: '5px', marginTop: '20px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: '#fbbf24', transition: 'width 0.3s' }}></div>
          </div>
      </div>
    </div>
  );
}