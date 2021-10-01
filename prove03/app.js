const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const errorController = require('./controllers/error');

const routes = require('./routes/routes.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin' , routes);

app.use(errorController.get404);

//added this for heroku purposes
const server = http.createServer()
var port_number = server.listen(process.env.PORT || 3000);
app.listen(port_number);