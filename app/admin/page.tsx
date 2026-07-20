"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { getSession, clearSession } from "@/lib/auth";
import { demoStudents, demoInquiries, type Student, type Inquiry } from "@/lib/demo-data";

export default function Admin() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [students, setStudents] = useState<Student[]>(demoStudents);
  const [inquiries] = useState<Inquiry[]>(demoInquiries);

  const [name, setName] = useState("");
  const [focus, setFocus] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // PLACEHOLDER gate — NOT security. Replaced by Supabase middleware + a
    // server-side admin-role check in the next milestone.
    const session = getSession();
    if (!session || session.role !== "admin") {
      router.replace("/");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) return null;

  function logout() {
    clearSession();
    router.replace("/");
  }

  function addStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // PLACEHOLDER: local state only. With Supabase this inserts into `students`.
    setStudents((prev) => [...prev, { name, focus, email, next: "Not scheduled" }]);
    setName("");
    setFocus("");
    setEmail("");
  }

  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div className="demo-banner">
          <strong>Placeholder admin.</strong> Demo login, demo data, changes are in-memory only —
          not real authentication or storage. Real admin auth (server-side role check) and
          persistent data arrive with Supabase.
        </div>

        <div className="app-header">
          <div>
            <div className="app-eyebrow">Admin</div>
            <div className="app-title">Dominic&apos;s dashboard</div>
          </div>
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>

        <div className="admin-tables">
          <div className="card">
            <h3>Students</h3>
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
                {students.map((s, i) => (
                  <tr key={i}>
                    <td>{s.name}</td>
                    <td>{s.focus}</td>
                    <td>{s.email}</td>
                    <td>{s.next || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form className="add-student-form" onSubmit={addStudent}>
              <div>
                <label className="field-label">Name</label>
                <input
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="field-label">Focus</label>
                <input
                  className="field"
                  placeholder="e.g. ACT Prep"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input
                  className="field"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="small-btn">
                Add student
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Consult requests</h3>
            {inquiries.length === 0 ? (
              <div className="empty-state">
                No consult requests yet — once Supabase is wired in, home-page contact form
                submissions will show up here.
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
                  {inquiries.map((iq, i) => (
                    <tr key={i}>
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
