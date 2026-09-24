const express = require("express");

const {
  createCounsellor,
  getCounsellors
} = require("../controllers/adminController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

// Only ADMIN can create counsellor
router.post(
  "/counsellors",
  authenticate,
  authorize("ADMIN"),
  createCounsellor
);

// Only ADMIN can view counsellors
router.get(
  "/counsellors",
  authenticate,
  authorize("ADMIN"),
  getCounsellors
);

module.exports = router;