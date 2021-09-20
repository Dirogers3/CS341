const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

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




app.listen(3000);