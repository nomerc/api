const User = require("../models/User");

//?async?
exports.auth = (req, res) => {
  // res.send(req.user);
  res.redirect("success");
};

//accessToken, refreshToken - for compatibility reasons
exports.verify = (accessToken, refreshToken, profile, done) => {
  User.findOne({ providerId: profile.id }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      user = new User({
        providerId: profile.id,
        providerName: profile.provider,
        username: profile.displayName,
      });
      user.save();
      return done(null, user);
    }

    return done(null, user);
  });
};
