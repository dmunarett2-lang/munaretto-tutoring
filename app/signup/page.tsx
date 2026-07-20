import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SignupForm from "@/components/SignupForm";

export const metadata = { title: "Sign up — Munaretto Tutoring" };

export default function SignupPage() {
  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div style={{ maxWidth: 460, margin: "0 auto" }}>
          <div className="app-eyebrow">Student sign-up</div>
          <h1 className="app-title" style={{ marginBottom: 10 }}>
            Create your account
          </h1>
          <p className="section-desc" style={{ marginBottom: 24 }}>
            Set up a student account to see your sessions, progress, and resources in one place.
          </p>
          <SignupForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
