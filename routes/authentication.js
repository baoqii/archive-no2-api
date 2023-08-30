const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticationController = require("../controllers/authenticationController");

// POST login
router.post("/login", authenticationController.login);

// POST signup
router.post("/signup", authenticationController.signup);

// GET check token
router.get("/check-token", authenticationController.checkToken);

module.exports = router;
