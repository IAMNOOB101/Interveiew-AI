import { useState } from "react";
import api from "../services/api";

export default function InterviewSetup() {
  const [domain, setDomain] = useState("backend_developer");
  const [language, setLanguage] = useState("en");

  const submitProfile = async () => {
    await api.post("/interview/setup", {
      domain,
      experienceLevel: "fresher",
      salaryRange: { min: 3, max: 6 },
      language
    });
    alert("Interview profile saved");
  };

  return (
    <div>
      <h2>Interview Setup</h2>

      <select onChange={e => setDomain(e.target.value)}>
        <option value="backend_developer">Backend Developer</option>
        <option value="frontend_developer">Frontend Developer</option>
        <option value="intern">Intern</option>
      </select>

      <select onChange={e => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>

      <button onClick={submitProfile}>Save</button>
    </div>
  );
}
