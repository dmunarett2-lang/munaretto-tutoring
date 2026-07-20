"use client";

import { useState } from "react";

export default function ContactForm() {
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // PLACEHOLDER: no backend yet. Once Supabase lands, this will insert
    // into an `inquiries` table so it shows up in the admin dashboard.
    setSuccess(true);
    e.currentTarget.reset();
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className={`form-success${success ? " show" : ""}`}>
        Thanks — your message has been sent. I&apos;ll be in touch soon.
      </div>
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
      <button className="submit-btn" type="submit" style={{ width: "auto", padding: "12px 26px" }}>
        Send message
      </button>
    </form>
  );
}
