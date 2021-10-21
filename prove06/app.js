const path = require('path');

const express = require('express');
const cors = require('cors') // Place this with other requires (like 'path' and 'express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();

const errorController = require('./controllers/error');
const User = require('./models/user');
const http = require('http');

const MONGODB_URI = "mongodb+srv://client:asdfqwer@cluster0.w2mlm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf()

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}))

app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user=>{
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  })
  .catch(err=>{
    throw new Error(err);
  })
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

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
      console.log("Connected to Mongo Server.");
//    This should be your user handling code implement following the course videos
  })
  .catch(err => {
    console.log(err);
  });