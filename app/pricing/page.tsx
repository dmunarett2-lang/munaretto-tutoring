import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PurchaseButton from "@/components/PurchaseButton";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/money";
import type { Package } from "@/lib/types";

export const metadata = { title: "Pricing — Munaretto Tutoring" };

export default async function Pricing() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const packages = (data ?? []) as Package[];

  // Group by session-type category, preserving sort order.
  const groups: { category: string; items: Package[] }[] = [];
  for (const p of packages) {
    const cat = p.category || "Packages";
    let g = groups.find((x) => x.category === cat);
    if (!g) {
      g = { category: cat, items: [] };
      groups.push(g);
    }
    g.items.push(p);
  }

  return (
    <>
      <Nav />

      <header className="pricing-hero">
        <div className="wrap">
          <div className="eyebrow">Rates &amp; packages</div>
          <h1 className="headline" style={{ fontSize: "2.8rem" }}>
            Straightforward <em>pricing.</em>
          </h1>
          <p className="hero-sub">
            Every plan starts with a free consult so we can figure out what you actually need before
            anything is booked. Each session is one hour. Purchases are paid by Zelle and confirmed
            before your sessions are credited.
          </p>
        </div>
      </header>

      <section>
        <div className="wrap">
          {groups.length === 0 ? (
            <div className="pricing-note">
              <strong>Packages coming soon.</strong>{" "}
              <Link href="/#contact" style={{ color: "var(--red)", fontWeight: 600 }}>
                Book a free consult
              </Link>{" "}
              and we&apos;ll put together the right plan.
            </div>
          ) : (
            groups.map((group) => {
              const highlightIndex = group.items.length >= 3 ? 1 : -1;
              return (
                <div key={group.category} className="pricing-group">
                  <h2 className="section-title" style={{ fontSize: "1.6rem", marginBottom: 18 }}>
                    {group.category}
                  </h2>
                  <div className="pricing-grid">
                    {group.items.map((p, i) => {
                      const highlight = i === highlightIndex;
                      const perSession =
                        p.price_cents > 0 && p.sessions > 1
                          ? formatPrice(Math.round(p.price_cents / p.sessions))
                          : null;
                      return (
                        <div key={p.id} className={`pricing-card${highlight ? " highlight" : ""}`}>
                          <div className="pricing-tier">{p.name}</div>
                          <div className="pricing-rate">{formatPrice(p.price_cents)}</div>
                          <div className="pricing-desc">
                            {p.description ||
                              `${p.sessions} ${p.sessions === 1 ? "session" : "sessions"}.`}
                          </div>
                          <ul className="pricing-features">
                            <li className="pricing-feature">
                              {p.sessions}{" "}
                              {p.sessions === 1 ? "one-hour session" : "one-hour sessions"}
                            </li>
                            {perSession && (
                              <li className="pricing-feature">{perSession} per session</li>
                            )}
                            <li className="pricing-feature">Paid by Zelle</li>
                          </ul>
                          <PurchaseButton
                            packageId={p.id}
                            packageName={p.name}
                            category={p.category}
                            sessions={p.sessions}
                            amountCents={p.price_cents}
                            highlight={highlight}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}

          <div className="pricing-note">
            <strong>Need something custom?</strong>{" "}
            Book a free consult and we&apos;ll build a package sized to exactly what you need — any
            number of sessions.
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
