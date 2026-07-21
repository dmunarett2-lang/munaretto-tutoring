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

  const [open, setOpen] = useState(false); // desktop login dropdown
  const [menuOpen, setMenuOpen] = useState(false); // mobile hamburger menu
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

  function closeMenus() {
    setMenuOpen(false);
    setOpen(false);
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    closeMenus();
    router.push("/");
    router.refresh();
  }

  return (
    <nav>
      <div className="wrap nav-inner">
        <Link href="/" className="logo" onClick={closeMenus}>
          Munaretto <span>Tutoring</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links${menuOpen ? " mobile-open" : ""}`}>
          <Link href="/#services" onClick={closeMenus}>
            Services
          </Link>
          <Link href="/pricing" onClick={closeMenus}>
            Pricing
          </Link>
          <Link href="/#about" onClick={closeMenus}>
            About
          </Link>

          {signedIn ? (
            <>
              <Link
                href={role === "admin" ? "/admin" : "/dashboard"}
                onClick={closeMenus}
              >
                {role === "admin" ? "Admin" : "My dashboard"}
              </Link>
              <Link href="/account" onClick={closeMenus}>
                Account
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
                <LoginForm onDone={closeMenus} />
              </div>
            </div>
          )}

          <Link href="/booking" className="nav-cta" onClick={closeMenus}>
            Book a session
          </Link>
        </div>
      </div>
    </nav>
  );
}
