if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const User = require("./models/user");

const userRouter = require("./routes/users");
const campRouter = require("./routes/campgrounds");
const revRouter = require("./routes/reviews");

const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

const app = express();

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
//

mongoose.connect(dbUrl, {
  //useNewUrlParser: true,
  //useCreateIndex: true,
  //useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://cdn.jsdelivr.net",
  "https://use.fontawesome.com/"
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://cdn.jsdelivr.net",
  "https://events.mapbox.com/"
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dei8hlvch/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/"
      ],
      fontSrc: ["'self'", ...fontSrcUrls]
    }
  })
);

const secret = process.env.SECRET || "thisshouldbeabettersecret";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret
  }
});

const sessionConfig = {
  store: store,
  name: "__ycses",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRouter);
app.use("/campgrounds", campRouter);
app.use("/campgrounds/:id/reviews", revRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No! Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Serving on Port: 3000");
});
