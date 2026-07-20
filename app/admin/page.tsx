import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Inquiry } from "@/lib/types";

export const metadata = { title: "Admin — Munaretto Tutoring" };

export default async function Admin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Admin-only. Non-admins get bounced to their own dashboard.
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: studentsData } = await supabase
    .from("profiles")
    .select("id, name, email, focus, next_session, role, created_at")
    .eq("role", "student")
    .order("created_at", { ascending: true });

  const { data: inquiriesData } = await supabase
    .from("inquiries")
    .select("id, name, email, message, status, created_at")
    .order("created_at", { ascending: false });

  const students = (studentsData ?? []) as Profile[];
  const inquiries = (inquiriesData ?? []) as Inquiry[];

  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div className="app-header">
          <div>
            <div className="app-eyebrow">Admin</div>
            <div className="app-title">Dominic&apos;s dashboard</div>
          </div>
          <LogoutButton />
        </div>

        <div className="admin-tables">
          <div className="card">
            <h3>Students</h3>
            {students.length === 0 ? (
              <div className="empty-state">
                No students yet — accounts created through the sign-up page will appear here.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Focus</th>
                    <th>Email</th>
                    <th>Next session</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name || "—"}</td>
                      <td>{s.focus || "—"}</td>
                      <td>{s.email}</td>
                      <td>{s.next_session || "Not scheduled"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <h3>Consult requests</h3>
            {inquiries.length === 0 ? (
              <div className="empty-state">
                No consult requests yet — submissions from the home-page contact form show up here.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((iq) => (
                    <tr key={iq.id}>
                      <td>{iq.name}</td>
                      <td>{iq.email}</td>
                      <td style={{ maxWidth: "260px" }}>{iq.message}</td>
                      <td>
                        <span className="pill new">{iq.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
