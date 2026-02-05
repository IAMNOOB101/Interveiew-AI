import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Home() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", background: "#f7fbff" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 16, padding: 20 }}>
        <img src={logo} alt="InterviewAI" style={{ width: 140 }} />
        <nav style={{ marginLeft: "auto" }}>
          <Link to="/login" style={{ marginRight: 12, color: "#0b69ff" }}>Login</Link>
          <Link to="/signup" style={{ color: "#0b69ff" }}>Signup</Link>
        </nav>
      </header>

      <main style={{ padding: "40px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#034ea2", fontSize: 40 }}>InterviewAI — Practice interviews, get smarter</h1>
        <p style={{ color: "#2b3a4b", maxWidth: 800, margin: "12px auto" }}>
          AI-driven interview practice for students and professionals. Live facial & voice analysis,
          resume-driven question generation, explainable feedback, and institution-sponsored plans.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <Link to="/signup" style={{ background: "#0b69ff", color: "white", padding: "12px 20px", borderRadius: 8, textDecoration: "none" }}>Get Started</Link>
          <Link to="/dashboard" style={{ background: "#ffffff", color: "#0b69ff", border: "1px solid #e6f0ff", padding: "12px 20px", borderRadius: 8, textDecoration: "none" }}>Try Demo</Link>
        </div>

        <section style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ background: "white", padding: 20, borderRadius: 12, boxShadow: "0 4px 14px rgba(11,105,255,0.06)" }}>
            <h3 style={{ color: "#034ea2" }}>Resume-driven Qs</h3>
            <p>Generate interview questions tailored to your experience, role and salary expectations.</p>
          </div>
          <div style={{ background: "white", padding: 20, borderRadius: 12, boxShadow: "0 4px 14px rgba(11,105,255,0.06)" }}>
            <h3 style={{ color: "#034ea2" }}>Live Analysis</h3>
            <p>Real-time facial and voice confidence scoring during mock interviews.</p>
          </div>
          <div style={{ background: "white", padding: 20, borderRadius: 12, boxShadow: "0 4px 14px rgba(11,105,255,0.06)" }}>
            <h3 style={{ color: "#034ea2" }}>Explainable Feedback</h3>
            <p>Actionable strengths & improvements after each interview attempt.</p>
          </div>
        </section>
      </main>

      <footer style={{ padding: 20, textAlign: "center", color: "#556" }}>
        © {new Date().getFullYear()} InterviewAI — All rights reserved.
      </footer>
    </div>
  );
}
