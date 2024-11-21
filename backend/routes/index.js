const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', '..', 'frontend', 'build', 'index.html');
  console.log(`${new Date().toISOString()} - ${req.url} - ${indexPath}`);
  res.sendFile(indexPath);
});

module.exports = router;
