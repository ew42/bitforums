const app = require('./app.js');
const http = require('http');

const port = 80;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening at localhost:${port}`);
});
