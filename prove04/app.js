const path = require('path');
const express = require('express');
const cors = require('cors') // Place this with other requires (like 'path' and 'express')
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');

const User = require('./models/user');
const routes = require('./routes/routes.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));



app.use((req, res, next) => {
  User.findById('616112d52e7fe98978bdae96')
  .then(user=>{
    req.user = user;
    next();
  })
  .catch(err=>{
    console.log(err);
  })
})



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
    family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://client:asdfqwer@cluster0.w2mlm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {
    User.findOne().then(user =>{
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    })
      console.log("Connected to Mongo Server.");
//    This should be your user handling code implement following the course videos
  })
  .catch(err => {
    console.log(err);
  });