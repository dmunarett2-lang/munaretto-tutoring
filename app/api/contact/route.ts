import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RESEND_FROM = process.env.RESEND_FROM || "Munaretto Tutoring <onboarding@resend.dev>";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const supabase = await createClient();

  // 1) Save the inquiry (anon insert is allowed by RLS).
  const { error: insertError } = await supabase
    .from("inquiries")
    .insert({ name, email, message });
  if (insertError) {
    return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  }

  // 2) Email a notification (best-effort — never block the submission on this).
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    // Prefer the admin-configured notification address, fall back to env.
    let to = process.env.NOTIFY_EMAIL;
    try {
      const { data: settings } = await supabase
        .from("app_settings")
        .select("notify_email")
        .eq("id", 1)
        .single();
      if (settings?.notify_email) to = settings.notify_email;
    } catch {
      /* settings table may not exist yet — use env fallback */
    }

    if (to) {
      const esc = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: RESEND_FROM,
            to,
            reply_to: email,
            subject: `New consult request from ${name}`,
            html: `<h2>New consult request</h2>
              <p><strong>Name:</strong> ${esc(name)}</p>
              <p><strong>Email:</strong> ${esc(email)}</p>
              <p><strong>Message:</strong></p>
              <p>${esc(message).replace(/\n/g, "<br>")}</p>`,
          }),
        });
      } catch {
        /* email failed; the inquiry is still saved and visible in admin */
      }
    }
  }

  return NextResponse.json({ ok: true });
}
