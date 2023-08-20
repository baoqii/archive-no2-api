const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticationController = require("../controllers/authenticationController");

// POST login
// authenticate the user login using passport and JWT
router.post("/login", authenticationController.login);

// POST signup
router.post("/signup", authenticationController.signup);

// POST logout
router.post("/logout", authenticationController.logout);

// POST verify
router.post(
  "/verify",
  passport.authenticate("jwt", { session: false }),
  authenticationController.verifyUser
);

// GET check token
router.get("/check-token", authenticationController.checkToken);

// GET API kEYS

module.exports = router;
