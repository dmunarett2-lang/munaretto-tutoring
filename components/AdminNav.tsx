"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/packages", label: "Packages & settings" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="admin-subnav">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link key={l.href} href={l.href} className={`admin-subnav-link${active ? " active" : ""}`}>
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
