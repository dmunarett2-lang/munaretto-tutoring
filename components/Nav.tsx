"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { checkCredentials, setSession, DEMO_HINTS, type Role } from "@/lib/auth";

export default function Nav() {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // close the dropdown on any outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function handleLogin() {
    // PLACEHOLDER auth — replaced by Supabase in the next milestone.
    const user = checkCredentials(tab, email, password);
    if (!user) {
      setError(true);
      return;
    }
    setSession(user);
    setOpen(false);
    setEmail("");
    setPassword("");
    setError(false);
    router.push(user.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <nav>
      <div className="wrap nav-inner">
        <Link href="/" className="logo">
          Munaretto <span>Tutoring</span>
        </Link>
        <div className="nav-links">
          <Link href="/#services">Services</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/#about">About</Link>
          <Link href="/#results">Results</Link>

          <div className="login-wrap" ref={wrapRef}>
            <button
              className={`login-btn${open ? " open" : ""}`}
              onClick={() => setOpen((v) => !v)}
            >
              Log in <span className="caret">▾</span>
            </button>
            <div className={`login-menu${open ? " show" : ""}`}>
              <div className="login-tabs">
                <button
                  className={`login-tab${tab === "student" ? " active" : ""}`}
                  onClick={() => {
                    setTab("student");
                    setError(false);
                  }}
                >
                  Student
                </button>
                <button
                  className={`login-tab${tab === "admin" ? " active" : ""}`}
                  onClick={() => {
                    setTab("admin");
                    setError(false);
                  }}
                >
                  Admin
                </button>
              </div>
              <div className={`login-error${error ? " show" : ""}`}>
                Email or password not recognized.
              </div>
              <label className="field-label">Email</label>
              <input
                className="field"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <label className="field-label">Password</label>
              <input
                className="field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button className="submit-btn" onClick={handleLogin}>
                Log in
              </button>
              <div className="login-hint">{DEMO_HINTS[tab]}</div>
            </div>
          </div>

          <Link href="/#contact" className="nav-cta">
            Book a consult
          </Link>
        </div>
      </div>
    </nav>
  );
}
