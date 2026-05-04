const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Required for Render's proxy (HTTPS detection)
app.set('trust proxy', 1);

// Serve all static files from project root
app.use(express.static(__dirname, {
  index: 'index.html',
}));

// Fallback: serve index.html for any unrecognized route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Hub running on port ${PORT}`);
});
