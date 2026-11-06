import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { getImageUrl } from "../services/api";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/emp/employees");
      setEmployees(response.data.employees || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!department.trim() && !position.trim()) {
      setError("Enter a department, position, or both.");
      return;
    }

    try {
      setLoading(true);

      const params = {};

      if (department.trim()) {
        params.department = department.trim();
      }

      if (position.trim()) {
        params.position = position.trim();
      }

      const response = await api.get(
        "/emp/employees/search",
        { params }
      );

      setEmployees(response.data.employees || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to search employees."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setDepartment("");
    setPosition("");
    setMessage("");
    loadEmployees();
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Delete ${employee.first_name} ${employee.last_name}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete("/emp/employees", {
        params: { eid: employee._id },
      });

      setEmployees((current) =>
        current.filter((item) => item._id !== employee._id)
      );

      setMessage("Employee deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete employee."
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <div>
            <h1>Employees</h1>
            <p>
              View, search and manage your employee records.
            </p>
          </div>

          <Link
            to="/employees/add"
            className="btn btn-primary"
          >
            + Add Employee
          </Link>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        <form
          className="search-card"
          onSubmit={handleSearch}
        >
          <div className="search-fields">
            <div className="form-group">
              <label htmlFor="department">
                Department
              </label>

              <input
                id="department"
                value={department}
                onChange={(event) =>
                  setDepartment(event.target.value)
                }
                placeholder="e.g. Engineering"
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">
                Position
              </label>

              <input
                id="position"
                value={position}
                onChange={(event) =>
                  setPosition(event.target.value)
                }
                placeholder="e.g. Developer"
              />
            </div>
          </div>

          <div className="search-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              Search
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearSearch}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </form>

        {loading ? (
          <div className="status-card">
            Loading employees...
          </div>
        ) : employees.length === 0 ? (
          <div className="status-card">
            <h2>No employees found</h2>
            <p>
              Add an employee or change your search
              criteria.
            </p>
          </div>
        ) : (
          <div
            className="employee-table-wrapper"
            style={{
              overflowX: "auto",
              background: "#ffffff",
              borderRadius: "14px",
              boxShadow:
                "0 4px 18px rgba(0, 0, 0, 0.08)",
            }}
          >
            <table
              className="employee-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "850px",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "18px" }}>
                    Profile
                  </th>

                  <th style={{ padding: "18px" }}>
                    Name
                  </th>

                  <th style={{ padding: "18px" }}>
                    Position
                  </th>

                  <th style={{ padding: "18px" }}>
                    Department
                  </th>

                  <th style={{ padding: "18px" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => (
                  <tr
                    key={employee._id}
                    style={{
                      borderBottom:
                        "1px solid #e5e7eb",
                    }}
                  >
                    <td style={{ padding: "18px" }}>
                      {employee.profile_picture ? (
                        <img
                          className="employee-avatar"
                          src={getImageUrl(
                            employee.profile_picture
                          )}
                          alt={`${employee.first_name} ${employee.last_name}`}
                          style={{
                            width: "58px",
                            height: "58px",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <div
                          className="employee-avatar placeholder"
                          style={{
                            width: "58px",
                            height: "58px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                          }}
                        >
                          {employee.first_name?.[0]}
                          {employee.last_name?.[0]}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: "18px" }}>
                      <strong>
                        {employee.first_name}{" "}
                        {employee.last_name}
                      </strong>

                      <div
                        style={{
                          marginTop: "4px",
                          fontSize: "0.9rem",
                          color: "#6b7280",
                        }}
                      >
                        {employee.email}
                      </div>
                    </td>

                    <td style={{ padding: "18px" }}>
                      {employee.position}
                    </td>

                    <td style={{ padding: "18px" }}>
                      {employee.department}
                    </td>

                    <td style={{ padding: "18px" }}>
                      <div
                        className="card-actions"
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <Link
                          to={`/employees/${employee._id}`}
                          className="btn btn-secondary"
                        >
                          View
                        </Link>

                        <Link
                          to={`/employees/${employee._id}/edit`}
                          className="btn btn-secondary"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>
                            handleDelete(employee)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
};

export default EmployeeList;
