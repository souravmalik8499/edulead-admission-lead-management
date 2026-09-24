const pool = require("../config/db");


// ASSIGN LEAD TO COUNSELLOR
const assignLead = async (req, res) => {
  try {

    const { leadId } = req.params;
    const { counsellorId } = req.body;

    if (!counsellorId) {
      return res.status(400).json({
        message: "Counsellor ID is required"
      });
    }


    // Check lead
    const [leads] = await pool.query(
      "SELECT id FROM leads WHERE id = ?",
      [leadId]
    );

    if (leads.length === 0) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }


    // Check counsellor
    const [counsellors] = await pool.query(
      `SELECT id, name, email
       FROM users
       WHERE id = ?
       AND role = 'COUNSELLOR'`,
      [counsellorId]
    );

    if (counsellors.length === 0) {
      return res.status(404).json({
        message: "Counsellor not found"
      });
    }


    // Assign
    await pool.query(
      `UPDATE leads
       SET assigned_counsellor_id = ?
       WHERE id = ?`,
      [counsellorId, leadId]
    );


    res.json({
      message: "Lead assigned successfully",

      lead: {
        id: Number(leadId),
        counsellor: counsellors[0]
      }
    });

  } catch (error) {

    console.error("Assign lead error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  assignLead
};