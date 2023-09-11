const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
require("dotenv").config();

const cors = require("cors");

const indexRouter = require("./routes/index");
const authenticationRouter = require("./routes/authentication");
const commentRouter = require("./routes/comment");
const postRouter = require("./routes/post");
const tagRouter = require("./routes/tag");
const { enablePassport } = require("./config/passport-config");

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

// const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map(
//   (origin) => origin
// );

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
enablePassport();

app.use("/", indexRouter);
app.use("/api/authentication", authenticationRouter);
app.use("/api/posts", commentRouter);
app.use("/api/posts", postRouter);
app.use("/api/tag", tagRouter);

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
  res.json({
    message: err.message,
    status: err.status,
    stack: err.stack,
  });
});

module.exports = app;
