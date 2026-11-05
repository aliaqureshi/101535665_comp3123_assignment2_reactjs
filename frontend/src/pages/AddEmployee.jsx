import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  position: "",
  salary: "",
  date_of_joining: "",
  department: "",
};

const AddEmployee = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setProfilePicture(null);
      setPreview("");
      setError("Profile picture must be JPEG, PNG, or WebP.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      event.target.value = "";
      setProfilePicture(null);
      setPreview("");
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

    const requiredFields = Object.values(form).every(
      (value) => String(value).trim() !== ""
    );

    if (!requiredFields) {
      setError("All employee fields are required.");
      return;
    }

    if (Number(form.salary) < 0) {
      setError("Salary cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (profilePicture) {
        data.append("profile_picture", profilePicture);
      }

      await api.post("/emp/employees", data);

      navigate("/employees", { replace: true });
    } catch (err) {
      const validationErrors = err.response?.data?.errors;

      setError(
        validationErrors?.[0]?.msg ||
          err.response?.data?.message ||
          "Unable to create employee."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="page-container narrow-container">
        <div className="page-header">
          <div>
            <h1>Add Employee</h1>
            <p>Create a new employee record.</p>
          </div>

          <Link to="/employees" className="btn btn-secondary">
            Back
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                id="position"
                name="position"
                value={form.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salary</label>
              <input
                id="salary"
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
              <label htmlFor="date_of_joining">
                Date of Joining
              </label>
              <input
                id="date_of_joining"
                name="date_of_joining"
                type="date"
                value={form.date_of_joining}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="profile_picture">
                Profile Picture
              </label>

              <input
                id="profile_picture"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />

              <small>JPEG, PNG or WebP. Maximum size: 2 MB.</small>
            </div>
          </div>

          {preview && (
            <div className="image-preview-section">
              <p>Image Preview</p>
              <img
                src={preview}
                alt="Profile preview"
                className="profile-preview"
              />
            </div>
          )}

          <div className="form-actions">
            <Link to="/employees" className="btn btn-secondary">
              Cancel
            </Link>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default AddEmployee;
