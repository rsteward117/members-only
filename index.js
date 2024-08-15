var express = require('express');
const path = require("node:path");
const bodyParser = require("body-parser");
const membersonlyRouter = require("./routes/membersonly");
const authRouter = require("./routes/auth");
const session = require("express-session");
const passport = require("./passport");
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({ secret: process.env.secret, resave: false, saveUninitialized: false}));
app.use(passport.session());

//this is middleware that allows me to access the local variable from passport which is "user", and pass it through "currentuser" in my views.
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
  });




app.use("/", membersonlyRouter);
app.use("/auth", authRouter);

const PORT = 3000;
app.listen(PORT, ()=> console.log(`server listening on ${PORT}`));