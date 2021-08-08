var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// Favicon
var favicon = require("serve-favicon");

// Mongoose
const mongoose = require("mongoose");

// Dotenv
require("dotenv").config();

// Routes
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");

var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Favicon path
app.use(favicon(path.join(__dirname, "public/images", "favicon.ico")));

// Custom Bootstrap path
app.use(
  "/cssbs",
  express.static(__dirname + "/node_modules/bootstrap/dist/css")
);
app.use("/jsbs", express.static(__dirname + "/node_modules/bootstrap/dist/js"));

// App use
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// DB Connection
mongoose
  .connect(process.env.MONGODB_ATLAS_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB has been connected"))
  .catch((err) => console.log(err));

app.use("/", indexRouter);
app.use("/", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
