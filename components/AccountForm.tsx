"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  userId: string;
  initialName: string;
  initialPhone: string;
  email: string;
};

function Note({ kind, children }: { kind: "ok" | "err"; children: React.ReactNode }) {
  return kind === "ok" ? (
    <div className="form-success show">{children}</div>
  ) : (
    <div className="login-error show" style={{ margin: "0 0 12px" }}>{children}</div>
  );
}

export default function AccountForm({ userId, initialName, initialPhone, email }: Props) {
  const router = useRouter();

  // --- profile (name, phone) ---
  const [pBusy, setPBusy] = useState(false);
  const [pNote, setPNote] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPBusy(true);
    setPNote(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        name: String(fd.get("name")).trim() || null,
        phone: String(fd.get("phone")).trim() || null,
      })
      .eq("id", userId)
      .select();
    setPBusy(false);
    if (error || !data || data.length === 0) {
      setPNote({ kind: "err", msg: "Could not save. Please try again." });
      return;
    }
    router.refresh();
    setPNote({ kind: "ok", msg: "Saved." });
  }

  // --- email ---
  const [eBusy, setEBusy] = useState(false);
  const [eNote, setENote] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  async function saveEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newEmail = String(fd.get("email")).trim();
    setEBusy(true);
    setENote(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setEBusy(false);
    if (error) {
      setENote({ kind: "err", msg: error.message });
      return;
    }
    setENote({
      kind: "ok",
      msg: "Check your new email for a confirmation link. Your email changes once you confirm.",
    });
  }

  // --- password ---
  const [wBusy, setWBusy] = useState(false);
  const [wNote, setWNote] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  async function savePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const pw = String(fd.get("password"));
    if (pw.length < 6) {
      setWNote({ kind: "err", msg: "Password must be at least 6 characters." });
      return;
    }
    setWBusy(true);
    setWNote(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pw });
    setWBusy(false);
    if (error) {
      setWNote({ kind: "err", msg: error.message });
      return;
    }
    form.reset();
    setWNote({ kind: "ok", msg: "Password updated." });
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <div className="card" style={{ marginBottom: 26 }}>
        <h3>Personal information</h3>
        <form onSubmit={saveProfile}>
          {pNote && <Note kind={pNote.kind}>{pNote.msg}</Note>}
          <label className="field-label">Name</label>
          <input className="field" name="name" defaultValue={initialName} />
          <label className="field-label">Phone number</label>
          <input className="field" name="phone" type="tel" defaultValue={initialPhone} placeholder="(312) 555-0123" />
          <button type="submit" className="small-btn" disabled={pBusy}>
            {pBusy ? "Saving…" : "Save"}
          </button>
        </form>
      </div>

      <div className="card" style={{ marginBottom: 26 }}>
        <h3>Email</h3>
        <form onSubmit={saveEmail}>
          {eNote && <Note kind={eNote.kind}>{eNote.msg}</Note>}
          <label className="field-label">Email address</label>
          <input className="field" name="email" type="email" defaultValue={email} required />
          <button type="submit" className="small-btn" disabled={eBusy}>
            {eBusy ? "Sending…" : "Update email"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Password</h3>
        <form onSubmit={savePassword}>
          {wNote && <Note kind={wNote.kind}>{wNote.msg}</Note>}
          <label className="field-label">New password</label>
          <input className="field" name="password" type="password" minLength={6} placeholder="at least 6 characters" required />
          <button type="submit" className="small-btn" disabled={wBusy}>
            {wBusy ? "Updating…" : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}
