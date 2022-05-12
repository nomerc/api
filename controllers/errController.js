//handle email or usename duplicates
const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const code = 409;
  const error = `An account with that ${field} already exists.`;
  res.status(code).send({ messages: error, fields: field });
};

//handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  let fields = Object.values(err.errors).map((el) => el.path);
  let code = 400;

  if (errors.length > 1) {
    const formattedErrors = errors.join(" ");
    res.status(code).send({ messages: formattedErrors, fields: fields });
  } else {
    res.status(code).send({ messages: errors, fields: fields });
  }
};

//handle empty fields, and mismatched passwords
const handleAuthenticationError = (err, req, res) => {
  let code = err.status;

  if (code === 400)
    res.status(code).send({
      messages: "Empty username/password",
      fields: "Authentication error",
    });

  if (code === 401)
    res.status(code).send({
      messages: "Incorrect username/password",
      fields: "Authentication error",
    });

  res.status(code).send({
    messages: "Unknown authentication error",
    fields: "Authentication error",
  });
};

//error controller function
module.exports = (err, req, res, next) => {
  try {
    if (err.name === "ValidationError")
      return (err = handleValidationError(err, res));
    if (err.name === "AuthenticationError")
      return (err = handleAuthenticationError(err, req, res));
    if (err.code && err.code == 11000)
      return (err = handleDuplicateKeyError(err, res));
  } catch (err) {
    res.status(500).send("An unknown error occured.");
  }
};
