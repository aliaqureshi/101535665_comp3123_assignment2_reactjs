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

      const response = await api.get("/emp/employees/search", {
        params,
      });

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
            <p>View, search and manage your employee records.</p>
          </div>

          <Link to="/employees/add" className="btn btn-primary">
            + Add Employee
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && (
          <div className="alert alert-success">{message}</div>
        )}

        <form className="search-card" onSubmit={handleSearch}>
          <div className="search-fields">
            <div className="form-group">
              <label htmlFor="department">Department</label>
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
              <label htmlFor="position">Position</label>
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
          <div className="status-card">Loading employees...</div>
        ) : employees.length === 0 ? (
          <div className="status-card">
            <h2>No employees found</h2>
            <p>
              Add an employee or change your search criteria.
            </p>
          </div>
        ) : (
          <div className="employee-grid">
            {employees.map((employee) => (
              <article
                className="employee-card"
                key={employee._id}
              >
                <div className="employee-card-top">
                  {employee.profile_picture ? (
                    <img
                      className="employee-avatar"
                      src={getImageUrl(employee.profile_picture)}
                      alt={`${employee.first_name} ${employee.last_name}`}
                    />
                  ) : (
                    <div className="employee-avatar placeholder">
                      {employee.first_name?.[0]}
                      {employee.last_name?.[0]}
                    </div>
                  )}

                  <div>
                    <h2>
                      {employee.first_name} {employee.last_name}
                    </h2>
                    <p className="employee-position">
                      {employee.position}
                    </p>
                  </div>
                </div>

                <div className="employee-info">
                  <span>
                    <strong>Department:</strong>{" "}
                    {employee.department}
                  </span>

                  <span>
                    <strong>Email:</strong> {employee.email}
                  </span>

                  <span>
                    <strong>Salary:</strong>{" "}
                    {Number(employee.salary).toLocaleString(
                      "en-CA",
                      {
                        style: "currency",
                        currency: "CAD",
                      }
                    )}
                  </span>
                </div>

                <div className="card-actions">
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
                    onClick={() => handleDelete(employee)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default EmployeeList;
