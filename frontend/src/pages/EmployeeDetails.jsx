import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { getImageUrl } from "../services/api";

const EmployeeDetails = () => {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/emp/employees/${id}`);
        setEmployee(response.data.employee);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load employee."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="status-card">Loading employee...</div>
        </main>
      </>
    );
  }

  if (error || !employee) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="alert alert-error">
            {error || "Employee not found."}
          </div>

          <Link to="/employees" className="btn btn-secondary">
            Back to Employees
          </Link>
        </main>
      </>
    );
  }

  const joiningDate = employee.date_of_joining
    ? new Date(
        `${employee.date_of_joining.slice(0, 10)}T12:00:00`
      ).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const salary = Number(employee.salary).toLocaleString(
    "en-CA",
    {
      style: "currency",
      currency: "CAD",
    }
  );

  return (
    <>
      <Navbar />

      <main className="page-container narrow-container">
        <div className="page-header">
          <div>
            <h1>Employee Details</h1>
            <p>View the complete employee record.</p>
          </div>

          <Link to="/employees" className="btn btn-secondary">
            Back
          </Link>
        </div>

        <section className="details-card">
          <div className="details-profile">
            {employee.profile_picture ? (
              <img
                src={getImageUrl(employee.profile_picture)}
                alt={`${employee.first_name} ${employee.last_name}`}
                className="details-avatar"
              />
            ) : (
              <div className="details-avatar placeholder">
                {employee.first_name?.[0]}
                {employee.last_name?.[0]}
              </div>
            )}

            <div>
              <h2>
                {employee.first_name} {employee.last_name}
              </h2>
              <p>{employee.position}</p>
            </div>
          </div>

          <div className="details-grid">
            <div>
              <span className="details-label">Email</span>
              <strong>{employee.email}</strong>
            </div>

            <div>
              <span className="details-label">Department</span>
              <strong>{employee.department}</strong>
            </div>

            <div>
              <span className="details-label">Position</span>
              <strong>{employee.position}</strong>
            </div>

            <div>
              <span className="details-label">Salary</span>
              <strong>{salary}</strong>
            </div>

            <div>
              <span className="details-label">Date of Joining</span>
              <strong>{joiningDate}</strong>
            </div>
          </div>

          <div className="form-actions">
            <Link
              to={`/employees/${employee._id}/edit`}
              className="btn btn-primary"
            >
              Edit Employee
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default EmployeeDetails;
