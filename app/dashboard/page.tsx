import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard — Munaretto Tutoring" };

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated users; this is defense in depth.
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .single();

  // Admins have their own view.
  if (profile?.role === "admin") redirect("/admin");

  const firstName = profile?.name?.split(" ")[0] || "there";

  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div className="app-header">
          <div>
            <div className="app-eyebrow">Student dashboard</div>
            <div className="app-title">Welcome back, {firstName}</div>
          </div>
          <LogoutButton />
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
