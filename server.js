const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/api/fast-list', (req, res, next) => {
  res.end('fast-list');
});

app.get('/api/slow-list', (req, res, next) => {
  setTimeout(() => {
    res.end('slow-list');
  }, 1500);
});

app.listen(3000);
