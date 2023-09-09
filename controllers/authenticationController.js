const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(401).json({
          success: false,
          message: "Authentication failed",
        });
      }

      req.login(user, { session: false }, async (error) => {
        if (error) {
          return res.status(400).json({
            success: false,
            message: "Error occurred while logging in",
          });
        }

        const body = { _id: user._id, username: user.username };
        const token = jwt.sign({ user: body }, process.env.SECRETKEY_TOKEN, {
          expiresIn: process.env.TOKEN_EXPIRESIN,
        });

        return res.status(200).json({
          success: true,
          message: "Authentication successful",
          data: {
            token,
            user: body,
          },
        });
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error occurred while authenticating",
      });
    }
  })(req, res, next);
};

exports.signup = [
  body("username", "Username must have at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .isAlphanumeric()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ username: value });
        if (user) {
          throw new Error("Username is already in use.");
        }
      } catch (err) {
        console.error("Error validating username:", err); // Log the error

        throw new Error("An error occurred when validating the username");
      }
    })
    .escape(),

  body(
    "password",
    "Password should be at least 8 characters long and contain at least an uppercase letter, lowercase, symbol, number."
  )
    .trim()
    .isStrongPassword()
    .escape(),

  body("confPassword", "Passwords do not match.")
    .notEmpty()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    try {
      await passport.authenticate("signup", { session: false })(req, res, next);
      res.status(201).json({
        success: true,
        message: "Successfully signed up",
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  },
];

exports.checkToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ error: "Authorization header is missing or malformed" });
    }

    const token = bearerHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json({ error: "Token is missing" });
    }

    const decoded = await jwt.verify(token, process.env.SECRETKEY_TOKEN);

    if (!decoded || typeof decoded !== "object") {
      return res.status(400).json({ error: "Token is invalid" });
    }

    res.status(200).json({ user: decoded.user });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      if (error.message === "jwt expired") {
        return res.status(401).json({ error: "Token has expired" });
      } else {
        return res.status(400).json({ error: "Token is invalid" });
      }
    } else {
      return res
        .status(400)
        .json({ error: "Error occurred while checking token" });
    }
  }
};
