const router = require("express").Router();

router.get("/login", (req, res) => {
  res.send("Hello from oauth login!")
});

router.post("/login", (req, res) => {
  console.log(req.body);
});

module.exports = router;