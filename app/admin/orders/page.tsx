import Nav from "@/components/Nav";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import OrdersManager from "@/components/OrdersManager";
import { requireAdmin } from "@/lib/supabase/guards";
import type { Order } from "@/lib/types";

export const metadata = { title: "Orders — Admin" };

export default async function AdminOrders() {
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as Order[];

  return (
    <>
      <Nav />
      <div className="wrap app-shell">
        <div className="app-header">
          <div>
            <div className="app-eyebrow">Admin</div>
            <div className="app-title">Orders</div>
          </div>
          <LogoutButton />
        </div>
        <AdminNav />
        <div className="card">
          <h3>All orders</h3>
          <p style={{ color: "var(--slate)", fontSize: "0.88rem", marginBottom: 16 }}>
            When a buyer has paid you by Zelle, click <strong>Mark paid</strong> — their sessions
            are credited automatically.
          </p>
          <OrdersManager orders={orders} />
        </div>
      </div>
    </>
  );
}
