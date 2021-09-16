const http = require('http');

// import the routes
const routes = require('./prove01-routes');

const server = http.createServer(routes);

// using localhost:3000
server.listen(3000);
