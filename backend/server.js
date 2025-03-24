// Import dependencies
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/db'); 
const http = require('http');
require('dotenv').config();
const applicationRoutes = require('./routes/applicationRoutes');

// Create the Express app
const app = express();

// Middleware setup
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
}));

app.use(express.json()); 
app.use(cookieParser());

// Routes
app.get('/', (req, res) => res.send('My Backend'));
app.use('/applications', applicationRoutes);

// Database connection
const port = process.env.PORT || 5000;

dbConnect()
  .then(() => {
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
