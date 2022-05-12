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

//in case of succesfully logged or registered
router.get("/success", (req, res) => {
  // console.log(req.user);
  // console.log(req.session.passport.user);
  res.render("pages/success", { user: req.user });
});
//in case of failure
router.get("/error", (req, res) =>
  res.send("error logging in " + req.query.message)
);

//get products of currently logged user
//just for demonstration purposes
router.get("/pages/products", (req, res, next) => {
  if (req.user) {
    Product.find({ user_id: req.user._id }, (err, products) => {
      if (err) {
        next(err);
      }
      res.status(200).send({ products });
      // SSR
      // res.render("pages/success", { user: req.user, products });
    });
  } else next({ err: "User not defined" });
});

router.get("/signout", function (req, res) {
  req.logout();
  res.status(200).send({ message: "Signed out" });

  //SSR
  // res.redirect("/");
});

module.exports = router;
