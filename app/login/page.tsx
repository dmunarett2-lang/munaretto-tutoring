import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Log in — Munaretto Tutoring" };

export default function LoginPage() {
  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div style={{ maxWidth: 380, margin: "0 auto" }}>
          <div className="app-eyebrow">Welcome back</div>
          <h1 className="app-title" style={{ marginBottom: 24 }}>
            Log in
          </h1>
          <LoginForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
