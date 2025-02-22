const app = require('./app');
const path = require('path');
const DB = require('./config/database');

// Initialize the database connection
DB();

// Start the server and listen on the specified port and host (0.0.0.0 for external access)
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server Successfully Run on Port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});
