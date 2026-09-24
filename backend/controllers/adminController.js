const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const pool = require("../config/db");

// CREATE COUNSELLOR
const createCounsellor = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    // Check existing email
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    // Generate temporary password
    const temporaryPassword =
      crypto.randomBytes(4).toString("hex");

    // Hash password
    const hashedPassword = await bcrypt.hash(
      temporaryPassword,
      10
    );

    // Create counsellor
    const [result] = await pool.query(
      `INSERT INTO users
      (name, email, password, role, phone)
      VALUES (?, ?, ?, 'COUNSELLOR', ?)`,
      [
        name,
        email,
        hashedPassword,
        phone || null
      ]
    );

    res.status(201).json({
      message: "Counsellor created successfully",

      counsellor: {
        id: result.insertId,
        name,
        email,
        phone: phone || null,
        role: "COUNSELLOR"
      },

      // In production this would be sent by email.
      temporaryPassword
    });

  } catch (error) {
    console.error("Create counsellor error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// GET ALL COUNSELLORS
const getCounsellors = async (req, res) => {
  try {
    const [counsellors] = await pool.query(
      `SELECT id, name, email, phone, created_at
       FROM users
       WHERE role = 'COUNSELLOR'
       ORDER BY created_at DESC`
    );

    res.json({
      count: counsellors.length,
      counsellors
    });

  } catch (error) {
    console.error("Get counsellors error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  createCounsellor,
  getCounsellors
};