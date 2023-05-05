# How to Implemement Session-based Authentication Using Passport.js on Node Apps

A **simple** and **straight-forward** guide on how to implement session-based authentication using Passport.js on Node applications. 
 
The flow of the authentication will also be explained along the way. Happy Reading :)


## Dependencies

Install the necessary dependencies below. Feel free to use any type of database you like for storing your users. I chose MySQL for this. 

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

3. Add the `express-session` middleware that generates a sessionID and establishes a session. 
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

The `express-session` middleware creates a unique ID for each user session, and it adds some functions related to sessions. These functions will be used later by Passport, after completing authentication and serialization. The middleware also checks if the user has an existing session ID in their request. If there is a session ID, the middleware uses it to retrieve the user's session data from the session storage. Then, the session data is attached to the `req.session` object for the next middlewares to use.

*NOTE*: **ALL** requests (yes, including the initial ones) go through the `express-session` middleware.
