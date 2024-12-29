const app = require('./app.js');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const port = 80;
const mongoURI = process.env.MONGO_URI;
console.log(mongoURI);

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB'); 
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.error('MongoDB disconnected');
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening at localhost:${port}`);
});
