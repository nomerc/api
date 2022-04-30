const express = require("express");
const passport = require("passport");
let TwitterStrategy = require("passport-twitter").Strategy;
const router = express.Router();
const { auth } = require("../controllers/authController");

let userProfile;

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
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

router.get("/", passport.authenticate("twitter"));

router.get(
  "/callback",
  passport.authenticate("twitter", { failureRedirect: "error" }),
  auth
);

router.get("/error", (req, res) => res.send("error logging in"));

module.exports = router;
