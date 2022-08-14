const express = require('express')
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const post = 3000;
const uri = process.env.DB_CONNECT;
const routerAuth = require('./routes/auth-router');
const routetProfile = require('./routes/profile-route');
const routetPlease = require('./routes/please');
const passport = require('passport');

require('./config/passport');
const session = require("express-session");
const flash = require('connect-flash');


//middleware
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
})
app.use('/auth', routerAuth);
app.use('/profile', routetProfile);
app.use('/please', routetPlease);


//連結資料庫
mongoose
  .connect(uri)
  .then(() => {
    console.log("資料庫連接成功");
  })
  .catch((e) => {
    console.log("資料庫連接失敗");
    console.log(e);
  });

//request router
app.get("/", (req, res) => {
  res.render('index', { user: req.user });
});

app.listen(post, () => {
  console.log("run server");
});
