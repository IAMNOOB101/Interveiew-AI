import { useEffect, useRef, useState } from "react";
import api from "../services/api";

export default function History() {
  const [history, setHistory] = useState([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    api.get("/interview/history")
      .then(res => setHistory(res.data.interviews || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Interview History</h2>

      {history.length === 0 && <p>No interviews yet.</p>}

      {history.map(h => (
        <div key={h.sessionId}>
          <p>Date: {new Date(h.date).toLocaleString()}</p>
          <b>Score: {h.score}</b>
          <p>Confidence: {h.confidenceLevel}</p>
        </div>
      ))}
    </div>
  );
}
