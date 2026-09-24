import { useEffect, useState } from "react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [summary, setSummary] = useState({
    totalLeads: 0,
    newLeads: 0,
    contacted: 0,
    followUp: 0,
    converted: 0,
    lost: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get(
          "/admin/dashboard/summary"
        );

        setSummary(response.data);
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );
      }
    };

    loadDashboard();
  }, []);

  return (
    <div>

      {/* TOP BAR */}
      <header className="topbar">

        <div>
          <h2>EduLead</h2>
          <span>Admin Dashboard</span>
        </div>

        <div className="user-section">

          <span>{user?.name}</span>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </header>


      {/* DASHBOARD CONTENT */}
      <main className="dashboard">

        <h1>Dashboard</h1>


        {/* STATISTICS */}
        <div className="stats-grid">

          <div className="stat-card">
            <span>Total Leads</span>
            <strong>
              {summary.totalLeads}
            </strong>
          </div>


          <div className="stat-card">
            <span>New Leads</span>
            <strong>
              {summary.newLeads}
            </strong>
          </div>


          <div className="stat-card">
            <span>Contacted</span>
            <strong>
              {summary.contacted}
            </strong>
          </div>


          <div className="stat-card">
            <span>Follow Up</span>
            <strong>
              {summary.followUp}
            </strong>
          </div>


          <div className="stat-card">
            <span>Converted</span>
            <strong>
              {summary.converted}
            </strong>
          </div>


          <div className="stat-card">
            <span>Lost</span>
            <strong>
              {summary.lost}
            </strong>
          </div>

        </div>


        {/* MANAGE LEADS BUTTON */}
        <div className="dashboard-actions">

          <button
            onClick={() =>
              window.location.href = "/admin/leads"
            }
          >
            Manage Leads
          </button>

          <button
    onClick={() =>
      (window.location.href =
        "/admin/counsellors")
    }
  >
    Manage Counsellors
  </button>

        </div>


      </main>

    </div>
  );
};

export default AdminDashboard;