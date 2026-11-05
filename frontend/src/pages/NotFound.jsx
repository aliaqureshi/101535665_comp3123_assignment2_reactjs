import { Link } from "react-router-dom";

const NotFound = () => (
  <div>
    <h1>404 - Page Not Found</h1>
    <Link to="/employees">Return to Employees</Link>
  </div>
);

export default NotFound;
