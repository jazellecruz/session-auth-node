const express = require("express");
const app = express();

const session = require("./routes/route.session");
const token = require("./routes/route.token");
const oauth = require("./routes/route.oauth");

app.use(express.json());

app.use("/session", session);
app.use("/token", token);
app.use("/oauth", oauth );

app.get("/", (req, res) => {
  res.send("Implementation of Token-based, Session-based, and OAuth-based authentication for node apps.");
});

app.listen(8000, () => {
  console.log("Howdy from port 8000! 🤠");
});
