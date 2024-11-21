const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = require('./app.js');

const certPath = '/etc/letsencrypt/live/ew42.com/fullchain.pem';
const keyPath = '/etc/letsencrypt/live/ew42.com/privkey.pem';

const options = {
	cert: fs.readFileSync(certPath),
	key: fs.readFileSync(keyPath)
}

const logStream = fs.createWriteStream(path.join(__dirname, 'log', 'server.log'), { flags: 'a'});

function log(message) {
	const timestamp = new Date().toISOString();
	const logMessage = `${timestamp} - ${message}\n`;
	console.log(logMessage);
	logStream.write(logMessage);
}

const httpsPort = 443;
const httpPort = 80;

const httpsServer = https.createServer(options, app);
httpsServer.listen(httpsPort, () => {
	log(`Https Server now running on ${httpsPort}`);
});

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
