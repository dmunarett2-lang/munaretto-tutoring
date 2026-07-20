"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { getSession, clearSession, type DemoUser } from "@/lib/auth";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<DemoUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // PLACEHOLDER gate — NOT security. Anyone can reach this route directly;
    // real protection (middleware + server session check) arrives with Supabase.
    const session = getSession();
    if (!session || session.role !== "student") {
      router.replace("/");
      return;
    }
    setUser(session);
    setChecked(true);
  }, [router]);

  if (!checked || !user) return null;

  const firstName = user.name ? user.name.split(" ")[0] : "there";

  function logout() {
    clearSession();
    router.replace("/");
  }

  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div className="demo-banner">
          <strong>Placeholder dashboard.</strong> This is demo data behind a demo login — not real
          authentication. Real student accounts and data arrive with Supabase.
        </div>

        <div className="app-header">
          <div>
            <div className="app-eyebrow">Student dashboard</div>
            <div className="app-title">Welcome back, {firstName}</div>
          </div>
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>

        <div className="dash-grid">
          <div className="card">
            <h3>Upcoming sessions</h3>
            <div className="session-row">
              <div>
                <div className="session-sub">ACT Reading — timed section review</div>
                <div style={{ color: "var(--slate)", fontSize: "0.85rem" }}>with Dominic</div>
              </div>
              <div className="session-when">Thu, 4:30 PM</div>
            </div>
            <div className="session-row">
              <div>
                <div className="session-sub">Personal statement — 2nd draft edit</div>
                <div style={{ color: "var(--slate)", fontSize: "0.85rem" }}>with Dominic</div>
              </div>
              <div className="session-when">Sat, 11:00 AM</div>
            </div>
            <div className="session-row">
              <div>
                <div className="session-sub">Full-length practice test</div>
                <div style={{ color: "var(--slate)", fontSize: "0.85rem" }}>self-paced, timed</div>
              </div>
              <div className="session-when">Next Mon</div>
            </div>
          </div>

          <div className="card">
            <h3>Progress</h3>
            <div className="progress-item">
              <div className="progress-top">
                <span>ACT Composite (practice avg)</span>
                <span>27 → 31</span>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-top">
                <span>Personal statement</span>
                <span>Draft 2 of 3</span>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-top">
                <span>School list finalized</span>
                <span>6 of 8</span>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: "75%" }}></div>
              </div>
            </div>
          </div>

          <div className="card" style={{ gridColumn: "1/-1" }}>
            <h3>Resources</h3>
            <div className="resource-link">
              <span>ACT Science — pacing worksheet</span>
              <span>Open →</span>
            </div>
            <div className="resource-link">
              <span>Personal statement — brainstorming doc</span>
              <span>Open →</span>
            </div>
            <div className="resource-link">
              <span>Common App — deadline tracker</span>
              <span>Open →</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
