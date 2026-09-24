const express = require("express");

const {
  assignLead
} = require("../controllers/assignmentController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


router.put(
  "/:leadId",
  authenticate,
  authorize("ADMIN"),
  assignLead
);


module.exports = router;