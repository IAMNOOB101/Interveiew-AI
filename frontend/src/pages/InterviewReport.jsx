import { useParams, useEffect, useState } from "react";
import api from "../services/api";

export default function InterviewReport() {
  const { sessionId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    api
      .get(`/interview/session/report/${sessionId}`)
      .then((res) => setReport(res.data.report))
      .catch(() => alert("Failed to load report"));
  }, []);

  if (!report) return <p>Loading...</p>;

  return (
    <div>
      <h2>Interview Report</h2>

      <p>
        <b>Final Score:</b> {report.finalScore}
      </p>
      <p>
        <b>Confidence Level:</b> {report.confidenceLevel}
      </p>

      <h3>Strengths</h3>
      <ul>
        {report.strengths.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h3>Weaknesses</h3>
      <ul>
        {report.weaknesses.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </div>
  );
}
