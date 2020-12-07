const express = require("express");
const router = express.Router();

const { users } = require("../controllers/user");

// Routes
router.get("/listUsers", users);

module.exports = router;