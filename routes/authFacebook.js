const express = require("express");
const passport = require("passport");
let FacebookStrategy = require("passport-facebook").Strategy;
const router = express.Router();
const { auth } = require("../controllers/authController");

let userProfile;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

router.get("/success", (req, res) => {
  res.render("pages/success", { user: userProfile });
});

router.get("/", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", { failureRedirect: "error" }),
  auth
);

router.get("/error", (req, res) => res.send("error logging in"));

module.exports = router;
