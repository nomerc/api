const express = require("express"),
  passport = require("passport"),
  User = require("../models/User");

LocalStrategy = require("passport-local").Strategy;

const router = express.Router();
const { auth } = require("../controllers/authController");

//to save username for future use(just in case)
// let userProfile

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      if (user.verifyPassword(password)) return done(null, user);
      return done(null, false);

      //same but with promises and async crypt(see User.js)
      //promise reject should be processed somewhere later...
      //   user
      //     .verifyPassword(password)
      //     .then((is_pass_correct) => {
      //       if (is_pass_correct) return done(null, user);
      //       return done(null, false);
      //     })
      //     .catch((e) => {
      //       return Promise.reject("Password verification error \n" + e);
      //     });
    });
  })
);

//these routes can be used in each authProvider file separately in case if different response from each provider is needed
//don't forget to change routes from ../sucess ../error to success and error correspondively

// router.get("/success", (req, res) => {
//   res.render("pages/success", { user: req.user });
// });

// router.get("/error", (req, res) =>
//   res.send("error logging in " + req.query.message)
// );

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect:
      "../error/?message=" + encodeURIComponent("wrong username/password"),
  }),
  function (req, res) {
    res.redirect("../success");
  }
);

router.post("/register", async function (req, res) {
  const user = new User({
    username: req.body.username,
    providerName: "local",
    hashed_password: req.body.password,
  });

  //if user with the name is already in db
  if (await User.usernameIsOccupied(user.username))
    return res.redirect(
      "../error/?message=" + encodeURIComponent("username unavailable")
    );

  user.save({ req, res });
});

// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
