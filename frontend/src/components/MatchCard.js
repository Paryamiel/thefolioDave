// src/components/MatchCard.js
import React, { useState } from 'react';
import axios from 'axios'; // 1. Don't forget to import axios!

export default function MatchCard({ match }) {
  const authorName = match.author?.ign || match.author || "Unknown Player";

  const displayDate = match.createdAt 
    ? new Date(match.createdAt).toLocaleDateString() 
    : match.date; 

  // 2. Setup state for our comments and the new comment input
  const [comments, setComments] = useState(match.comments || []);
  const [newComment, setNewComment] = useState('');

  // 3. Grab user info to check if they are logged in
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // 4. Handle sending the comment to the backend
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) return alert("Please login to comment!");
    if (newComment.trim() === '') return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // Must be logged in to comment
        },
      };

      // Send the comment text and the user's IGN
      const { data } = await axios.post(
        `http://localhost:5000/api/posts/${match._id}/comments`, 
        { text: newComment, ign: userInfo.ign }, 
        config
      );

      // The backend returns the fully updated post, so we just set our comments array to match!
      setComments(data.comments);
      setNewComment(''); // Clear the input box
    } catch (error) {
      alert(error.response?.data?.message || "Failed to post comment");
    }
  };

  return (
    <div style={{ 
        border: '1px solid var(--primary-color)', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '15px', 
        textAlign: 'left',
        background: 'var(--card-bg-light)'
    }}>
        {/* Header: Author, Team Name, and Date */}
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                @{authorName}
            </span>
            
            {match.teamName && (
                <span style={{ 
                    fontSize: '12px', 
                    background: 'var(--accent-color)', 
                    color: '#000', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    marginLeft: '10px',
                    fontWeight: 'bold'
                }}>
                    [{match.teamName}]
                </span>
            )}

            <span style={{ fontSize: '12px', color: '#64748b', float: 'right' }}>
                {displayDate}
            </span>
        </div>
        
        {/* Match Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <strong>Hero:</strong> {match.hero} <br/>
                <strong>Role:</strong> {match.role}
            </div>
            <div style={{ textAlign: 'right' }}>
                <strong>KDA:</strong> {match.kda} <br/>
                <strong style={{ color: match.result === 'Victory' ? '#16a34a' : '#dc2626' }}>
                    {match.result}
                </strong>
            </div>
        </div>

        {/* --- NEW COMMENT SECTION --- */}
        <div style={{ marginTop: '15px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#64748b' }}>Comments</h4>
            
            {/* Display Existing Comments */}
            {comments.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 10px 0', fontSize: '13px' }}>
                    {comments.map((c, index) => (
                        <li key={index} style={{ marginBottom: '6px', background: 'rgba(0,0,0,0.05)', padding: '6px', borderRadius: '4px' }}>
                            <strong style={{ color: 'var(--primary-color)' }}>@{c.ign}:</strong> {c.text}
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No comments yet. Be the first!</p>
            )}

            {/* Comment Input Form */}
            {userInfo ? (
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '5px' }}>
                    <input 
                        type="text" 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        placeholder="Add a comment..." 
                        style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                    <button type="submit" style={{ padding: '6px 12px', fontSize: '13px' }}>Post</button>
                </form>
            ) : (
                <p style={{ fontSize: '12px', color: '#dc2626' }}>Log in to leave a comment.</p>
            )}
        </div>
    </div>
  );  
}