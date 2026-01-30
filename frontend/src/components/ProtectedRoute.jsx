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
  if (!allowed) return <Navigate to="/" />;

  return children;
}
