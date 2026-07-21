/** Format a price in cents. 0 = "Contact for rate" (price not set yet). */
export function formatPrice(cents: number): string {
  if (!cents || cents <= 0) return "Contact for rate";
  const dollars = cents / 100;
  return dollars % 1 === 0 ? `$${dollars.toFixed(0)}` : `$${dollars.toFixed(2)}`;
}

/** Parse a dollar string (e.g. "250" or "$249.99") into integer cents. */
export function parseDollarsToCents(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  return Math.round(parseFloat(cleaned) * 100);
}
