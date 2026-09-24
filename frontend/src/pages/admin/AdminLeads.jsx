import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [leadsResponse, counsellorsResponse] =
        await Promise.all([
          api.get("/admin/dashboard/leads"),
          api.get("/admin/counsellors"),
        ]);

      const leadsData = Array.isArray(leadsResponse.data)
        ? leadsResponse.data
        : leadsResponse.data.leads || [];

      const counsellorsData = Array.isArray(
        counsellorsResponse.data
      )
        ? counsellorsResponse.data
        : counsellorsResponse.data.counsellors || [];

      setLeads(leadsData);
      setCounsellors(counsellorsData);
    } catch (error) {
      console.error(
        "Failed to load leads:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const assignLead = async (
    leadId,
    counsellorId
  ) => {
    if (!counsellorId) return;

    try {
      await api.put(
        `/admin/assign-lead/${leadId}`,
        {
          counsellorId: Number(counsellorId),
        }
      );

      alert("Lead assigned successfully");

      loadData();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Assignment failed"
      );
    }
  };

  // Calculate lead ageing
  const getLeadAge = (lead) => {
    const dateValue =
      lead.created_at ||
      lead.createdAt ||
      lead.created_on;

    if (!dateValue) {
      return "N/A";
    }

    const createdDate = new Date(dateValue);

    if (isNaN(createdDate.getTime())) {
      return "N/A";
    }

    const today = new Date();

    const difference =
      today.getTime() -
      createdDate.getTime();

    const days = Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    );

    if (days === 0) {
      return "Today";
    }

    if (days === 1) {
      return "1 day";
    }

    return `${days} days`;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Loading leads...</h2>
      </div>
    );
  }

  return (
    <div>

      {/* TOP BAR */}
      <header className="topbar">

        <div>
          <h2>EduLead</h2>

          <span>
            Admin - Lead Management
          </span>
        </div>

        <button
          onClick={() =>
            (window.location.href =
              "/admin/dashboard")
          }
        >
          Dashboard
        </button>

      </header>


      {/* MAIN CONTENT */}
      <main className="dashboard">

        <h1>Lead Management</h1>

        <div className="table-container">

          <table className="lead-table">

            <thead>

              <tr>

                <th>ID</th>

                <th>Lead Name</th>

                <th>Email</th>

                <th>Phone</th>

                <th>Course</th>

                <th>Status</th>

                <th>Ageing</th>

                <th>Counsellor</th>

              </tr>

            </thead>


            <tbody>

              {leads.length === 0 ? (

                <tr>

                  <td colSpan="8">
                    No leads found
                  </td>

                </tr>

              ) : (

                leads.map((lead) => (

                  <tr key={lead.id}>

                    <td>
                      {lead.id}
                    </td>

                    <td>
  {lead.lead_name}
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


                    {/* STATUS */}

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


                    {/* AGEING */}

                    <td>

                      <span className="ageing">

                        {getLeadAge(lead)}

                      </span>

                    </td>


                    {/* COUNSELLOR */}

                    <td>

                      <select
                        value={
                          lead.counsellor_id ||
                          ""
                        }
                        onChange={(e) =>
                          assignLead(
                            lead.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          Select Counsellor
                        </option>

                        {counsellors.map(
                          (counsellor) => (

                            <option
                              key={
                                counsellor.id
                              }
                              value={
                                counsellor.id
                              }
                            >
                              {
                                counsellor.name
                              }
                            </option>

                          )
                        )}

                      </select>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
};

export default AdminLeads;