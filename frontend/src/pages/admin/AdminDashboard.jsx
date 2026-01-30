import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <Navbar isAdmin={true} />
      <h1>Admin Dashboard</h1>
      {/* <nav>
        <Link to="/admin/users">Users</Link> |{" "}
        <Link to="/admin/attempts">Attempts</Link> |{" "}
        <Link to="/admin/analytics">Analytics</Link>
      </nav> */}
      <Outlet />
    </div>
  );
}
