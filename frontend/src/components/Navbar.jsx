import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Navbar({ isAdmin }) {
  const navigate = useNavigate();

  const logout = async () => {
    await api.post("/auth/logout");
    navigate("/");
  };

  return (
    <nav style={{ display: "flex", gap: "15px", padding: "10px" }}>
      {!isAdmin && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/setup">Interview Setup</Link>
          <Link to="/history">History</Link>
        </>
      )}

      {isAdmin && (
        <>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/attempts">Attempts</Link>
          <Link to="/admin/analytics">Analytics</Link>
        </>
      )}

      <button onClick={logout} style={{ marginLeft: "auto" }}>
        Logout
      </button>
    </nav>
  );
}
