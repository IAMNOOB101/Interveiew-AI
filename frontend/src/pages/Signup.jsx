import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("professional");
  const [experience, setExperience] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [domain, setDomain] = useState("");
  const [role, setRole] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("password", password);
      form.append("accountType", accountType);
      form.append("experience", experience);
      form.append("salaryRange", salaryRange);
      form.append("domain", domain);
      form.append("role", role);
      if (resumeFile) form.append("resume", resumeFile);

      await api.post("/auth/register", form);

      alert("Signup successful. Please login.");
      navigate("/"); // redirect to login
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
        <option value="professional">Professional</option>
        <option value="student">Student (Institution)</option>
        <option value="guest">Guest</option>
      </select>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input placeholder="Domain (eg. college.edu)" value={domain} onChange={(e) => setDomain(e.target.value)} />

      <input placeholder="Experience (e.g., 2 years)" value={experience} onChange={(e) => setExperience(e.target.value)} />

      <input placeholder="Desired salary (e.g., 8 LPA)" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} />

      <input placeholder="Role (e.g., Software Engineer)" value={role} onChange={(e) => setRole(e.target.value)} />

      <div style={{ marginTop: 6 }}>
        <label className="muted">Resume (PDF)</label>
        <input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
      </div>

      <button onClick={handleSignup}>Create Account</button>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
