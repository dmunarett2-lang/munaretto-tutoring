"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile, StudentProgress, StudentSession, StudentResource } from "@/lib/types";

/* ---------- profile (focus + session balance) ---------- */
function ProfileEditor({ student }: { student: Profile }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setSaved(false);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({
        focus: String(fd.get("focus")).trim() || null,
        sessions_remaining: parseInt(String(fd.get("sessions"))) || 0,
      })
      .eq("id", student.id);
    router.refresh();
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={save} className="sm-inline">
      {saved && <div className="form-success show" style={{ width: "100%" }}>Saved.</div>}
      <div>
        <label className="field-label">Focus</label>
        <input className="field" name="focus" defaultValue={student.focus ?? ""} placeholder="e.g. ACT Prep" />
      </div>
      <div>
        <label className="field-label">Sessions remaining</label>
        <input className="field" name="sessions" type="number" min={0} defaultValue={student.sessions_remaining} />
      </div>
      <div className="pkg-actions">
        <button type="submit" className="small-btn" disabled={busy}>Save</button>
      </div>
    </form>
  );
}

/* ---------- generic list row + adder ---------- */
type Field = { name: string; label: string; type?: string; placeholder?: string };

function ListRow({
  table,
  id,
  fields,
  values,
}: {
  table: string;
  id: string;
  fields: Field[];
  values: Record<string, string | number>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const patch: Record<string, unknown> = {};
    for (const f of fields) {
      const v = String(fd.get(f.name));
      patch[f.name] = f.type === "number" ? (v === "" ? null : parseInt(v)) : v || null;
    }
    setBusy(true);
    const supabase = createClient();
    await supabase.from(table).update(patch).eq("id", id);
    router.refresh();
    setBusy(false);
  }

  async function del() {
    setBusy(true);
    const supabase = createClient();
    await supabase.from(table).delete().eq("id", id);
    router.refresh();
    setBusy(false);
  }

  return (
    <form onSubmit={save} className="sm-inline">
      {fields.map((f) => (
        <div key={f.name}>
          <label className="field-label">{f.label}</label>
          <input
            className="field"
            name={f.name}
            type={f.type ?? "text"}
            defaultValue={values[f.name] ?? ""}
            placeholder={f.placeholder}
          />
        </div>
      ))}
      <div className="pkg-actions">
        <button type="submit" className="small-btn" disabled={busy}>Save</button>
        <button type="button" className="logout-btn" disabled={busy} onClick={del}>Delete</button>
      </div>
    </form>
  );
}

function ListAdder({
  table,
  studentId,
  fields,
}: {
  table: string;
  studentId: string;
  fields: Field[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const row: Record<string, unknown> = { student_id: studentId };
    for (const f of fields) {
      const v = String(fd.get(f.name));
      row[f.name] = f.type === "number" ? (v === "" ? null : parseInt(v)) : v || null;
    }
    setBusy(true);
    const supabase = createClient();
    await supabase.from(table).insert(row);
    form.reset();
    router.refresh();
    setBusy(false);
  }

  return (
    <form onSubmit={add} className="sm-inline sm-add">
      {fields.map((f) => (
        <div key={f.name}>
          <label className="field-label">{f.label}</label>
          <input className="field" name={f.name} type={f.type ?? "text"} placeholder={f.placeholder} />
        </div>
      ))}
      <div className="pkg-actions">
        <button type="submit" className="small-btn" disabled={busy}>Add</button>
      </div>
    </form>
  );
}

/* ---------- main ---------- */
export default function StudentManager({
  student,
  progress,
  sessions,
  resources,
}: {
  student: Profile;
  progress: StudentProgress[];
  sessions: StudentSession[];
  resources: StudentResource[];
}) {
  const progressFields: Field[] = [
    { name: "label", label: "Label", placeholder: "ACT Composite" },
    { name: "current_score", label: "Current score", type: "number", placeholder: "27" },
    { name: "goal_score", label: "Goal score", type: "number", placeholder: "36" },
  ];
  const sessionFields: Field[] = [
    { name: "title", label: "Title", placeholder: "ACT Reading review" },
    { name: "subtitle", label: "Subtitle", placeholder: "with Dominic" },
    { name: "when_text", label: "When", placeholder: "Thu, 4:30 PM" },
  ];
  const resourceFields: Field[] = [
    { name: "label", label: "Label", placeholder: "ACT Science worksheet" },
    { name: "url", label: "Link (optional)", placeholder: "https://…" },
  ];

  return (
    <>
      <div className="card" style={{ marginBottom: 26 }}>
        <h3>Profile &amp; session balance</h3>
        <ProfileEditor student={student} />
      </div>

      <div className="card" style={{ marginBottom: 26 }}>
        <h3>Upcoming sessions</h3>
        {sessions.map((s) => (
          <ListRow
            key={s.id}
            table="student_sessions"
            id={s.id}
            fields={sessionFields}
            values={{ title: s.title, subtitle: s.subtitle ?? "", when_text: s.when_text ?? "" }}
          />
        ))}
        <ListAdder table="student_sessions" studentId={student.id} fields={sessionFields} />
      </div>

      <div className="card" style={{ marginBottom: 26 }}>
        <h3>Progress</h3>
        {progress.map((p) => (
          <ListRow
            key={p.id}
            table="student_progress"
            id={p.id}
            fields={progressFields}
            values={{
              label: p.label,
              current_score: p.current_score ?? "",
              goal_score: p.goal_score ?? "",
            }}
          />
        ))}
        <ListAdder table="student_progress" studentId={student.id} fields={progressFields} />
      </div>

      <div className="card">
        <h3>Resources</h3>
        {resources.map((r) => (
          <ListRow
            key={r.id}
            table="student_resources"
            id={r.id}
            fields={resourceFields}
            values={{ label: r.label, url: r.url ?? "" }}
          />
        ))}
        <ListAdder table="student_resources" studentId={student.id} fields={resourceFields} />
      </div>
    </>
  );
}
