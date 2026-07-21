"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  packageId: string;
  packageName: string;
  sessions: number;
  amountCents: number;
  highlight?: boolean;
};

export default function PurchaseButton({
  packageId,
  packageName,
  sessions,
  amountCents,
  highlight,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // No price set yet -> route to consult instead of purchase.
  if (!amountCents || amountCents <= 0) {
    return (
      <Link href="/#contact" className="pricing-cta">
        Book a consult
      </Link>
    );
  }

  async function purchase() {
    setBusy(true);
    setError(null);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Need an account so the sessions can be credited somewhere.
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", user.id)
      .single();

    const { error: insertError } = await supabase.from("orders").insert({
      student_id: user.id,
      buyer_name: profile?.name || profile?.email || user.email,
      buyer_email: profile?.email || user.email,
      package_id: packageId,
      package_name: packageName,
      sessions,
      amount_cents: amountCents,
      payment_method: "zelle",
      status: "pending",
    });

    if (insertError) {
      setError("Could not start the order. Please try again.");
      setBusy(false);
      return;
    }

    router.push("/dashboard?ordered=1");
    router.refresh();
  }

  return (
    <>
      <button
        className="pricing-cta"
        onClick={purchase}
        disabled={busy}
        style={highlight ? { borderColor: "var(--paper)" } : undefined}
      >
        {busy ? "Starting…" : "Purchase"}
      </button>
      {error && (
        <div className="login-error show" style={{ margin: "8px 0 0" }}>
          {error}
        </div>
      )}
    </>
  );
}
