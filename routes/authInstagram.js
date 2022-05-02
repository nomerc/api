const express = require("express"),
  passport = require("passport"),
  InstagramStrategy = require("passport-instagram").Strategy,
  router = express.Router(),
  { auth, verify } = require("../controllers/authController");

passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
    },
    verify
  )
);

router.get("/", passport.authenticate("instagram"));

router.get(
  "/callback",
  passport.authenticate("instagram", {
    successRedirect: "../success",
    failureRedirect: "../error",
  })
);

module.exports = router;
