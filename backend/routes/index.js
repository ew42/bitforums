const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'build', 'index.html'));
});

module.exports = router;
