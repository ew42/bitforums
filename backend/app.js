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
const conversationAPI = require('./routes/api/conversationAPI.js');
const validateTokenAPI = require('./routes/api/validateTokenAPI.js');

const app = express();

app.use(logger);
app.use(cors({
  origin: ['http://localhost:80', 'http://localhost:3000', 'https://bitforums.org'],
  credentials: true
}));
app.use(express.json());

//public routes
app.use('/api/register', registerUserAPI);
app.use('/api/login', loginUserAPI);
app.use('/api/post', postAPI);
app.use('/api/forum', forumAPI);
app.use('/api/conversation', conversationAPI);
app.use('/api/validate', validateTokenAPI);

// Then static files and catch-all route
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Static files and catch-all route for client-side routing
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', index);

module.exports = app;
