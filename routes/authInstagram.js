const express = require("express");
const passport = require("passport");
let InstagramStrategy = require("passport-instagram").Strategy;
const router = express.Router();
const { auth } = require("../controllers/authController");

let userProfile;

passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
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

router.get("/", passport.authenticate("instagram"));

router.get(
  "/callback",
  passport.authenticate("instagram", { failureRedirect: "error" }),
  auth
);

router.get("/error", (req, res) => res.send("error logging in"));

module.exports = router;
