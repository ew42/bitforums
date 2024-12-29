const express = require('express');
const fs = require('fs');
const path = require('path');
const index = require('./routes/index.js');
const cors = require('cors');
const logger = require('./middleware/logger.js');
const postAPI = require('./routes/api/postAPI.js');
const loginUserAPI = require('./routes/api/loginUserAPI.js');
const registerUserAPI = require('./routes/api/registerUserAPI');
const auth = require('./middleware/auth.js');
//const webhook = require('./routes/webhook.js');

const app = express();

app.use(logger);
app.use(cors({
  origin: ['http://localhost:80', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

//public routes
app.use('/api', registerUserAPI);
app.use('/api', loginUserAPI);

// Protected routes (auth required)
app.use('/api/post', auth, postAPI);

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('/', index);

module.exports = app;
