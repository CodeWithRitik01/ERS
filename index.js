const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = 8000;

const db = require('./config/mongoose');

const app = express();
const expressLayouts = require('express-ejs-layouts');

app.use(cookieParser());

// session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local');

 const MongoStore = require('connect-mongo')(session);

 const flash = require('connect-flash');
 const flashMiddleware = require('./config/flashMiddleware');

const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('./assets'));

app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(
  session({
    name: 'ERS',
    secret: 'Yupyo',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge:(1000 * 60 * 100)
    },
    store:new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: 'disabled',
      },
      function (err) {
        console.log(err || 'connect mongodb setup ok');
      }
    )
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(flashMiddleware.setFlash);

app.use('/', require('./routes'));
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in  the running the server : ${err}`);
  }
  console.log(`Server in running on port: ${port}`);
});
