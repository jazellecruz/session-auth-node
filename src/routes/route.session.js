const router = require("express").Router();
const bcrypt = require("bcrypt")
const { connection } = require("../db/db");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async(req, res) => {
  let {username, password} = req.body

  try{
    let foundUser = await connection.promise().execute("SELECT username, password FROM users WHERE username = ?", [username]);
    
    if (!foundUser[0].length){
      res.status(404).send(`No "${username}" user was found.`)
    } else {
      let isMatch = await bcrypt.compare(password, foundUser[0][0].password);
      if(!isMatch) {
        res.sendStatus(401);
      } else {
        res.send("Yay! We found a user!")
      }
    }
  } catch(err) {
    throw err
  }

});

module.exports = router;