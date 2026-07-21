"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { composite, formatTestDate } from "@/lib/act";
import type { ActTest } from "@/lib/types";

const CORE = [
  { key: "english", label: "English" },
  { key: "math", label: "Math" },
  { key: "reading", label: "Reading" },
  { key: "science", label: "Science" },
  { key: "writing", label: "Writing" },
] as const;

export default function ActTestsManager({
  studentId,
  tests,
}: {
  studentId: string;
  tests: ActTest[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const test_date = String(fd.get("test_date"));
    if (!test_date) return;
    const num = (k: string) => {
      const v = String(fd.get(k));
      return v === "" ? null : parseInt(v);
    };
    setBusy(true);
    const supabase = createClient();
    await supabase.from("act_tests").insert({
      student_id: studentId,
      test_date,
      english: num("english"),
      math: num("math"),
      reading: num("reading"),
      science: num("science"),
      writing: num("writing"),
      composite: num("composite"),
    });
    form.reset();
    router.refresh();
    setBusy(false);
  }

  async function del(id: string) {
    if (!confirm("Delete this test?")) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("act_tests").delete().eq("id", id);
    router.refresh();
    setBusy(false);
  }

  return (
    <div>
      {tests.length > 0 && (
        <div className="table-scroll" style={{ marginBottom: 12 }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Eng</th>
                <th>Math</th>
                <th>Read</th>
                <th>Sci</th>
                <th>Writ</th>
                <th>Comp</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id}>
                  <td>{formatTestDate(t.test_date)}</td>
                  <td>{t.english ?? "—"}</td>
                  <td>{t.math ?? "—"}</td>
                  <td>{t.reading ?? "—"}</td>
                  <td>{t.science ?? "—"}</td>
                  <td>{t.writing ?? "—"}</td>
                  <td>
                    <strong>{composite(t) ?? "—"}</strong>
                  </td>
                  <td>
                    <button className="logout-btn" disabled={busy} onClick={() => del(t.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={add} className="sm-inline sm-add">
        <div>
          <label className="field-label">Test date</label>
          <input className="field" name="test_date" type="date" required />
        </div>
        {CORE.map((c) => (
          <div key={c.key}>
            <label className="field-label">{c.label}</label>
            <input className="field" name={c.key} type="number" min={1} max={36} placeholder="—" />
          </div>
        ))}
        <div>
          <label className="field-label">Composite</label>
          <input className="field" name="composite" type="number" min={1} max={36} placeholder="auto" />
        </div>
        <div className="pkg-actions">
          <button type="submit" className="small-btn" disabled={busy}>Add test</button>
        </div>
      </form>
    </div>
  );
}
