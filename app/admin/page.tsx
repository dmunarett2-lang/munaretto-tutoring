import Link from "next/link";
import Nav from "@/components/Nav";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { requireAdmin } from "@/lib/supabase/guards";
import type { Profile, Inquiry, Order } from "@/lib/types";

export const metadata = { title: "Admin — Munaretto Tutoring" };

export default async function Admin() {
  const { supabase } = await requireAdmin();

  const [{ data: studentsData }, { data: inquiriesData }, { data: ordersData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, name, email, focus, sessions_remaining, role, created_at")
      .eq("role", "student")
      .order("created_at", { ascending: true }),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("*").eq("status", "pending"),
  ]);

  const students = (studentsData ?? []) as Profile[];
  const inquiries = (inquiriesData ?? []) as Inquiry[];
  const pendingOrders = (ordersData ?? []) as Order[];

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
        <AdminNav />

        {pendingOrders.length > 0 && (
          <div className="demo-banner" style={{ background: "#FBF3E4", borderColor: "var(--gold)" }}>
            <strong>
              {pendingOrders.length} order{pendingOrders.length === 1 ? "" : "s"} awaiting payment.
            </strong>{" "}
            <Link href="/admin/orders" style={{ color: "var(--red)", fontWeight: 600 }}>
              Review orders →
            </Link>
          </div>
        )}

        <div className="admin-tables">
          <div className="card">
            <h3>Students</h3>
            {students.length === 0 ? (
              <div className="empty-state">
                No students yet — accounts created through the sign-up page will appear here.
              </div>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Focus</th>
                      <th>Email</th>
                      <th>Sessions left</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td>{s.name || "—"}</td>
                        <td>{s.focus || "—"}</td>
                        <td>{s.email}</td>
                        <td>{s.sessions_remaining}</td>
                        <td>
                          <Link
                            href={`/admin/students/${s.id}`}
                            style={{ color: "var(--red)", fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            Manage →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Consult requests</h3>
            {inquiries.length === 0 ? (
              <div className="empty-state">
                No consult requests yet — submissions from the home-page contact form show up here.
              </div>
            ) : (
              <div className="table-scroll">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
