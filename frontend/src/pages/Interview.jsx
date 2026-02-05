import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useMediaStream } from "../hooks/useMediaStream";
import { submitAnswer as submitInterviewAnswer } from "../services/interview.service";
import { startSpeechRecognition } from "../hooks/useSpeechToText";
import FaceMonitor from "../components/FaceMonitor";
import { getVoiceConfidence } from "../utils/voiceConfidence";
import { getFacialConfidence } from "../utils/facialConfidence";

export default function Interview() {
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  const navigate = useNavigate();
  const { mediaStream, error: mediaError } = useMediaStream();

  const startInterview = async () => {
    try {
      if (mediaError) {
      alert(mediaError);
      return;
    }

    if (!mediaStream) {
      alert(
        "Camera and microphone access is mandatory to start the interview.",
      );
      return;
    }

      const res = await api.post("/interview/session/start");
      setLastResponse(res.data);
      setSessionId(res.data.sessionId);
      setQuestion(res.data.question || "");
    } catch (err) {
      console.error("startInterview error", err);
      alert(err?.response?.data?.message || "Unable to start interview");
    }
  };

  const startAudio = () => {
    const rec = startSpeechRecognition(setAnswer);
    setRecognition(rec);
  };

  const stopAudio = () => {
    if (recognition) recognition.stop();
  };

  const submitAnswer = async () => {
    if (!mediaStream) {
      alert("Camera and microphone access is required.");
      return;
    }

    if (!answer || !answer.trim()) {
      alert("Please provide an answer before submitting.");
      return;
    }

    const voice = await getVoiceConfidence(mediaStream);
    const facial = getFacialConfidence();

    if (typeof voice !== "number" || typeof facial !== "number") {
      alert("Unable to capture confidence signals. Please retry.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitInterviewAnswer({
        sessionId,
        answerText: answer,
        confidence: { voice, facial },
      });

      setLastResponse(res.data);

      setAnswer("");

      if (!res.data.completed) setQuestion(res.data.nextQuestion || "");
      else navigate(`/report/${sessionId}`);
    } catch (err) {
      console.error("submitAnswer error", err);
      alert(err?.response?.data?.message || "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={startInterview}>Start Interview</button>
        <div style={{ fontSize: 13, color: "#666" }}>Session: {sessionId || "(not started)"}</div>
      </div>

      <h3>{question || "No question yet"}</h3>

      <FaceMonitor onFlag={(flag) => console.log(flag)} />

      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} />

      <button onClick={startAudio}>🎤 Speak</button>
      <button onClick={stopAudio}>⏹ Stop</button>
      <button onClick={submitAnswer} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Answer"}
      </button>

      <div style={{ marginTop: 18 }}>
        <h4>Debug</h4>
        <div style={{ fontSize: 13, color: "#333" }}>
          <div>Media error: {mediaError || "none"}</div>
          <div>Recognition: {recognition ? "active" : "inactive"}</div>
        </div>
        <pre style={{ background: "#fafafa", padding: 8, borderRadius: 6, maxHeight: 240, overflow: "auto" }}>{JSON.stringify(lastResponse, null, 2)}</pre>
      </div>
    </div>
  );
}
