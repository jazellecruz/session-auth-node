const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { connection } = require("../db/db");


const customLocalStrategy = new LocalStrategy(async(username, password, done) => {
  const foundUser = await connection.promise().query(
    `SELECT * FROM users WHERE username = ?;`, [username]);
  
  if(!foundUser[0].length) {
    return done(null, false, {message: "No user with credentials found."});
  };
 
  try {
    if(await bcrypt.compare(password, foundUser[0][0].password)) {
      return done(null, foundUser[0][0]);
    } else {
      return done(null, false, {message: "Invalid credentials."});
    }
  } catch(err) {
    return done(err)
  }

});

passport.serializeUser((user, done) => {
  try {
    done(null, user.username);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser(async(username, done) => {
  const user = await connection.promise().query("SELECT username FROM users WHERE username = ?", [username]);
  if (!user[0].length) {
    done(null, false);
  }
  done(null, user);
});


passport.use("local",customLocalStrategy);


/* SELF-NOTE: This exports the passport instance that is configured, 
not the actual passport itself. DON'T BE CONFUSED!!*/

module.exports = passport