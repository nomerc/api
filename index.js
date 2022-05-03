/*  EXPRESS */
const express = require("express");
const db = require("./config/db");
const User = require("./models/User");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

//body parser middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//
// app.use(express.json());

//view engine (ejs,jade)
app.set("view engine", "ejs");

// Load Config File
require("dotenv").config({ path: "./config/.env" });

// Connect To Database
db().then();

// Enable cors
app.use(cors());

//logger
app.use(morgan("dev"));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

//session middleware configuration
app.use(
  session({
    resave: false, //if true - forces the session to be saved back to the session store
    saveUninitialized: true, //if true - forces a session that is “uninitialized” to be saved to the store
    secret: "JK4FFD2EK8JF_fdfer",
    proxy: true,
  })
);

//initialize passport
app.use(passport.initialize());

/* is equivalent to
app.use(passport.authenticate('session'));
Where 'session' refers to the following strategy that is bundled with passportJS. */
app.use(passport.session());

//This will find the correct user from the database and pass it as a closure variable into the callback done(err,user); so the above code in the passport.session() can replace the 'user' value in the req object and pass on to the next middleware in the pile.

// used to serialize the user(id) for the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  // done(null, id);

  //   //If using Mongoose with MongoDB; if other you will need JS specific to that schema.

  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// routes
app.get("/", (req, res) => res.render("pages/signIn"));
app.use("/auth", require("./routes/auth"));

const port = process.env.PORT || 3000;

app.listen(port, console.log("App listening on port " + port));
