const express = require("express");

const {
  getDashboardSummary,
  getLeadReport
} = require("../controllers/dashboardController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ADMIN DASHBOARD SUMMARY
router.get(
  "/summary",
  authenticate,
  authorize("ADMIN"),
  getDashboardSummary
);


// ADMIN LEAD REPORT
router.get(
  "/leads",
  authenticate,
  authorize("ADMIN"),
  getLeadReport
);


module.exports = router;