// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [invites, setInvites] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        // Kick them out if they aren't an admin!
        if (!userInfo || userInfo.role !== 'Admin') {
            setError('Access Denied: You do not have Admin privileges.');
            setLoading(false);
            return;
        }

        const fetchAdminData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };

                // Fetch everything at once
                const [usersRes, invitesRes, postsRes] = await Promise.all([
                    axios.get('/api/admin/users', config),
                    axios.get('/api/admin/invites', config),
                    axios.get('/api/posts') // Public route, but we need it to moderate
                ]);

                setUsers(usersRes.data);
                setInvites(invitesRes.data);
                setPosts(postsRes.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load dashboard data. Check your connection.');
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    // --- DELETE HANDLERS ---
    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`/api/admin/posts/${postId}`, config);
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            alert("Failed to delete post");
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.delete(`/api/admin/comments/${postId}/${commentId}`, config);
            
            // Update the specific post with its new comment list from the backend
            setPosts(posts.map(post => post._id === postId ? data : post));
        } catch (error) {
            alert("Failed to delete comment");
        }
    };

    // --- RENDER HELPERS ---
    if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#dc2626' }}><h2>{error}</h2></div>;
    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Dashboard...</div>;

    const tabStyle = (tabName) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        background: activeTab === tabName ? 'var(--primary-color)' : 'var(--nav-bg-light)',
        color: activeTab === tabName ? '#fff' : 'inherit',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold'
    });

    return (
        <main className="card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Admin Dashboard</h1>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Welcome to the control center, Commander.</p>

            {/* TAB NAVIGATION */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>Registered Users ({users.length})</button>
                <button style={tabStyle('invites')} onClick={() => setActiveTab('invites')}>Contact Forms ({invites.length})</button>
                <button style={tabStyle('posts')} onClick={() => setActiveTab('posts')}>Content Moderation</button>
            </div>

            {/* TAB 1: USERS */}
            {activeTab === 'users' && (
                <div>
                    <h3>Account Roster</h3>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {users.map(user => (
                            <div key={user._id} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <strong>{user.ign}</strong> <span style={{ color: '#64748b' }}>({user.email})</span>
                                    <br/>
                                    <small>Team: {user.teamName} | Level: {user.level}</small>
                                </div>
                                <div>
                                    <span style={{ padding: '4px 8px', background: user.role === 'Admin' ? '#dc2626' : '#16a34a', color: '#fff', borderRadius: '4px', fontSize: '12px' }}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 2: INVITES / CONTACT FORMS */}
            {activeTab === 'invites' && (
                <div>
                    <h3>Party Invites & Concerns</h3>
                    {invites.length === 0 ? <p>No messages yet.</p> : null}
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {invites.map(invite => (
                            <div key={invite._id} style={{ padding: '15px', border: '1px solid var(--accent-color)', borderRadius: '5px', background: 'var(--card-bg-light)' }}>
                                <div style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                    <strong>From:</strong> {invite.ign || 'Unknown'} <br/>
                                    <strong>Type:</strong> {invite.type || 'General'}
                                </div>
                                <p style={{ margin: 0, fontStyle: 'italic' }}>"{invite.message}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: CONTENT MODERATION (Posts & Comments) */}
            {activeTab === 'posts' && (
                <div>
                    <h3>Moderate Posts & Comments</h3>
                    {posts.length === 0 ? <p>No posts available.</p> : null}
                    {posts.map(post => (
                        <div key={post._id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <strong>@{post.author?.ign || post.author || 'Unknown'}</strong>
                                <button onClick={() => handleDeletePost(post._id)} style={{ background: '#dc2626', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                    Delete Post
                                </button>
                            </div>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                                Played <strong>{post.hero}</strong> in <strong>{post.role}</strong>. KDA: {post.kda} ({post.result})
                            </p>
                            
                            {/* Nested Comments Moderation */}
                            <div style={{ background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '5px' }}>
                                <strong style={{ fontSize: '12px', color: '#64748b' }}>Comments:</strong>
                                {(!post.comments || post.comments.length === 0) ? (
                                    <p style={{ fontSize: '12px', margin: '5px 0 0 0' }}>No comments.</p>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '5px 0 0 0' }}>
                                        {post.comments.map(c => (
                                            <li key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '13px', borderBottom: '1px dashed #ccc', paddingBottom: '5px' }}>
                                                <span><strong>@{c.ign}:</strong> {c.text}</span>
                                                <button onClick={() => handleDeleteComment(post._id, c._id)} style={{ background: 'transparent', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', padding: '2px 5px' }}>
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}