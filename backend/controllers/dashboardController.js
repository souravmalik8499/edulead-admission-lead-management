const pool = require("../config/db");


// ADMIN DASHBOARD SUMMARY
const getDashboardSummary = async (req, res) => {
  try {

    const [totalResult] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM leads`
    );

    const [statusResult] = await pool.query(
      `SELECT
        status,
        COUNT(*) AS count
       FROM leads
       GROUP BY status`
    );

    const summary = {
      totalLeads: totalResult[0].total,
      newLeads: 0,
      contacted: 0,
      followUp: 0,
      converted: 0,
      lost: 0
    };

    statusResult.forEach((row) => {

      switch (row.status) {

        case "NEW":
          summary.newLeads = row.count;
          break;

        case "CONTACTED":
          summary.contacted = row.count;
          break;

        case "FOLLOW_UP":
          summary.followUp = row.count;
          break;

        case "CONVERTED":
          summary.converted = row.count;
          break;

        case "LOST":
          summary.lost = row.count;
          break;

      }

    });

    res.json(summary);

  } catch (error) {

    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ADMIN LEAD REPORT
const getLeadReport = async (req, res) => {
  try {

    const [leads] = await pool.query(
      `SELECT
        l.id,
        u.name AS lead_name,
        u.email,
        u.phone,
        l.course,
        l.city,
        l.status,
        c.name AS counsellor_name,
        l.created_at

       FROM leads l

       JOIN users u
         ON l.user_id = u.id

       LEFT JOIN users c
         ON l.assigned_counsellor_id = c.id

       ORDER BY l.created_at DESC`
    );

    res.json({
      count: leads.length,
      leads
    });

  } catch (error) {

    console.error("Lead report error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  getDashboardSummary,
  getLeadReport
};