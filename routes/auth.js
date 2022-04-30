const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

//Routes
const authGoogleRoute = require("./authGoogle");
const authFacebookRoute = require("./authFacebook");
const authTwitterRoute = require("./authTwitter");
const authInstagramRoute = require("./authInstagram");
const authGithubRoute = require("./authGithub");
const authLocalRoute = require("./authLocal");

router.use("/google", authGoogleRoute);
router.use("/facebook", authFacebookRoute);
router.use("/twitter", authTwitterRoute);
router.use("/instagram", authInstagramRoute);
router.use("/github", authGithubRoute);
router.use("/local", authLocalRoute);

router.get("/pages/register", (req, res) => {
  res.render("pages/register");
});

router.get("/pages/signIn", (req, res) => {
  res.render("pages/signIn");
});

//get products of currently logged user
router.get("/pages/products", (req, res) => {
  Product.find({ user_id: req.user._id }, function (err, products) {
    res.render("pages/success", { user: req.user, products });
  });
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
