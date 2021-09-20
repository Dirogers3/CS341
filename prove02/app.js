const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const routes = require('./routes/routes.js');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.use((req, res, next) => {
    res.status(404).send('<h1>404 Page not found.</h1>')
})

const server = http.createServer()
var port_number = server.listen(process.env.PORT || 3000);
app.listen(port_number);