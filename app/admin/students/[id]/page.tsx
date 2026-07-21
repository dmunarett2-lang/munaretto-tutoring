import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import StudentManager from "@/components/StudentManager";
import { requireAdmin } from "@/lib/supabase/guards";
import type { Profile, StudentProgress, StudentSession, StudentResource } from "@/lib/types";

export const metadata = { title: "Manage student — Admin" };

export default async function ManageStudent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: studentData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (!studentData) notFound();
  const student = studentData as Profile;

  const [{ data: progressData }, { data: sessionsData }, { data: resourcesData }] =
    await Promise.all([
      supabase.from("student_progress").select("*").eq("student_id", id).order("sort_order"),
      supabase.from("student_sessions").select("*").eq("student_id", id).order("sort_order"),
      supabase.from("student_resources").select("*").eq("student_id", id).order("sort_order"),
    ]);

  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div className="app-header">
          <div>
            <div className="app-eyebrow">
              <Link href="/admin" style={{ color: "var(--red)" }}>
                ← Admin
              </Link>
            </div>
            <div className="app-title">{student.name || student.email}</div>
          </div>
          <LogoutButton />
        </div>
        <AdminNav />

        <p style={{ color: "var(--slate)", fontSize: "0.88rem", marginBottom: 22 }}>
          Everything you set here shows on {student.name?.split(" ")[0] || "this student"}&apos;s
          dashboard.
        </p>

        <StudentManager
          student={student}
          progress={(progressData ?? []) as StudentProgress[]}
          sessions={(sessionsData ?? []) as StudentSession[]}
          resources={(resourcesData ?? []) as StudentResource[]}
        />
      </div>
    </>
  );
}
