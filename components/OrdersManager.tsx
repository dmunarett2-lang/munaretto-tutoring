"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/money";
import type { Order } from "@/lib/types";

export default function OrdersManager({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: "paid" | "cancelled") {
    setBusyId(id);
    const supabase = createClient();
    // Marking 'paid' fires a DB trigger that credits the student's sessions.
    await supabase.from("orders").update({ status }).eq("id", id);
    router.refresh();
    setBusyId(null);
  }

  if (orders.length === 0) {
    return <div className="empty-state">No orders yet.</div>;
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Buyer</th>
            <th>Package</th>
            <th>Sessions</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                {o.buyer_name}
                <div style={{ color: "var(--slate)", fontSize: "0.8rem" }}>{o.buyer_email}</div>
              </td>
              <td>{o.package_name}</td>
              <td>{o.sessions}</td>
              <td>{formatPrice(o.amount_cents)}</td>
              <td>
                <span
                  className="pill"
                  style={
                    o.status === "paid"
                      ? { background: "#E7F0E4", color: "#3C6B34" }
                      : o.status === "cancelled"
                        ? { background: "#EFE7E4", color: "#8A6D64" }
                        : { background: "#FBF3E4", color: "#7A5E1E" }
                  }
                >
                  {o.status}
                </span>
              </td>
              <td>
                {o.status === "pending" ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      className="small-btn"
                      disabled={busyId === o.id}
                      onClick={() => setStatus(o.id, "paid")}
                    >
                      Mark paid
                    </button>
                    <button
                      className="logout-btn"
                      disabled={busyId === o.id}
                      onClick={() => setStatus(o.id, "cancelled")}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span style={{ color: "var(--slate)", fontSize: "0.85rem" }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
