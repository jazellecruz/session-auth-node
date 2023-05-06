# How to Implemement Session-based Authentication Using Passport.js on Node Apps

A **simple** and **straight-forward** guide on how to implement session-based authentication using Passport.js on Node applications. 

*NOTE*: This guide is based on **MY** research on how Passport works, so feel free to inform me if there are any corrections needed.


## Dependencies

Install the necessary dependencies below. Use any type of database you like for storing your users. I chose MySQL for this. 

+ [passport](https://www.npmjs.com/package/passport)
+ [passport-local](https://www.npmjs.com/package/passport-local)
+ [express-session](https://www.npmjs.com/package/express-session)
+ [redis](https://www.npmjs.com/package/redis)
+ [connect-redis](https://www.npmjs.com/package/connect-redis)
+ [bcrypt](https://www.npmjs.com/package/bcrypt) 
+ [express](https://www.npmjs.com/package/express)
+ [dotenv](https://www.npmjs.com/package/dotenv)
+ [ejs](https://www.npmjs.com/package/ejs)

## Implementation 

Setting up an express server and creating ejs files will be skipped to focus on Passport. See here on how to initialize a redis storage for our sessions.

1. Import necessary Passport modules.

```js
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
```

2. Add middlewares that will parse JSON data from the request body and make it available in the `req.body` object.

```js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

3. Add the `express-session` middleware that generates a sessionID and establishes a session. To configure session, see the official [documentaion](https://www.npmjs.com/package/express-session).
```js
app.use(session({
  store: redisStore,
  secret: "Supercalifragilisticexpialidocious",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true,
    secure: false,  
    httpOnly: false, 
    maxAge: 1000 * 60 * 10,
  }
}));
```

The `express-session` middleware creates a session and checks if there is a sessionID present in the req. If there is a session ID present in the request, the middleware uses it to retrieve the user's session data from the session storage. Then, the session data is attached to the `req.session` object for the next middlewares to use. If there is no sessionID present in the request, the middleware generates a sessionID (`req.sessionID`) and creates a new session (`req.session`) along with some functions for the session that will be used by Passport later.

*NOTE*: **ALL** requests (yes, including the initial ones) go through the `express-session` middleware.

4. Add middleware that initializes Passport authentication. 

```js
app.use(passport.initialize());
```

`passport.initilize()` adds a passport instance (`req._passport`) to our req object. (The versions prior to v0.5.1, `req.login()` and `req.logout()` were set up in `passport.session` middleware, but in newer versions, the set up has been moved to `passport.authenticate`.)

*NOTE*: **ALL** requests (yes, including the initial ones) go through the `passport.initialize()` middleware.

5. Add `passport.session` middleware. It deserializes the user from the session(`req.session.passport.user`) and calls and passes user to `deserializeUser` to look for the user in the database. 

```js
app.use(passport.session());
```

6. Define your custom local strategy, `serializeUser()`, and `deserializeUser()` functions:

```js
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
```

```js
passport.serializeUser((user, done) => {
  try {
    done(null, user.username);
  } catch (err) {
    done(err);
  }
});
```

```js
passport.deserializeUser(async(username, done) => {
  const user = await connection.promise().query("SELECT username FROM users WHERE username = ?", [username]);
  if (!user[0].length) {
    done(null, false);
  }
  done(null, user);
});

```
## KEY TAKEAWAYS
+ "session" is maintained through the req object.