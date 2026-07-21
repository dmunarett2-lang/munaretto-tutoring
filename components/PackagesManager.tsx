"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { parseDollarsToCents } from "@/lib/money";
import type { Package } from "@/lib/types";

function PackageRow({ pkg }: { pkg: Package }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const supabase = createClient();
    await supabase
      .from("packages")
      .update({
        name: String(fd.get("name")),
        sessions: parseInt(String(fd.get("sessions"))) || 1,
        price_cents: parseDollarsToCents(String(fd.get("price"))),
        description: String(fd.get("description")) || null,
        is_active: fd.get("is_active") === "on",
      })
      .eq("id", pkg.id);
    router.refresh();
    setBusy(false);
  }

  async function del() {
    if (!confirm(`Delete "${pkg.name}"?`)) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("packages").delete().eq("id", pkg.id);
    router.refresh();
    setBusy(false);
  }

  return (
    <form onSubmit={save} className="pkg-row">
      <div>
        <label className="field-label">Name</label>
        <input className="field" name="name" defaultValue={pkg.name} required />
      </div>
      <div>
        <label className="field-label">Sessions</label>
        <input className="field" name="sessions" type="number" min={1} defaultValue={pkg.sessions} required />
      </div>
      <div>
        <label className="field-label">Price ($)</label>
        <input
          className="field"
          name="price"
          placeholder="0 = contact"
          defaultValue={pkg.price_cents > 0 ? (pkg.price_cents / 100).toString() : ""}
        />
      </div>
      <div className="pkg-desc">
        <label className="field-label">Description</label>
        <input className="field" name="description" defaultValue={pkg.description ?? ""} />
      </div>
      <label className="pkg-active">
        <input type="checkbox" name="is_active" defaultChecked={pkg.is_active} /> Active
      </label>
      <div className="pkg-actions">
        <button type="submit" className="small-btn" disabled={busy}>
          Save
        </button>
        <button type="button" className="logout-btn" disabled={busy} onClick={del}>
          Delete
        </button>
      </div>
    </form>
  );
}

export default function PackagesManager({ packages }: { packages: Package[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const supabase = createClient();
    await supabase.from("packages").insert({
      name: String(fd.get("name")),
      sessions: parseInt(String(fd.get("sessions"))) || 1,
      price_cents: parseDollarsToCents(String(fd.get("price"))),
      description: String(fd.get("description")) || null,
      sort_order: packages.length + 1,
    });
    (e.target as HTMLFormElement).reset();
    router.refresh();
    setBusy(false);
  }

  return (
    <div>
      {packages.map((p) => (
        <PackageRow key={p.id} pkg={p} />
      ))}

      <form onSubmit={add} className="pkg-row pkg-row-new">
        <div>
          <label className="field-label">Name</label>
          <input className="field" name="name" placeholder="e.g. 20-Session Package" required />
        </div>
        <div>
          <label className="field-label">Sessions</label>
          <input className="field" name="sessions" type="number" min={1} placeholder="20" required />
        </div>
        <div>
          <label className="field-label">Price ($)</label>
          <input className="field" name="price" placeholder="0 = contact" />
        </div>
        <div className="pkg-desc">
          <label className="field-label">Description</label>
          <input className="field" name="description" placeholder="Optional" />
        </div>
        <div className="pkg-actions">
          <button type="submit" className="small-btn" disabled={busy}>
            Add package
          </button>
        </div>
      </form>
    </div>
  );
}
