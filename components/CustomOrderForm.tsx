"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { parseDollarsToCents } from "@/lib/money";

type StudentOption = { id: string; name: string | null; email: string };

export default function CustomOrderForm({ students }: { students: StudentOption[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const studentId = String(fd.get("student"));
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    setBusy(true);
    setMsg(null);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        student_id: studentId,
        buyer_name: student.name || student.email,
        buyer_email: student.email,
        package_id: null,
        package_name: String(fd.get("label")) || "Custom package",
        sessions: parseInt(String(fd.get("sessions"))) || 1,
        amount_cents: parseDollarsToCents(String(fd.get("price"))),
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !data) {
      setMsg("Could not create the order.");
      setBusy(false);
      return;
    }

    // Optionally mark paid immediately (fires the trigger that credits sessions).
    if (fd.get("markpaid") === "on") {
      await supabase.from("orders").update({ status: "paid" }).eq("id", data.id);
    }

    form.reset();
    router.refresh();
    setBusy(false);
    setMsg("Custom order created.");
    setTimeout(() => setMsg(null), 3000);
  }

  if (students.length === 0) {
    return (
      <div className="empty-state">
        No students yet — once someone signs up you can build a custom package for them.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="custom-order-form">
      {msg && <div className="form-success show">{msg}</div>}
      <div>
        <label className="field-label">Student</label>
        <select className="field" name="student" required defaultValue="">
          <option value="" disabled>
            Select a student…
          </option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name ? `${s.name} (${s.email})` : s.email}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label">Label</label>
        <input className="field" name="label" placeholder="Custom package" />
      </div>
      <div>
        <label className="field-label">Sessions</label>
        <input className="field" name="sessions" type="number" min={1} placeholder="3" required />
      </div>
      <div>
        <label className="field-label">Price ($)</label>
        <input className="field" name="price" placeholder="150" required />
      </div>
      <label className="pkg-active">
        <input type="checkbox" name="markpaid" /> Mark paid now (credit sessions immediately)
      </label>
      <div className="pkg-actions">
        <button type="submit" className="small-btn" disabled={busy}>
          {busy ? "Creating…" : "Create custom order"}
        </button>
      </div>
    </form>
  );
}
