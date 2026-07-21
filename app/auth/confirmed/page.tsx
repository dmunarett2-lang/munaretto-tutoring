import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Email confirmed — Munaretto Tutoring" };

export default function Confirmed() {
  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center", paddingTop: 20 }}>
          <div
            className="circle-mark"
            style={{ position: "static", margin: "0 auto 24px", transform: "rotate(-8deg)" }}
          >
            ✓
          </div>
          <div className="app-eyebrow" style={{ justifyContent: "center" }}>
            You&apos;re all set
          </div>
          <h1 className="app-title" style={{ marginBottom: 14 }}>
            Email confirmed
          </h1>
          <p className="section-desc" style={{ marginBottom: 28 }}>
            Thank you — your email has been confirmed. You can now sign in to your account.
          </p>
          <Link href="/login" className="btn-primary" style={{ display: "inline-block" }}>
            Return to sign in
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
