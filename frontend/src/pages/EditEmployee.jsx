import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { getImageUrl } from "../services/api";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    salary: "",
    date_of_joining: "",
    department: "",
  });

  const [existingPicture, setExistingPicture] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const response = await api.get(`/emp/employees/${id}`);
        const employee = response.data.employee;

        setForm({
          first_name: employee.first_name || "",
          last_name: employee.last_name || "",
          email: employee.email || "",
          position: employee.position || "",
          salary: employee.salary ?? "",
          date_of_joining: employee.date_of_joining
            ? employee.date_of_joining.slice(0, 10)
            : "",
          department: employee.department || "",
        });

        setExistingPicture(employee.profile_picture || "");
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

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setError("");

    if (!file) {
      setProfilePicture(null);
      setPreview("");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      event.target.value = "";
      setError("Profile picture must be JPEG, PNG, or WebP.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      event.target.value = "";
      setError("Profile picture must not exceed 2 MB.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      Object.values(form).some(
        (value) => String(value).trim() === ""
      )
    ) {
      setError("All employee fields are required.");
      return;
    }

    if (Number(form.salary) < 0) {
      setError("Salary cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (profilePicture) {
        data.append("profile_picture", profilePicture);
      }

      await api.put(`/emp/employees/${id}`, data);

      navigate(`/employees/${id}`, { replace: true });
    } catch (err) {
      const validationErrors = err.response?.data?.errors;

      setError(
        validationErrors?.[0]?.msg ||
          err.response?.data?.message ||
          "Unable to update employee."
      );
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <>
      <Navbar />

      <main className="page-container narrow-container">
        <div className="page-header">
          <div>
            <h1>Edit Employee</h1>
            <p>Update employee information or profile picture.</p>
          </div>

          <Link
            to={`/employees/${id}`}
            className="btn btn-secondary"
          >
            Back
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Position</label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Salary</label>
              <input
                name="salary"
                type="number"
                min="0"
                step="0.01"
                value={form.salary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Joining</label>
              <input
                name="date_of_joining"
                type="date"
                value={form.date_of_joining}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Department</label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Replace Profile Picture</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />
              <small>JPEG, PNG or WebP. Maximum size: 2 MB.</small>
            </div>
          </div>

          {(preview || existingPicture) && (
            <div className="image-preview-section">
              <p>
                {preview
                  ? "New Profile Picture"
                  : "Current Profile Picture"}
              </p>

              <img
                src={
                  preview ||
                  getImageUrl(existingPicture)
                }
                alt="Employee profile"
                className="profile-preview"
              />
            </div>
          )}

          <div className="form-actions">
            <Link
              to={`/employees/${id}`}
              className="btn btn-secondary"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default EditEmployee;
