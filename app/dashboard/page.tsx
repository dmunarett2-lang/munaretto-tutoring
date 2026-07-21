import { redirect } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/money";
import type { Order, StudentProgress, StudentSession, StudentResource } from "@/lib/types";

export const metadata = { title: "Dashboard — Munaretto Tutoring" };

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "name, role, sessions_remaining, act_goal_english, act_goal_math, act_goal_reading, act_goal_science, act_goal_writing, act_score_english, act_score_math, act_score_reading, act_score_science, act_score_writing",
    )
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect("/admin");

  const [{ data: ordersData }, { data: settingsData }, { data: progressData }, { data: sessionsData }, { data: resourcesData }] =
    await Promise.all([
      supabase.from("orders").select("*").eq("student_id", user.id).order("created_at", { ascending: false }),
      supabase.from("app_settings").select("zelle_handle").eq("id", 1).single(),
      supabase.from("student_progress").select("*").eq("student_id", user.id).order("sort_order"),
      supabase.from("student_sessions").select("*").eq("student_id", user.id).order("sort_order"),
      supabase.from("student_resources").select("*").eq("student_id", user.id).order("sort_order"),
    ]);

  const orders = (ordersData ?? []) as Order[];
  const pending = orders.filter((o) => o.status === "pending");
  const zelle = settingsData?.zelle_handle as string | undefined;
  const progress = (progressData ?? []) as StudentProgress[];
  const sessions = (sessionsData ?? []) as StudentSession[];
  const resources = (resourcesData ?? []) as StudentResource[];

  const firstName = profile?.name?.split(" ")[0] || "there";
  const remaining = profile?.sessions_remaining ?? 0;

  const actSections = [
    { label: "English", score: profile?.act_score_english, goal: profile?.act_goal_english },
    { label: "Math", score: profile?.act_score_math, goal: profile?.act_goal_math },
    { label: "Reading", score: profile?.act_score_reading, goal: profile?.act_goal_reading },
    { label: "Science", score: profile?.act_score_science, goal: profile?.act_goal_science },
    { label: "Writing", score: profile?.act_score_writing, goal: profile?.act_goal_writing },
  ];
  const hasActGoals = actSections.some((s) => s.score != null || s.goal != null);

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

        {/* session balance */}
        <div className="stat-row">
          <div className="stat-card">
            <div className="stat-num">{remaining}</div>
            <div className="stat-label">
              {remaining === 1 ? "session" : "sessions"} remaining
            </div>
          </div>
          <div className="stat-cta card">
            <div>
              <h3 style={{ marginBottom: 6 }}>Need more sessions?</h3>
              <p style={{ color: "var(--slate)", fontSize: "0.9rem" }}>
                Browse packages or build a custom plan.
              </p>
            </div>
            <Link href="/pricing" className="pricing-cta" style={{ alignSelf: "flex-start", padding: "10px 18px" }}>
              View packages →
            </Link>
          </div>
        </div>

        {/* pending payment instructions */}
        {pending.length > 0 && (
          <div className="card" style={{ marginBottom: 26, borderColor: "var(--gold)" }}>
            <h3>Payment pending</h3>
            <p style={{ color: "var(--slate)", fontSize: "0.9rem", marginBottom: 14 }}>
              To complete {pending.length === 1 ? "this order" : "these orders"}, send payment by
              Zelle{zelle ? <> to <strong style={{ color: "var(--ink)" }}>{zelle}</strong></> : ""}.
              Include your name so it can be matched. Sessions are credited once Dominic confirms
              the payment.
            </p>
            {pending.map((o) => (
              <div className="session-row" key={o.id}>
                <div>
                  <div className="session-sub">{o.package_name}</div>
                  <div style={{ color: "var(--slate)", fontSize: "0.85rem" }}>
                    {o.sessions} {o.sessions === 1 ? "session" : "sessions"}
                  </div>
                </div>
                <div className="session-when">{formatPrice(o.amount_cents)} · awaiting payment</div>
              </div>
            ))}
          </div>
        )}

        {hasActGoals && (
          <div className="card" style={{ marginBottom: 26 }}>
            <h3>ACT scores &amp; goals</h3>
            <div className="act-goals">
              {actSections.map((s) => (
                <div className="act-goal" key={s.label}>
                  <div className="act-goal-label">{s.label}</div>
                  <div className="act-goal-num">
                    {s.goal != null
                      ? `${s.score ?? "—"} / ${s.goal}`
                      : s.score != null
                        ? s.score
                        : "—"}
                  </div>
                  {s.goal != null && <div className="act-goal-sub">score / goal</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dash-grid">
          <div className="card">
            <h3>Upcoming sessions</h3>
            {sessions.length === 0 ? (
              <div className="empty-state">No sessions scheduled yet.</div>
            ) : (
              sessions.map((s) => (
                <div className="session-row" key={s.id}>
                  <div>
                    <div className="session-sub">{s.title}</div>
                    {s.subtitle && (
                      <div style={{ color: "var(--slate)", fontSize: "0.85rem" }}>{s.subtitle}</div>
                    )}
                  </div>
                  {s.when_text && <div className="session-when">{s.when_text}</div>}
                </div>
              ))
            )}
          </div>

          <div className="card">
            <h3>Progress</h3>
            {progress.length === 0 ? (
              <div className="empty-state">Progress updates will show up here.</div>
            ) : (
              progress.map((p) => {
                const goal = p.goal_score;
                let detail: string | null;
                let pct: number;
                if (goal != null && goal > 0) {
                  detail = `${p.current_score ?? "—"} / ${goal}`;
                  pct =
                    p.current_score != null
                      ? Math.min(100, Math.round((p.current_score / goal) * 100))
                      : 0;
                } else {
                  detail = p.detail;
                  pct = p.percent;
                }
                return (
                  <div className="progress-item" key={p.id}>
                    <div className="progress-top">
                      <span>{p.label}</span>
                      {detail && <span>{detail}</span>}
                    </div>
                    <div className="bar">
                      <div className="bar-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="card" style={{ gridColumn: "1/-1" }}>
            <h3>Resources</h3>
            {resources.length === 0 ? (
              <div className="empty-state">Shared resources will appear here.</div>
            ) : (
              resources.map((r) =>
                r.url ? (
                  <a
                    className="resource-link"
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{r.label}</span>
                    <span>Open →</span>
                  </a>
                ) : (
                  <div className="resource-link" key={r.id}>
                    <span>{r.label}</span>
                  </div>
                ),
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
