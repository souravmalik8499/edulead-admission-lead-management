require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const leadRoutes = require("./routes/leadRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const counsellorRoutes = require("./routes/counsellorRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "EduLead API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leads", leadRoutes);
app.use(
  "/api/admin/assign-lead",
  assignmentRoutes
);
app.use(
  "/api/counsellor",
  counsellorRoutes
);
app.use(
  "/api/admin/dashboard",
  dashboardRoutes
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});