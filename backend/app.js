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
const forumAPI = require('./routes/api/forumAPI.js');

const app = express();

app.use(logger);
app.use(cors({
  origin: ['http://localhost:80', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

//public routes
app.use('/api/register', registerUserAPI);
app.use('/api/login', loginUserAPI);
app.use('/api/post', postAPI);
app.use('/api/forum', forumAPI);

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('/', index);

module.exports = app;
