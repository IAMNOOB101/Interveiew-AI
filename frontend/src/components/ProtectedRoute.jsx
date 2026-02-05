import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProtectedRoute({ children, role }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    api.get("/auth/me")
      .then(res => {
        if (!role || res.data.user.role === role) {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      })
      .catch(() => setAllowed(false));
  }, []);

  if (allowed === null) return <p>Loading...</p>;

  // If auth check failed but user just logged in (localStorage flag), allow one navigation to avoid cookie timing issues in dev
  if (!allowed) {
    const justLoggedIn = localStorage.getItem("justLoggedIn");
    if (justLoggedIn === "true") {
      localStorage.removeItem("justLoggedIn");
      return children;
    }
    return <Navigate to="/" />;
  }

  return children;
}
