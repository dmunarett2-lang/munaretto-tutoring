"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AppSettings } from "@/lib/types";

export default function SettingsForm({ settings }: { settings: AppSettings }) {
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
      .from("app_settings")
      .update({
        zelle_handle: String(fd.get("zelle")).trim() || null,
        calendly_url: String(fd.get("calendly")).trim() || null,
        notify_email: String(fd.get("notify")).trim() || null,
      })
      .eq("id", 1);
    router.refresh();
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={save} style={{ maxWidth: 520 }}>
      {saved && <div className="form-success show">Saved.</div>}
      <label className="field-label">Zelle handle (email or phone shown to buyers)</label>
      <input className="field" name="zelle" defaultValue={settings.zelle_handle ?? ""} placeholder="you@email.com" />
      <label className="field-label">Calendly booking link</label>
      <input className="field" name="calendly" defaultValue={settings.calendly_url ?? ""} placeholder="https://calendly.com/your-name/consult" />
      <label className="field-label">Notification email (where consult requests are sent)</label>
      <input className="field" name="notify" defaultValue={settings.notify_email ?? ""} placeholder="you@email.com" />
      <button type="submit" className="small-btn" disabled={busy}>
        {busy ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
