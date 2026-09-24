const express = require("express");

const {
  getAssignedLeads,
  getAssignedLeadById,
  updateLeadStatus,
  addLeadActivity,
  getLeadActivities
} = require("../controllers/counsellorController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL ASSIGNED LEADS
router.get(
  "/leads",
  authenticate,
  authorize("COUNSELLOR"),
  getAssignedLeads
);


// GET SINGLE ASSIGNED LEAD
router.get(
  "/leads/:id",
  authenticate,
  authorize("COUNSELLOR"),
  getAssignedLeadById
);


// UPDATE LEAD STATUS
router.put(
  "/leads/:id/status",
  authenticate,
  authorize("COUNSELLOR"),
  updateLeadStatus
);
// ADD ACTIVITY
router.post(
  "/leads/:id/activities",
  authenticate,
  authorize("COUNSELLOR"),
  addLeadActivity
);


// GET ACTIVITY HISTORY
router.get(
  "/leads/:id/activities",
  authenticate,
  authorize("COUNSELLOR"),
  getLeadActivities
);

module.exports = router;