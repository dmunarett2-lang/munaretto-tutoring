"use client";

import { useState } from "react";
import type { BookingType } from "@/lib/types";

export default function BookingPicker({ types }: { types: BookingType[] }) {
  const [selectedId, setSelectedId] = useState<string>(types[0]?.id ?? "");
  const selected = types.find((t) => t.id === selectedId) ?? types[0];

  const src = selected
    ? `${selected.calendly_url}${selected.calendly_url.includes("?") ? "&" : "?"}hide_gdpr_banner=1`
    : null;

  return (
    <div>
      <div className="booking-types">
        {types.map((t) => (
          <button
            key={t.id}
            className={`booking-type-card${t.id === selectedId ? " active" : ""}`}
            onClick={() => setSelectedId(t.id)}
          >
            <div className="booking-type-label">{t.label}</div>
            {t.description && <div className="booking-type-desc">{t.description}</div>}
          </button>
        ))}
      </div>

      {src && (
        <iframe
          key={src}
          className="calendly-embed"
          src={src}
          title={`Book: ${selected?.label}`}
          loading="lazy"
        />
      )}
    </div>
  );
}
