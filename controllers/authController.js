exports.auth = async (req, res) => {
  // res.send(req.user);
  res.redirect("success");
};

exports.passport_strategy_cb = (userProfile, profile, done) => {
  userProfile = profile;
  return done(null, userProfile);
};
