const express = require('express');
const fs = require('fs');
const path = require('path');
const index = require('./routes/index.js');
const logger = require('./middleware/logger.js');

const app = express();

app.use(logger);
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('/', index);

module.exports = app;
