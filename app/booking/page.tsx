import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookingPicker from "@/components/BookingPicker";
import { createClient } from "@/lib/supabase/server";
import type { BookingType } from "@/lib/types";

export const metadata = { title: "Book a session — Munaretto Tutoring" };

export default async function Booking() {
  const supabase = await createClient();
  let types: BookingType[] = [];
  try {
    const { data } = await supabase
      .from("booking_types")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    types = (data ?? []) as BookingType[];
  } catch {
    /* booking_types not set up yet */
  }

  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div className="app-eyebrow">Scheduling</div>
        <h1 className="app-title" style={{ marginBottom: 10 }}>
          Book a session
        </h1>
        <p className="section-desc" style={{ marginBottom: 28, maxWidth: 560 }}>
          Choose what you&apos;d like help with, then pick a time. Free consults are welcome — no
          commitment.
        </p>

        {types.length > 0 ? (
          <BookingPicker types={types} />
        ) : (
          <div className="pricing-note">
            <strong>Online booking is being set up.</strong> In the meantime,{" "}
            <Link href="/#contact" style={{ color: "var(--red)", fontWeight: 600 }}>
              send a consult request
            </Link>{" "}
            and I&apos;ll reach out to schedule.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
