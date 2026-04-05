// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // <-- Add this

// Load environment variables
dotenv.config();

// Connect to Database
connectDB(); 

// Initialize Express
const app = express();

// Middleware
app.use(cors()); // Allow requests from React
app.use(express.json()); // Allow server to accept JSON data

// Routes
app.use('/api/users', require('./routes/authRoutes')); // <-- ADDED THIS LINE
app.use('/api/posts', require('./routes/postRoutes'));     // <--- New
app.use('/api/admin', require('./routes/adminRoutes'));    // <--- New
//app.use('/api/contact', require('./routes/contactRoutes')); // <--- New
app.use('/api/invites', require('./routes/inviteRoutes'));

// Simple Test Route
app.get('/', (req, res) => {
    res.send('MLBB Journey Backend API is running...');
});

// Define the Port
const PORT = process.env.PORT || 5000;

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});