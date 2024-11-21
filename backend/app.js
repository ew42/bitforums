const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('/', (req, res) => {
  console.log("Fn");
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

module.exports = app;
