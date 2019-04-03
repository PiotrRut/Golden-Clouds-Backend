const express = require('express');
const mongoose = require('mongoose');
const User = require('./User');
const Bookings = require('./Bookings');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('cookie-session');
var flash = require('connect-flash');
const saltRounds = 10;

const app = express();
const port = 3001;


const db = mongoose.connect("mongodb://localhost:27017/GoldenCloudsDB", { useNewUrlParser: true });

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cookieParser());
app.use(flash());
app.use(session({
  name: "sadfasfd",
  keys: ["dsaf", "dfasdf"]
}));
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  (username, password, done) => {
    User.findOne( { email: username }, (err, user) => {
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, { message: "Invalid user id" });
      }
      if(!bcrypt.compareSync(password, user.password)) { return done(null, false, { message: "Invalid Password!" }); }
      return done(null, user);
    });
  }
))

app.post('/addUser', (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if(!err) {
      new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
      }).save();
      res.send("Success!");
    } else {
      res.send("Error!");
    }
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: "http://localhost:3000/",
  failureRedirect: "http://localhost:3000/signin",
  failureFlash: true

}));

app.get('/success', (req, res) => {
  res.send("Success!");
});

app.get('/fail', (req, res) => {
  res.send("Failed to authenticate");
})

app.post('/getUser', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!err && user) {
      if(user.password == req.body.password) {
        res.send("Success!");
      } else {
        res.send("Error! Invalid Password!");
      }
    } else {
      res.send("Failure!");
    }
  });
});

app.post('/addBooking', (req, res) => {
  const formatted = Date.parse(req.body.date + "T" + req.body.time + ":00.000");
  console.log(formatted);
  new Bookings({
    dateTime: formatted,
    serviceChosen: req.body.serviceChosen,
    preferences: req.body.preferences,
  }).save().then(() => {
    console.log("Save Success!");
    res.send("Added booking!");
  });
});


app.post('/isAuth', (req, res) => {
  res.type('json');
  console.log(req.session);
  if(!isEmpty(req.session.passport)) {
    res.send({ auth: true });
  } else {
    res.send({ auth: false });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
