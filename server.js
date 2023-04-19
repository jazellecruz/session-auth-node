require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const app = express();
const { connectDb, connection } = require("./src/db/db");
const sessionAuth = require("./src/routes/route.session");
const tokenAuth = require("./src/routes/route.token");
const oauthAuth = require("./src/routes/route.oauth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Establish db connection
connectDb();

// Main routes
app.use("/session", sessionAuth);
app.use("/token", tokenAuth);
app.use("/oauth", oauthAuth );

app.get("/", (req, res) => {
  res.send("Implementation of Token-based, Session-based, and OAuth-based authentication for node apps.");
});

app.get("*", (req, res)=> {
  res.status(404).send("No matching url found.")
});

// app.post("/create-user", async(req, res) => {
//   try {
//     let hashedPassword = await bcrypt.hash(req.body.password, 10);
//     let newUser = await connection.promise().query(`INSERT INTO users (username, password, dateCreated) VALUES ("${req.body.username}", "${hashedPassword}", CURDATE());`)
//     res.send(newUser[0])
//   } catch(err) {
//     res.send(err)
//   }
// });

app.listen(8000, () => {
  console.log("Howdy from port 8000! 🤠");
});
