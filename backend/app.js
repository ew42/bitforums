const express = require('express');
const fs = require('fs');
const path = require('path');
const index = require('./routes/index.js');

const app = express();

app.use(logger);
app.use('/', index);
app.use(express.static(path.join(__dirname, '../frontend/build')));

module.exports = app;
