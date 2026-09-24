const express = require("express");

const {
  registerLead,
  login
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerLead);
router.post("/login", login);

module.exports = router;