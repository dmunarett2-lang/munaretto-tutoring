import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AccountForm from "@/components/AccountForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Account settings — Munaretto Tutoring" };

export default async function Account() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, phone")
    .eq("id", user.id)
    .single();

  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div className="app-eyebrow">Your account</div>
        <h1 className="app-title" style={{ marginBottom: 24 }}>
          Account settings
        </h1>
        <AccountForm
          userId={user.id}
          initialName={profile?.name ?? ""}
          initialPhone={profile?.phone ?? ""}
          email={user.email ?? ""}
        />
      </div>
      <Footer />
    </>
  );
}
