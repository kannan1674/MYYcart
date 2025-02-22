const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const route = require('./router/allRoutes'); // Ensure that this route exists
const errorMiddleware = require('./middleware/error'); // Ensure this middleware exists
const DB = require('./config/database'); // Database connection logic

dotenv.config({ path: path.resolve(__dirname, 'config/config.env') });

const app = express();

// Database Connection
DB(); // Connect to your database (e.g., MongoDB)

app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser()); // To parse cookies in requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serving uploaded files

// CORS setup (update the frontend URL to match your production setup)
app.use(cors({
  origin: 'http://localhost:5173', // Change to your React app's URL in production if needed
  credentials: true, // Allows cookies to be sent across different domains
}));

// API Routes
app.use('/api', route);

// Serving React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build'))); // Path to your built React app

  // Send React's index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html')); // Correct path to index.html
  });
}

// Error handling middleware (ensure this is catching errors globally)
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 8000;  // Use port from env or default to 8000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Successfully Running on Port ${PORT} in ${process.env.NODE_ENV} mode`);
});
