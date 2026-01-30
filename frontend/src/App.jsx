import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import InterviewReport from "./pages/InterviewReport";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Attempts from "./pages/admin/Attempts";
import Analytics from "./pages/admin/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";
import InterviewSetup from "./pages/InterviewSetup";
import Question from "./pages/Question";
import Evaluate from "./pages/Evaluate";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setup" element={<InterviewSetup />} />
        <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
        <Route path="/report/:sessionId" element={<ProtectedRoute><InterviewReport /></ProtectedRoute>} />
        <Route path="/question" element={<Question />} />
        <Route path="/evaluate" element={<Evaluate />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<ProtectedRoute role={"ADMIN"}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/attempts" element={<ProtectedRoute role={"ADMIN"}><Attempts /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute role={"ADMIN"}><Analytics /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
