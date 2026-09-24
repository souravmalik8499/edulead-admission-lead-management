import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const LeadDashboard = () => {
  const { user, logout } = useAuth();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    course: "",
    qualification: "",
    city: "",
    source: "Website",
    message: "",
  });

  const loadLead = async () => {
    try {
      const response = await api.get("/leads/my");

      const data = response.data.lead || response.data;

      setLead(data);
    } catch (error) {
      // 404 means the student has not submitted admission details yet
      if (error.response?.status === 404) {
        setLead(null);
      } else {
        console.error("Failed to load lead:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLead();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitAdmission = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/leads", formData);

      alert("Admission details submitted successfully!");

      await loadLead();
    } catch (error) {
      console.error("Admission submission error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to submit admission details"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="dashboard">
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <div>

      {/* TOP BAR */}
      <header className="topbar">

        <div>
          <h2>EduLead</h2>
          <span>Student Dashboard</span>
        </div>

        <div className="user-section">

          <span>{user?.name}</span>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </header>


      <main className="dashboard">

        <h1>Admission Dashboard</h1>


        {!lead ? (

          /* ADMISSION FORM */
          <div className="form-card">

            <h2>Admission Enquiry</h2>

            <p className="form-description">
              Please provide your admission details.
            </p>

            <form onSubmit={submitAdmission}>

              <div className="form-row">

                <div className="form-group">

                  <label>Course</label>

                  <input
                    type="text"
                    name="course"
                    placeholder="e.g. B.Tech Computer Science"
                    value={formData.course}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>Qualification</label>

                  <input
                    type="text"
                    name="qualification"
                    placeholder="e.g. 12th"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>How did you hear about us?</label>

                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                  >
                    <option value="Website">
                      Website
                    </option>

                    <option value="Google">
                      Google
                    </option>

                    <option value="Social Media">
                      Social Media
                    </option>

                    <option value="Referral">
                      Referral
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>

              </div>


              <div className="form-group">

                <label>Message</label>

                <textarea
                  name="message"
                  placeholder="Tell us about your admission requirements..."
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                />

              </div>


              <button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Admission Enquiry"}
              </button>

            </form>

          </div>

        ) : (

          /* LEAD DETAILS */
          <>

            <div className="details-card">

              <h2>My Admission Details</h2>

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
                  <span>Status</span>

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


            <div className="details-card">

              <h2>Admission Status</h2>

              <p className="status-info">
                Your current admission lead status is:
              </p>

              <div className="lead-status-large">
                {lead.status}
              </div>

            </div>

          </>

        )}

      </main>

    </div>
  );
};

export default LeadDashboard;