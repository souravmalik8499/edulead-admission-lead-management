import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const CounsellorDashboard = () => {
  const { user, logout } = useAuth();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = async () => {
    try {
      const response = await api.get(
        "/counsellor/leads"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.leads || [];

      setLeads(data);
    } catch (error) {
      console.error(
        "Failed to load assigned leads:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  return (
    <div>

      {/* TOP BAR */}
      <header className="topbar">

        <div>
          <h2>EduLead</h2>

          <span>
            Counsellor Dashboard
          </span>
        </div>

        <div className="user-section">

          <span>
            {user?.name}
          </span>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </header>


      {/* MAIN CONTENT */}
      <main className="dashboard">

        <h1>My Assigned Leads</h1>


        {/* SUMMARY */}
        <div className="stats-grid">

          <div className="stat-card">

            <span>
              Total Assigned
            </span>

            <strong>
              {leads.length}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              New
            </span>

            <strong>
              {
                leads.filter(
                  (lead) =>
                    lead.status === "NEW"
                ).length
              }
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Contacted
            </span>

            <strong>
              {
                leads.filter(
                  (lead) =>
                    lead.status === "CONTACTED"
                ).length
              }
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Follow Up
            </span>

            <strong>
              {
                leads.filter(
                  (lead) =>
                    lead.status === "FOLLOW_UP"
                ).length
              }
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Converted
            </span>

            <strong>
              {
                leads.filter(
                  (lead) =>
                    lead.status === "CONVERTED"
                ).length
              }
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Lost
            </span>

            <strong>
              {
                leads.filter(
                  (lead) =>
                    lead.status === "LOST"
                ).length
              }
            </strong>

          </div>

        </div>


        {/* LEADS TABLE */}
        <div className="table-container">

          <h2>Assigned Leads</h2>

          {loading ? (

            <p>Loading leads...</p>

          ) : (

            <table className="lead-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {leads.length === 0 ? (

                  <tr>

                    <td colSpan="6">
                      No leads assigned
                    </td>

                  </tr>

                ) : (

                  leads.map((lead) => (

                    <tr key={lead.id}>

                      <td>
                        {lead.id}
                      </td>

                      <td>
  <button
    className="lead-link"
    onClick={() =>
      (window.location.href =
        `/counsellor/leads/${lead.id}`)
    }
  >
    {lead.name}
  </button>
</td>

                      <td>
                        {lead.email}
                      </td>

                      <td>
                        {lead.phone}
                      </td>

                      <td>
                        {lead.course}
                      </td>

                      <td>

                        <span
                          className={`status ${
                            lead.status
                              ?.toLowerCase()
                              .replace(
                                "_",
                                "-"
                              )
                          }`}
                        >
                          {lead.status}
                        </span>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          )}

        </div>

      </main>

    </div>
  );
};

export default CounsellorDashboard;