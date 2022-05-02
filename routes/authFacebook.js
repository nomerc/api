const express = require("express"),
  passport = require("passport"),
  FacebookStrategy = require("passport-facebook").Strategy,
  router = express.Router(),
  { auth, verify } = require("../controllers/authController");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    verify
  )
);

router.get("/", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: "../success",
    failureRedirect: "../error",
  })
);

module.exports = router;
