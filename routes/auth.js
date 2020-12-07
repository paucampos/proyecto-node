const express = require("express");
const router = express.Router();

const { userSignupValidator } = require("../validator");
const { signup } = require("../controllers/auth");

// Routes
router.post("/signup", userSignupValidator, signup);

module.exports = router;