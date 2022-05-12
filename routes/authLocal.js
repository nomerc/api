const express = require("express"),
  passport = require("passport"),
  User = require("../models/User");

LocalStrategy = require("passport-local").Strategy;

const router = express.Router();
const { auth } = require("../controllers/authController");

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
    //SSR
    // successRedirect: "../success",
    // failureRedirect:
    // "../error/?message=" + encodeURIComponent("wrong username/password"),
    failWithError: true,
  }),
  (req, res) => {
    //response for client
    res.status(200).send({
      _id: req.user._id,
      username: req.user.username,
      displayedName: req.user.displayedName,
      providerName: req.user.providerName,
    });
  },
  (err, req, res, next) => {
    console.log(err);
    next(err);
  }
);

router.post("/register", async (req, res, next) => {
  const user = new User({
    username: req.body.username,
    displayedName: req.body.displayed,
    providerName: "local",
    hashed_password: req.body.password,
  });

  try {
    await user.save({ req, res });
  } catch (err) {
    return next(err);
  }

  res.status(200).send({
    _id: req.user._id,
    username: req.user.username,
    displayedName: req.user.displayedName,
    providerName: req.user.providerName,
  }),
    (err, req, res, next) => {
      return next(err);
    };
});

// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
