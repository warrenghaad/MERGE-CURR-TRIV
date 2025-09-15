const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'running', 
    message: 'MERGE-CURR-TRIV application is operational',
    timestamp: new Date().toISOString()
  });
});

// Start server - bind to 0.0.0.0 for Replit
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});