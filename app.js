/** @format */
if (process.env !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo");

const ExpressError = require("./utils/ExpressError");
const User = require("./models/users");
const usersRoutes = require("./routes/users");
const heritagesRoutes = require("./routes/heritages");
const reviewsRoutes = require("./routes/reviews");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Db connected");
});

const store = MongoDBStore.create({
  mongoUrl: process.env.MONGO_URI,
  crypto: {
    secret: process.env.MONGO_SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

const sessionConfig = {
  store,
  secret: "thisisasecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
const app = express();

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet({ contentSecurityPolicy: false }));

passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", usersRoutes);
app.use("/heritages", heritagesRoutes);
app.use("/heritages/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Uh! Oh Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("App listening");
});
