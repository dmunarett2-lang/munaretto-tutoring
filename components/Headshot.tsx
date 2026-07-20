"use client";

import { useState } from "react";

/**
 * Shows the headshot at /headshot.jpg (place the file in /public).
 * Falls back to a labeled placeholder if the image isn't there yet.
 */
export default function Headshot() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="about-photo">
        Photo of Dominic
        <br />
        [add public/headshot.jpg]
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="about-photo about-photo-img"
      src="/headshot.jpg"
      alt="Dominic Munaretto"
      onError={() => setFailed(true)}
    />
  );
}
