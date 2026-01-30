import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { startSpeechRecognition } from "../hooks/useSpeechToText";
import FaceMonitor from "../components/FaceMonitor";

export default function Interview() {
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();

  const startInterview = async () => {
    const res = await api.post("/interview/session/start");
    setSessionId(res.data.sessionId);
    setQuestion(res.data.question);
  };

  const startAudio = () => {
    const rec = startSpeechRecognition(setAnswer);
    setRecognition(rec);
  };

  const stopAudio = () => recognition && recognition.stop();

  const submitAnswer = async () => {
    const res = await api.post("/interview/session/submit", {
      sessionId,
      answerText: answer,
    });

    setAnswer("");

    if (!res.data.completed) {
      setQuestion(res.data.nextQuestion);
    } else {
      if (sessionId) {
        navigate(`/report/${sessionId}`);
      } else {
        alert("Session ID missing");
      }
    }
  };

  return (
    <div>
      <button onClick={startInterview}>Start Interview</button>
      <h3>{question}</h3>

      <FaceMonitor onFlag={(flag) => console.log(flag)} />
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} />

      <button onClick={startAudio}>🎤 Speak</button>
      <button onClick={stopAudio}>⏹ Stop</button>
      <button onClick={submitAnswer}>Submit Answer</button>
    </div>
  );
}
