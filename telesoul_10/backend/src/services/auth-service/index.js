const express = require('express');

const app = express();

app.get('/health', (req, res) => {
  res.send('ok');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Auth service listening on port ${PORT}`);
});
