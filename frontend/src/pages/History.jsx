import { useEffect, useState } from "react";
import api from "../services/api";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("/interview/history").then(res => setHistory(res.data.history));
  }, []);

  return (
    <div>
      <h2>Interview History</h2>
      {history.map(h => (
        <div key={h._id}>
          <p>{h.question}</p>
          <b>Score: {h.evaluation.overallScore}</b>
        </div>
      ))}
    </div>
  );
}
