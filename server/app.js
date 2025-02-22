const express = require('express');
const route = require('./router/allRoutes');
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, 'config/config.env') });

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.use(cors({
    origin: 'http://13.60.59.130:8000',
    credentials: true
  }));



// Other routes
app.use('/api', route);

if(process.env.NODE_ENV ==='production'){
  app.use(express.static(path.join(__dirname, '../frontend/build')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
})


}


// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
