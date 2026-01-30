import { useState } from "react";
import api from "../services/api";

export default function Question() {
  const [question, setQuestion] = useState("");

  const getQuestion = async () => {
    const res = await api.post("/interview/generate-question");
    setQuestion(res.data.question);
  };

  return (
    <div>
      <button onClick={getQuestion}>Generate Question</button>
      <h3>{question}</h3>
    </div>
  );
}
