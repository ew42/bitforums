const https = require('https');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const express = require('express');
const app = require('./app.js');
require('dotenv').config();

const certPath = '/etc/letsencrypt/live/bitforums.org/fullchain.pem';
const keyPath = '/etc/letsencrypt/live/bitforums.org/privkey.pem';

const options = {
	cert: fs.readFileSync(certPath),
	key: fs.readFileSync(keyPath)
};

const logStream = fs.createWriteStream(path.join(__dirname, 'log', 'server.log'), { flags: 'a'});

function log(message) {
	const timestamp = new Date().toISOString();
	const logMessage = `${timestamp} - ${message}\n`;
	console.log(logMessage);
	logStream.write(logMessage);
}

const httpsPort = 443;
const httpPort = 80;

const mongoURI = process.env.MONGODB_URI;

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

//Create HTTPS server
const httpsServer = https.createServer(options, app);
httpsServer.listen(httpsPort, () => {
	log(`Https Server now running on ${httpsPort}`);
});

//HTTP to HTTPS server redirect
http.createServer((req, res) => {
	log(`HTTP to HTTPS redirect on port:${httpPort}`);
	res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
	res.end();
}).listen(httpPort, () => {
	log(`Http to Https redirect server running on port:${httpPort}`);
});

process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`);
  log('Server will attempt to continue running.');
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  log('Server will attempt to continue running.');
});
