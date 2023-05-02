
const isUserAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/session/login")
  }
}


module.exports = {isUserAuthenticated}
