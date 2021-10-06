const path = require('path');
const express = require('express');
const cors = require('cors') // Place this with other requires (like 'path' and 'express')
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

const corsOptions = {
    origin: "https://lit-brushlands-46099.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://qQWSGRe7bjAkOKsr:jTiU5p6LqkptzAf@cluster0.w2mlm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {
    // This should be your user handling code implement following the course videos
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });