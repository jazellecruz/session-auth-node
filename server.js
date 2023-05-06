require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("./src/config/passport.config");
const { connectToDb } = require("./src/db/db");
const {connectToRedis, redisStore } = require("./src/db/redis");
const config = require("./src/config/env.config")
const { isUserAuthenticated } = require("./src/middleware/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Establish db connection
connectToDb();

// Establish Redis Storage connection
connectToRedis();

// Configure and initialize session middleware
app.use(session({
  store: redisStore,
  secret: config.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true,
    secure: false,  
    httpOnly: false, 
    maxAge: 1000 * 60 * 10,
  },
}));

// Initialize passport for authenticating requests 
app.use(passport.initialize());
app.use(passport.session());

// Main routes
app.get("/", (req, res) => {
  res.send("Implementation of Session-based authentication using Passport.js for node apps.");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async(req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/login", 
    successRedirect: "/secret"})(req, res, next);
});

app.get("/logout", (req, res) => {
  req.logout(err => {
    if(err) {
      return next(err); 
    }
    res.redirect("/login");
  });
});

app.get("/secret", isUserAuthenticated, (req, res) => {
  console.log(req.session)
  res.render("secret");
});

// Wildcard route
app.get("*", (req, res)=> {
  res.status(404).send("No matching url found.")
});

app.listen(8000, () => {
  console.log("Howdy from port 8000! 🤠");
});


//resources for understanding passport auth flow
// http://toon.io/understanding-passportjs-authentication-flow/