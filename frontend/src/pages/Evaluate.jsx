import { useState } from "react";
import api from "../services/api";

export default function Evaluate() {
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const submitAnswer = async () => {
    const res = await api.post("/interview/evaluate", {
      question: "Explain JWT authentication",
      answer
    });
    setEvaluation(res.data.evaluation);
  };

  return (
    <div>
      <textarea onChange={e => setAnswer(e.target.value)} />
      <button onClick={submitAnswer}>Evaluate</button>

      {evaluation && (
        <pre>{JSON.stringify(evaluation, null, 2)}</pre>
      )}
    </div>
  );
}
