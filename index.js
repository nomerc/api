/*  EXPRESS */
const express = require("express"),
  db = require("./config/db"),
  errorController = require("./controllers/errController"),
  User = require("./models/User"),
  morgan = require("morgan"),
  path = require("path"),
  cors = require("cors"),
  passport = require("passport"),
  session = require("express-session"),
  MongoStore = require("connect-mongo"),
  bodyParser = require("body-parser");

const app = express();

//body parser middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//view engine (ejs,jade)
app.set("view engine", "ejs");

// Load Config File
require("dotenv").config({ path: "./config/.env" });

// Connect To Database
db().then();

// Enable cors
app.use(cors({ origin: "http://localhost:4200", credentials: true }));

//logger
app.use(morgan("dev"));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

//session middleware configuration
app.use(
  session({
    //key of the cookie to be saved on client side
    // key: "session_id",

    resave: true, //if true - forces the session to be saved back to the session store

    saveUninitialized: false, //if true - forces a session that is “uninitialized” to be saved to the store

    secret: "JK4FFD2EK8JF_fdfer",

    // cookie: { secure: false },

    // cookie: {
    //   maxAge: 1000 * 60,
    //   rolling: true,
    // },

    //session store

    // store: MongoStore.create({
    //   mongoUrl: process.env.MONGO_URI,
    // }),
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

// app.get("/auth/pages/products", (req, res) => {
//   console.log(req.isAuthenticated());
//   console.log(req.user);
//   // Product.find({ user_id: req.user._id }, function (err, products) {
//   //   res.status(200).send({ user: req.user, products });
//   //   // SSR
//   //   // res.render("pages/success", { user: req.user, products });
//   // });
//   res.sendStatus(200);
// });

app.use(errorController);

const port = process.env.PORT || 3000;

app.listen(port, console.log("App listening on port " + port));
