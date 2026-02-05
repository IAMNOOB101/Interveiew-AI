import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import logo from "../assets/logo.svg";
import "./Navbar.css";

export default function Navbar({ isAdmin }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const btnRef = useRef(null);

  const logout = async () => {
    await api.post("/auth/logout");
    navigate("/login");
  };

  const toggle = () => setOpen((s) => !s);

  // use focus trap hook
  useMenuFocusTrap(open, setOpen, navRef, btnRef);

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <img src={logo} alt="InterviewAI" style={{ height: 36 }} />
      </Link>

      <div ref={navRef} className={`nav-links ${open ? "open" : ""}`} onClick={() => setOpen(false)} role="navigation">
        {!isAdmin && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/setup">Interview Setup</Link>
            <Link to="/history">History</Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/attempts">Attempts</Link>
            <Link to="/admin/analytics">Analytics</Link>
          </>
        )}

        <div className="spacer" />
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <button ref={btnRef} className={`hamburger ${open ? "open" : ""}`} onClick={toggle} aria-label="Toggle menu" aria-expanded={open}>
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>
    </nav>
  );
}

// Focus trap + keyboard handling
function useMenuFocusTrap(open, setOpen, navRef, btnRef) {
  useEffect(() => {
    if (!open) return;

    const node = navRef.current;
    if (!node) return;

    const selector = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(node.querySelectorAll(selector)).filter((el) => el.offsetParent !== null);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Focus first element when opening
    const focusTimer = setTimeout(() => first?.focus?.(), 50);

    function onKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }

      if (e.key === "Tab") {
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      // restore focus to hamburger when closing
      btnRef.current?.focus();
    };
  }, [open, setOpen, navRef, btnRef]);
}

// Hook usage
// Note: placed after component definition to keep file organized
useMenuFocusTrap; // ensure linter doesn't remove the function
