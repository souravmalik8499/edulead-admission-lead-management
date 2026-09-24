import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminCounsellors = () => {
  const [counsellors, setCounsellors] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadCounsellors = async () => {
    try {
      const response = await api.get("/admin/counsellors");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.counsellors || [];

      setCounsellors(data);
    } catch (error) {
      console.error("Failed to load counsellors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCounsellors();
  }, []);

  const createCounsellor = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Please enter name and email");
      return;
    }

    try {
      setCreating(true);

      const response = await api.post(
        "/admin/counsellors",
        {
          name,
          email,
        }
      );

      alert(
        `Counsellor created successfully!\n\nTemporary Password: ${response.data.temporaryPassword}`
      );

      setName("");
      setEmail("");

      loadCounsellors();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create counsellor"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>

      {/* TOP BAR */}
      <header className="topbar">

        <div>
          <h2>EduLead</h2>
          <span>
            Admin - Counsellor Management
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

        <h1>Counsellor Management</h1>


        {/* CREATE COUNSELLOR */}
        <div className="form-card">

          <h2>Add New Counsellor</h2>

          <form onSubmit={createCounsellor}>

            <div className="form-row">

              <div className="form-group">

                <label>Name</label>

                <input
                  type="text"
                  placeholder="Enter counsellor name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter counsellor email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            <button
              type="submit"
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create Counsellor"}
            </button>

          </form>

        </div>


        {/* COUNSELLOR LIST */}
        <div className="table-container counsellor-table">

          <h2>All Counsellors</h2>

          {loading ? (

            <p>Loading counsellors...</p>

          ) : (

            <table className="lead-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>

              </thead>

              <tbody>

                {counsellors.length === 0 ? (

                  <tr>
                    <td colSpan="4">
                      No counsellors found
                    </td>
                  </tr>

                ) : (

                  counsellors.map(
                    (counsellor) => (

                      <tr
                        key={
                          counsellor.id
                        }
                      >

                        <td>
                          {counsellor.id}
                        </td>

                        <td>
                          {counsellor.name}
                        </td>

                        <td>
                          {counsellor.email}
                        </td>

                        <td>
                          {counsellor.role}
                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          )}

        </div>

      </main>

    </div>
  );
};

export default AdminCounsellors;