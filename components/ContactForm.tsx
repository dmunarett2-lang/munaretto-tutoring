"use client";

import { useState } from "react";

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Server route saves the inquiry AND emails a notification.
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        message: String(fd.get("message") ?? ""),
      }),
    });

    if (!res.ok) {
      setError("Something went wrong sending your message. Please try again.");
      setBusy(false);
      return;
    }

    setSuccess(true);
    form.reset();
    setBusy(false);
    setTimeout(() => setSuccess(false), 5000);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className={`form-success${success ? " show" : ""}`}>
        Thanks — your message has been sent. I&apos;ll be in touch soon.
      </div>
      {error && <div className="login-error show" style={{ margin: "0 0 12px" }}>{error}</div>}
      <label>Parent or student name</label>
      <input className="field" name="name" required />
      <label>Email</label>
      <input className="field" name="email" type="email" required />
      <label>What are you looking for help with?</label>
      <textarea
        name="message"
        required
        placeholder="e.g. ACT prep for a rising junior, or help with the Common App essay..."
      />
      <button
        className="submit-btn"
        type="submit"
        disabled={busy}
        style={{ width: "auto", padding: "12px 26px" }}
      >
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
