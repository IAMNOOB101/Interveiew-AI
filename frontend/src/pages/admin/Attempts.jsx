import { useEffect, useState } from "react";
import { getAllAttempts } from "../../services/adminApi";

export default function Attempts() {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    getAllAttempts()
      .then(res => setAttempts(res.data.attempts))
      .catch(() => alert("Access denied"));
  }, []);

  return (
    <div>
      <h2>Interview Attempts</h2>

      {attempts.map(a => (
        <div key={a._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p><b>User:</b> {a.userId?.email}</p>
          <p><b>Domain:</b> {a.domain}</p>
          <p><b>Question:</b> {a.question}</p>
          <p><b>Score:</b> {a.evaluation.overallScore}</p>
        </div>
      ))}
    </div>
  );
}
