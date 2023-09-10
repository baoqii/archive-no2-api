const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.enablePassport = () => {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: process.env.SECRETKEY_TOKEN,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (token, done) => {
        try {
          if (!token || !token.user) {
            throw new Error("Invalid token payload");
          }
          const user = await User.findById(token.user._id);
          if (!user) {
            throw new Error("User not found");
          }
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
          return done(null, false, { message: "Password does not match" });
        }

        return done(null, user, { message: "Successfully logged in" });
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    "signup",
    new localStrategy(async (username, password, done) => {
      try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return done(null, false, { message: "Username is already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
