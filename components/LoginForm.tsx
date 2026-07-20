"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Real email/password login (Supabase). Redirects by role after sign-in. */
export default function LoginForm({ onDone }: { onDone?: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    setBusy(true);
    setError(null);
    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Email or password not recognized.");
      setBusy(false);
      return;
    }

    // Role decides where to land.
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    onDone?.();
    router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <div>
      {error && <div className="login-error show">{error}</div>}
      <label className="field-label">Email</label>
      <input
        className="field"
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />
      <label className="field-label">Password</label>
      <input
        className="field"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />
      <button className="submit-btn" onClick={handleLogin} disabled={busy}>
        {busy ? "Signing in…" : "Log in"}
      </button>
      <div className="login-hint">
        New student?{" "}
        <Link href="/signup" style={{ color: "var(--red)", fontWeight: 600 }}>
          Create an account
        </Link>
      </div>
    </div>
  );
}
