import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/theme.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      // Use login response (server provides accountType) to avoid relying on cookies in dev
      const accountType = res.data?.accountType;
      if (accountType === "admin" || accountType === "ADMIN") {
        localStorage.setItem("justLoggedIn", "true");
        navigate("/admin");
      } else {
        localStorage.setItem("justLoggedIn", "true");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="center-card">
        <div className="brand-head">
          <img src="/src/assets/logo.svg" alt="InterviewAI" />
          <div>
            <h2 style={{ margin: 0, color: "var(--brand-700)" }}>Welcome back</h2>
            <div className="muted">Sign in to continue to InterviewAI</div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div className="form-row">
            <label className="muted">Email</label>
            <input placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-row">
            <label className="muted">Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button className="btn" onClick={handleLogin}>Sign in</button>
            <Link to="/signup" className="btn secondary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Create account</Link>
          </div>

          <div style={{ marginTop: 12 }} className="muted">Or continue as a <Link to="/signup">guest</Link>.</div>
        </div>
      </div>
    </div>
  );
}
