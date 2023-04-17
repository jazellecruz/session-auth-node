const router = require("express").Router();

router.get("/login", (req, res) => {
  res.send("Hello from token login!")
});

router.post("/login", (req, res) => {
  console.log(req.body);
});

module.exports = router;