const express = require("express"),
  passport = require("passport"),
  TwitterStrategy = require("passport-twitter").Strategy,
  router = express.Router(),
  { auth, verify } = require("../controllers/authController");

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    },
    verify
  )
);

router.get("/", passport.authenticate("twitter"));

router.get(
  "/callback",
  passport.authenticate("twitter", {
    successRedirect: "../success",
    failureRedirect: "../error",
  })
);

module.exports = router;
