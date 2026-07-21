import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Book a session — Munaretto Tutoring" };

export default async function Booking() {
  const supabase = await createClient();
  let calendlyUrl: string | null = null;
  try {
    const { data } = await supabase
      .from("app_settings")
      .select("calendly_url")
      .eq("id", 1)
      .single();
    calendlyUrl = data?.calendly_url ?? null;
  } catch {
    /* settings not set up yet */
  }

  // Calendly embeds cleanly in an iframe; add params to hide extra chrome.
  const src = calendlyUrl
    ? `${calendlyUrl}${calendlyUrl.includes("?") ? "&" : "?"}hide_gdpr_banner=1`
    : null;

  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div className="app-eyebrow">Scheduling</div>
        <h1 className="app-title" style={{ marginBottom: 10 }}>
          Book a session
        </h1>
        <p className="section-desc" style={{ marginBottom: 28, maxWidth: 560 }}>
          Pick a time that works for you. Each session is one hour. Free consults are welcome — no
          commitment.
        </p>

        {src ? (
          <iframe
            className="calendly-embed"
            src={src}
            title="Book a session with Dominic"
            loading="lazy"
          />
        ) : (
          <div className="pricing-note">
            <strong>Online booking is being set up.</strong> In the meantime,{" "}
            <Link href="/#contact" style={{ color: "var(--red)", fontWeight: 600 }}>
              send a consult request
            </Link>{" "}
            and I&apos;ll reach out to schedule.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
