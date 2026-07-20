"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoginForm from "@/components/LoginForm";
import type { Role } from "@/lib/types";

export default function Nav() {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  // Track auth state so the nav reflects whether someone is signed in.
  useEffect(() => {
    const supabase = createClient();

    async function loadRole(userId: string) {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      setRole((data?.role as Role) ?? "student");
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setSignedIn(!!user);
      if (user) loadRole(user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user);
      if (session?.user) loadRole(session.user.id);
      else setRole(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close the login dropdown on outside click.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav>
      <div className="wrap nav-inner">
        <Link href="/" className="logo">
          Munaretto <span>Tutoring</span>
        </Link>
        <div className="nav-links">
          <Link href="/#services">Services</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/#about">About</Link>
          <Link href="/#results">Results</Link>

          {signedIn ? (
            <>
              <Link href={role === "admin" ? "/admin" : "/dashboard"}>
                {role === "admin" ? "Admin" : "My dashboard"}
              </Link>
              <button className="login-btn" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <div className="login-wrap" ref={wrapRef}>
              <button
                className={`login-btn${open ? " open" : ""}`}
                onClick={() => setOpen((v) => !v)}
              >
                Log in <span className="caret">▾</span>
              </button>
              <div className={`login-menu${open ? " show" : ""}`}>
                <LoginForm onDone={() => setOpen(false)} />
              </div>
            </div>
          )}

          <Link href="/#contact" className="nav-cta">
            Book a consult
          </Link>
        </div>
      </div>
    </nav>
  );
}
