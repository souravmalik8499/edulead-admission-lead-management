const pool = require("../config/db");

// CREATE LEAD PROFILE
const createLead = async (req, res) => {
  try {
    const {
      course,
      qualification,
      city,
      source,
      message
    } = req.body;

    if (!course) {
      return res.status(400).json({
        message: "Course is required"
      });
    }

    // Check if logged-in user is a LEAD
    if (req.user.role !== "LEAD") {
      return res.status(403).json({
        message: "Only leads can create lead profiles"
      });
    }

    // Check whether lead profile already exists
    const [existingLead] = await pool.query(
      "SELECT id FROM leads WHERE user_id = ?",
      [req.user.id]
    );

    if (existingLead.length > 0) {
      return res.status(409).json({
        message: "Lead profile already exists"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO leads
      (user_id, course, qualification, city, source, message)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        course,
        qualification || null,
        city || null,
        source || "Website",
        message || null
      ]
    );

    res.status(201).json({
      message: "Lead created successfully",
      leadId: result.insertId
    });

  } catch (error) {
    console.error("Create lead error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// GET MY LEAD PROFILE
const getMyLead = async (req, res) => {
  try {

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
        l.assigned_counsellor_id,
        l.created_at
       FROM leads l
       JOIN users u ON l.user_id = u.id
       WHERE l.user_id = ?`,
      [req.user.id]
    );

    if (leads.length === 0) {
      return res.status(404).json({
        message: "Lead profile not found"
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


// ADMIN GET ALL LEADS
const getAllLeads = async (req, res) => {
  try {

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
        l.assigned_counsellor_id,
        c.name AS counsellor_name,
        l.created_at
       FROM leads l
       JOIN users u ON l.user_id = u.id
       LEFT JOIN users c
       ON l.assigned_counsellor_id = c.id
       ORDER BY l.created_at DESC`
    );

    res.json({
      count: leads.length,
      leads
    });

  } catch (error) {
    console.error("Get all leads error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  createLead,
  getMyLead,
  getAllLeads
};