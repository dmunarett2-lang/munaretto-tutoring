/* ============================================================
   PLACEHOLDER AUTH — NOT REAL AUTHENTICATION. DO NOT SHIP AS-IS.

   This is a client-side stand-in that reproduces the original
   demo login. It provides NO security:
     - credentials are hardcoded and visible in the bundle
     - "sessions" are just a value in sessionStorage
     - nothing is verified on a server

   This entire module is the seam where Supabase Auth will drop in
   during the next milestone:
     - checkCredentials()  -> supabase.auth.signInWithPassword()
     - getRole()/setRole() -> supabase session + a `role` claim / profiles table
     - route protection     -> Next.js middleware + server-side session checks
   ============================================================ */

import { demoStudents } from "./demo-data";

export type Role = "student" | "admin";

export type DemoUser = {
  role: Role;
  email: string;
  name?: string;
};

// Hardcoded demo credentials — placeholder only, replaced by Supabase Auth.
const DEMO_ADMIN = { email: "dominic@munarettotutoring.com", password: "admin123" };
const DEMO_STUDENT_PASSWORDS = ["student123", "password"];

const SESSION_KEY = "mt_demo_user";

/** Validate against the demo credentials. Returns a fake user or null. */
export function checkCredentials(
  tab: Role,
  emailRaw: string,
  password: string,
): DemoUser | null {
  const email = emailRaw.trim().toLowerCase();

  if (tab === "admin") {
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      return { role: "admin", email };
    }
    return null;
  }

  const match = demoStudents.find((s) => s.email.toLowerCase() === email);
  if (match && DEMO_STUDENT_PASSWORDS.includes(password)) {
    return { role: "student", email: match.email, name: match.name };
  }
  return null;
}

/** Persist the fake session (sessionStorage only). */
export function setSession(user: DemoUser): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable — ignore */
  }
}

/** Read the fake session, if any. */
export function getSession(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

/** Clear the fake session. */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export const DEMO_HINTS: Record<Role, string> = {
  student: "Demo student — demo@student.com / student123",
  admin: "Admin — dominic@munarettotutoring.com / admin123",
};
