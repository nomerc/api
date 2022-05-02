const express = require("express"),
  passport = require("passport"),
  GithubStrategy = require("passport-github2").Strategy,
  router = express.Router(),
  { auth, verify } = require("../controllers/authController");

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    verify
  )
);

router.get("/", passport.authenticate("github"));

router.get(
  "/callback",
  passport.authenticate("github", {
    successRedirect: "../success",
    failureRedirect: "../error",
  })
);

module.exports = router;
