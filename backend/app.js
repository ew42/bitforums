const express = require('express');
const fs = require('fs');
const path = require('path');
const index = require('./routes/index.js');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
app.use('/', index);

module.exports = app;
