"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Student self-signup (Supabase email/password). */
export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // Copied into the profile row by the handle_new_user trigger.
        data: { name: name.trim() },
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setBusy(false);
      return;
    }

    if (data.session) {
      // Email confirmation is off → signed in immediately.
      router.push("/dashboard");
      router.refresh();
      return;
    }

    // Email confirmation is on → verify before signing in.
    setNotice(
      "Check your email to confirm your account, then log in. If you don't see it, check spam.",
    );
    setBusy(false);
  }

  return (
    <form className="contact-form" onSubmit={handleSignup} style={{ maxWidth: 420 }}>
      {error && <div className="login-error show" style={{ margin: "0 0 12px" }}>{error}</div>}
      {notice && <div className="form-success show">{notice}</div>}
      <label>Your name</label>
      <input
        className="field"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label>Email</label>
      <input
        className="field"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label>Password</label>
      <input
        className="field"
        type="password"
        minLength={6}
        placeholder="at least 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        className="submit-btn"
        type="submit"
        disabled={busy}
        style={{ width: "auto", padding: "12px 26px" }}
      >
        {busy ? "Creating account…" : "Create account"}
      </button>
      <div className="login-hint" style={{ marginTop: 16 }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--red)", fontWeight: 600 }}>
          Log in
        </Link>
      </div>
    </form>
  );
}
