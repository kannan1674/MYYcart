const app = require('./app');
const path = require('path');
const DB = require('./config/database');

// Initialize the database connection
DB();
const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Successfully Run on Port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
