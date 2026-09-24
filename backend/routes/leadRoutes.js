const express = require("express");

const {
  createLead,
  getMyLead,
  getAllLeads
} = require("../controllers/leadController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// LEAD creates profile
router.post(
  "/",
  authenticate,
  authorize("LEAD"),
  createLead
);


// LEAD views own profile
router.get(
  "/my",
  authenticate,
  authorize("LEAD"),
  getMyLead
);


// ADMIN views all leads
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getAllLeads
);


module.exports = router;