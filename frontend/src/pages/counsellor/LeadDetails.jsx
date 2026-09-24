import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);

  const [status, setStatus] = useState("");
  const [activityType, setActivityType] = useState("CALL");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingActivity, setSavingActivity] = useState(false);

  const loadLead = async () => {
    try {
      const response = await api.get(
        `/counsellor/leads/${id}`
      );

      const data = response.data.lead || response.data;

      setLead(data);
      setStatus(data.status);
    } catch (error) {
      console.error(
        "Failed to load lead:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const response = await api.get(
        `/counsellor/leads/${id}/activities`
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.activities || [];

      setActivities(data);
    } catch (error) {
      console.error(
        "Failed to load activities:",
        error
      );
    }
  };

  useEffect(() => {
    loadLead();
    loadActivities();
  }, [id]);

  const updateStatus = async () => {
    try {
      setSavingStatus(true);

      await api.put(
        `/counsellor/leads/${id}/status`,
        {
          status,
        }
      );

      alert("Status updated successfully");

      await loadLead();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update status"
      );
    } finally {
      setSavingStatus(false);
    }
  };

  const addActivity = async (e) => {
    e.preventDefault();

    if (!notes.trim()) {
      alert("Please enter notes");
      return;
    }

    try {
      setSavingActivity(true);

      await api.post(
  `/counsellor/leads/${id}/activities`,
  {
    activityType: activityType,
    notes: notes,
  }
);

      alert("Activity added successfully");

      setNotes("");

      await loadActivities();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add activity"
      );
    } finally {
      setSavingActivity(false);
    }
  };

  if (loading) {
    return (
      <main className="dashboard">
        <h2>Loading lead...</h2>
      </main>
    );
  }

  if (!lead) {
    return (
      <main className="dashboard">
        <h2>Lead not found</h2>

        <button
          onClick={() =>
            navigate("/counsellor/dashboard")
          }
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  return (
    <div>

      {/* TOP BAR */}
      <header className="topbar">

        <div>
          <h2>EduLead</h2>

          <span>
            Lead Details
          </span>
        </div>

        <button
          onClick={() =>
            navigate("/counsellor/dashboard")
          }
        >
          Back
        </button>

      </header>


      <main className="dashboard">

        <h1>Lead Details</h1>


        {/* LEAD INFORMATION */}
        <div className="details-card">

          <h2>Student Information</h2>

          <div className="details-grid">

            <div>
              <span>Name</span>
              <strong>{lead.name}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{lead.email}</strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>{lead.phone}</strong>
            </div>

            <div>
              <span>Course</span>
              <strong>{lead.course}</strong>
            </div>

            <div>
              <span>Qualification</span>
              <strong>
                {lead.qualification || "-"}
              </strong>
            </div>

            <div>
              <span>City</span>
              <strong>
                {lead.city || "-"}
              </strong>
            </div>

            <div>
              <span>Source</span>
              <strong>
                {lead.source || "-"}
              </strong>
            </div>

            <div>
              <span>Current Status</span>

              <strong>
                <span
                  className={`status ${
                    lead.status
                      ?.toLowerCase()
                      .replace("_", "-")
                  }`}
                >
                  {lead.status}
                </span>
              </strong>
            </div>

          </div>


          <div className="message-box">

            <span>Message</span>

            <p>
              {lead.message ||
                "No message provided"}
            </p>

          </div>

        </div>


        {/* UPDATE STATUS */}
        <div className="details-card">

          <h2>Update Lead Status</h2>

          <div className="status-update">

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="NEW">
                NEW
              </option>

              <option value="CONTACTED">
                CONTACTED
              </option>

              <option value="FOLLOW_UP">
                FOLLOW_UP
              </option>

              <option value="CONVERTED">
                CONVERTED
              </option>

              <option value="LOST">
                LOST
              </option>
            </select>


            <button
              onClick={updateStatus}
              disabled={savingStatus}
            >
              {savingStatus
                ? "Updating..."
                : "Update Status"}
            </button>

          </div>

        </div>


        {/* ADD ACTIVITY */}
        <div className="details-card">

          <h2>Add Follow-up / Activity</h2>

          <form onSubmit={addActivity}>

            <div className="activity-row">

              <select
                value={activityType}
                onChange={(e) =>
                  setActivityType(
                    e.target.value
                  )
                }
              >
                <option value="CALL">
                  Call
                </option>

                <option value="EMAIL">
                  Email
                </option>

                <option value="MEETING">
                  Meeting
                </option>

                <option value="FOLLOW_UP">
                  Follow Up
                </option>

                <option value="NOTE">
                  Note
                </option>

              </select>


              <textarea
                placeholder="Enter follow-up notes..."
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows="4"
              />

            </div>


            <button
              type="submit"
              disabled={savingActivity}
            >
              {savingActivity
                ? "Saving..."
                : "Add Activity"}
            </button>

          </form>

        </div>


        {/* ACTIVITY HISTORY */}
        <div className="details-card">

          <h2>Activity History</h2>

          {activities.length === 0 ? (

            <p>
              No activities recorded yet.
            </p>

          ) : (

            <div className="activity-list">

              {activities.map(
                (activity) => (

                  <div
                    className="activity-item"
                    key={activity.id}
                  >

                    <div>

                      <strong>
                        {
                          activity.activity_type
                        }
                      </strong>

                      <span>
                        {
                          new Date(
                            activity.created_at
                          ).toLocaleString()
                        }
                      </span>

                    </div>

                    <p>
                      {activity.notes}
                    </p>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default LeadDetails;