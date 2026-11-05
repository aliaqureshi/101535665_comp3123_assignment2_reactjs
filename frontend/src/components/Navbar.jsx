import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <Link to="/employees" className="navbar-brand">
        Employee Manager
      </Link>

      <div className="navbar-links">
        <Link to="/employees">Employees</Link>
        <Link to="/employees/add">Add Employee</Link>

        {user?.username && (
          <span className="navbar-user">{user.username}</span>
        )}

        <button
          type="button"
          className="btn btn-outline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
