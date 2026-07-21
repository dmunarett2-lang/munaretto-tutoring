import Nav from "@/components/Nav";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import PackagesManager from "@/components/PackagesManager";
import SettingsForm from "@/components/SettingsForm";
import CustomOrderForm from "@/components/CustomOrderForm";
import { requireAdmin } from "@/lib/supabase/guards";
import type { Package, AppSettings } from "@/lib/types";

export const metadata = { title: "Packages & settings — Admin" };

export default async function AdminPackages() {
  const { supabase } = await requireAdmin();

  const [{ data: pkgData }, { data: settingsData }, { data: studentsData }] = await Promise.all([
    supabase.from("packages").select("*").order("sort_order", { ascending: true }),
    supabase.from("app_settings").select("*").eq("id", 1).single(),
    supabase.from("profiles").select("id, name, email").eq("role", "student").order("created_at"),
  ]);

  const packages = (pkgData ?? []) as Package[];
  const settings = (settingsData ?? { id: 1, zelle_handle: null, calendly_url: null, notify_email: null }) as AppSettings;
  const students = (studentsData ?? []) as { id: string; name: string | null; email: string }[];

  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div className="app-header">
          <div>
            <div className="app-eyebrow">Admin</div>
            <div className="app-title">Packages &amp; settings</div>
          </div>
          <LogoutButton />
        </div>
        <AdminNav />

        <div className="card" style={{ marginBottom: 26 }}>
          <h3>Packages</h3>
          <p style={{ color: "var(--slate)", fontSize: "0.88rem", marginBottom: 16 }}>
            Edit prices any time (a price of 0 shows as &ldquo;Contact for rate&rdquo;). Uncheck
            &ldquo;Active&rdquo; to hide a package from the pricing page.
          </p>
          <PackagesManager packages={packages} />
        </div>

        <div className="card" style={{ marginBottom: 26 }}>
          <h3>Custom package for a student</h3>
          <p style={{ color: "var(--slate)", fontSize: "0.88rem", marginBottom: 16 }}>
            Bundle any number of sessions for any price for a specific student. Leave unpaid to
            collect by Zelle, or mark paid now to credit the sessions immediately.
          </p>
          <CustomOrderForm students={students} />
        </div>

        <div className="card">
          <h3>Settings</h3>
          <p style={{ color: "var(--slate)", fontSize: "0.88rem", marginBottom: 16 }}>
            Your Zelle handle appears on buyers&apos; payment instructions. The Calendly link powers
            the booking page. Consult requests are emailed to the notification address.
          </p>
          <SettingsForm settings={settings} />
        </div>
      </div>
    </>
  );
}
