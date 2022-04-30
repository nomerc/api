const express = require("express");
const passport = require("passport");
let GithubStrategy = require("passport-github2").Strategy;
const router = express.Router();
const { auth } = require("../controllers/authController");

let userProfile;

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
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

router.get("/", passport.authenticate("github"));

router.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "error" }),
  auth
);

router.get("/error", (req, res) => res.send("error logging in"));

module.exports = router;
