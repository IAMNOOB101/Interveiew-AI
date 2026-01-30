import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <>
      <Navbar isAdmin={false} />

      <h1>User Dashboard</h1>
      <Link to="/interview">
        <button>Start Mock Interview</button>
      </Link>
    </>
  );
}
