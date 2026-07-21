"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { BookingType } from "@/lib/types";

function Row({ bt }: { bt: BookingType }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const supabase = createClient();
    await supabase
      .from("booking_types")
      .update({
        label: String(fd.get("label")),
        description: String(fd.get("description")) || null,
        calendly_url: String(fd.get("url")),
        is_active: fd.get("is_active") === "on",
      })
      .eq("id", bt.id);
    router.refresh();
    setBusy(false);
  }

  async function del() {
    if (!confirm(`Delete "${bt.label}"?`)) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("booking_types").delete().eq("id", bt.id);
    router.refresh();
    setBusy(false);
  }

  return (
    <form onSubmit={save} className="pkg-row">
      <div>
        <label className="field-label">Label</label>
        <input className="field" name="label" defaultValue={bt.label} required />
      </div>
      <div className="pkg-desc">
        <label className="field-label">Description</label>
        <input className="field" name="description" defaultValue={bt.description ?? ""} />
      </div>
      <div className="pkg-desc">
        <label className="field-label">Calendly URL</label>
        <input className="field" name="url" defaultValue={bt.calendly_url} required />
      </div>
      <label className="pkg-active">
        <input type="checkbox" name="is_active" defaultChecked={bt.is_active} /> Active
      </label>
      <div className="pkg-actions">
        <button type="submit" className="small-btn" disabled={busy}>Save</button>
        <button type="button" className="logout-btn" disabled={busy} onClick={del}>Delete</button>
      </div>
    </form>
  );
}

export default function BookingTypesManager({ types }: { types: BookingType[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    const supabase = createClient();
    await supabase.from("booking_types").insert({
      label: String(fd.get("label")),
      description: String(fd.get("description")) || null,
      calendly_url: String(fd.get("url")),
      sort_order: types.length + 1,
    });
    form.reset();
    router.refresh();
    setBusy(false);
  }

  return (
    <div>
      {types.map((t) => (
        <Row key={t.id} bt={t} />
      ))}
      <form onSubmit={add} className="pkg-row pkg-row-new">
        <div>
          <label className="field-label">Label</label>
          <input className="field" name="label" placeholder="e.g. SAT Prep" required />
        </div>
        <div className="pkg-desc">
          <label className="field-label">Description</label>
          <input className="field" name="description" placeholder="Optional" />
        </div>
        <div className="pkg-desc">
          <label className="field-label">Calendly URL</label>
          <input className="field" name="url" placeholder="https://calendly.com/…" required />
        </div>
        <div className="pkg-actions">
          <button type="submit" className="small-btn" disabled={busy}>Add</button>
        </div>
      </form>
    </div>
  );
}
