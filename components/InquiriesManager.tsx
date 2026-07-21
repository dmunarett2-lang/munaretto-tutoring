"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Inquiry } from "@/lib/types";

export default function InquiriesManager({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inquiries;
    return inquiries.filter((i) =>
      `${i.name} ${i.email} ${i.message} ${i.status}`.toLowerCase().includes(q),
    );
  }, [inquiries, query]);

  async function del(id: string) {
    if (!confirm("Delete this consult request?")) return;
    setBusyId(id);
    const supabase = createClient();
    await supabase.from("inquiries").delete().eq("id", id);
    router.refresh();
    setBusyId(null);
  }

  if (inquiries.length === 0) {
    return (
      <div className="empty-state">
        No consult requests yet — submissions from the home-page contact form show up here.
      </div>
    );
  }

  return (
    <div>
      <input
        className="field"
        type="search"
        placeholder="Search by name, email, or message…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 14 }}
      />
      {filtered.length === 0 ? (
        <div className="empty-state">No requests match &ldquo;{query}&rdquo;.</div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((iq) => (
                <tr key={iq.id}>
                  <td>{iq.name}</td>
                  <td>{iq.email}</td>
                  <td style={{ maxWidth: "260px" }}>{iq.message}</td>
                  <td>
                    <span className="pill new">{iq.status}</span>
                  </td>
                  <td>
                    <button
                      className="logout-btn"
                      disabled={busyId === iq.id}
                      onClick={() => del(iq.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
