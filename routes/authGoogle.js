const express = require("express"),
  passport = require("passport"),
  User = require("../models/User");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const router = express.Router();
const { auth, passport_strategy_cb } = require("../controllers/authController");

// let userProfile;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    // (userProfile, profile, done) => passport_strategy_cb
    // function (accessToken, refreshToken, profile, done) {
    //   userProfile = profile;
    //   //find by google id
    //   User.findOne({ username: profile.id }, function (err, user) {
    //     if (err) {
    //       return done(err);
    //     }
    //     if (!user) {
    //       user = new User({
    //         username: profile.id,
    //         password: "password",
    //       });
    //       user.save();
    //       return done(null, user);
    //     }

    //     return done(null, user);
    //   });

    //   // return done(null, userProfile);
    // }
    function (accessToken, refreshToken, profile, done) {
      // userProfile = profile;
      //find by provider id
      User.findOne({ providerId: profile.id }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            providerId: profile.id,
            providerName: "google",
            username: profile.displayName,
          });
          user.save();
          return done(null, user);
        }

        return done(null, user);
      });
    }
  )
);

router.get("/success", (req, res) => {
  // console.log(userProfile);
  // console.log(req.user);
  res.render("pages/success", { user: req.user });
});

router.get("/error", (req, res) => res.send("error logging in"));

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "success",
    failureRedirect: "error",
  })
  /* function (req, res) {
    // res.status(200).send(userProfile);
    // res.status(200).send(req.user);
  }
 */

  // auth
);

module.exports = router;
