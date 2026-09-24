const pool = require("../config/db");

// GET ASSIGNED LEADS
const getAssignedLeads = async (req, res) => {
  try {

    const counsellorId = req.user.id;

    const [leads] = await pool.query(
      `SELECT
        l.id,
        u.name,
        u.email,
        u.phone,
        l.course,
        l.qualification,
        l.city,
        l.source,
        l.status,
        l.message,
        l.created_at
       FROM leads l
       JOIN users u
         ON l.user_id = u.id
       WHERE l.assigned_counsellor_id = ?
       ORDER BY l.created_at DESC`,
      [counsellorId]
    );

    res.json({
      count: leads.length,
      leads
    });

  } catch (error) {

    console.error("Get assigned leads error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// GET SINGLE ASSIGNED LEAD
const getAssignedLeadById = async (req, res) => {
  try {

    const counsellorId = req.user.id;
    const leadId = req.params.id;

    const [leads] = await pool.query(
      `SELECT
        l.id,
        u.name,
        u.email,
        u.phone,
        l.course,
        l.qualification,
        l.city,
        l.source,
        l.status,
        l.message,
        l.created_at
       FROM leads l
       JOIN users u
         ON l.user_id = u.id
       WHERE l.id = ?
       AND l.assigned_counsellor_id = ?`,
      [leadId, counsellorId]
    );

    if (leads.length === 0) {
      return res.status(404).json({
        message: "Lead not found or not assigned to you"
      });
    }

    res.json(leads[0]);

  } catch (error) {

    console.error("Get lead error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};



// UPDATE LEAD STATUS
const updateLeadStatus = async (req, res) => {
  try {

    const counsellorId = req.user.id;
    const leadId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = [
      "NEW",
      "CONTACTED",
      "FOLLOW_UP",
      "CONVERTED",
      "LOST"
    ];

    if (!status) {
      return res.status(400).json({
        message: "Status is required"
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        allowedStatuses
      });
    }

    // Check that this lead belongs to this counsellor
    const [leads] = await pool.query(
      `SELECT id
       FROM leads
       WHERE id = ?
       AND assigned_counsellor_id = ?`,
      [leadId, counsellorId]
    );

    if (leads.length === 0) {
      return res.status(404).json({
        message: "Lead not found or not assigned to you"
      });
    }

    // Update status
    await pool.query(
      `UPDATE leads
       SET status = ?
       WHERE id = ?`,
      [status, leadId]
    );

    res.json({
      message: "Lead status updated successfully",
      leadId: Number(leadId),
      status
    });

  } catch (error) {

    console.error("Update lead status error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};
// ADD LEAD ACTIVITY
const addLeadActivity = async (req, res) => {
  try {
    const counsellorId = req.user.id;
    const leadId = req.params.id;

    const {
      activityType,
      notes
    } = req.body;

    if (!activityType) {
      return res.status(400).json({
        message: "Activity type is required"
      });
    }

    if (!notes) {
      return res.status(400).json({
        message: "Notes are required"
      });
    }

    // Check that lead is assigned to this counsellor
    const [leads] = await pool.query(
      `SELECT id
       FROM leads
       WHERE id = ?
       AND assigned_counsellor_id = ?`,
      [leadId, counsellorId]
    );

    if (leads.length === 0) {
      return res.status(404).json({
        message: "Lead not found or not assigned to you"
      });
    }

    // Save activity
    const [result] = await pool.query(
      `INSERT INTO lead_activities
       (lead_id, counsellor_id, activity_type, notes)
       VALUES (?, ?, ?, ?)`,
      [
        leadId,
        counsellorId,
        activityType,
        notes
      ]
    );

    res.status(201).json({
      message: "Activity added successfully",
      activityId: result.insertId
    });

  } catch (error) {

    console.error("Add activity error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// GET LEAD ACTIVITY HISTORY
const getLeadActivities = async (req, res) => {
  try {

    const counsellorId = req.user.id;
    const leadId = req.params.id;

    const [activities] = await pool.query(
      `SELECT
        a.id,
        a.activity_type,
        a.notes,
        a.created_at,
        u.name AS counsellor_name
       FROM lead_activities a
       JOIN users u
         ON a.counsellor_id = u.id
       JOIN leads l
         ON a.lead_id = l.id
       WHERE a.lead_id = ?
       AND l.assigned_counsellor_id = ?
       ORDER BY a.created_at DESC`,
      [leadId, counsellorId]
    );

    res.json({
      count: activities.length,
      activities
    });

  } catch (error) {

    console.error("Get activities error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};
module.exports = {
  getAssignedLeads,
  getAssignedLeadById,
  updateLeadStatus,
  addLeadActivity,
  getLeadActivities
};