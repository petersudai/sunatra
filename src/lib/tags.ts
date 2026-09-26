/** Genre presets shown as quick-pick chips in the admin. Custom tags are still allowed. */
export const PRESET_TAGS = [
  "RnB",
  "House",
  "Hip-Hop/Rap",
  "Afrobeats",
  "Amapiano",
  "Soul",
  "Electronic",
  "Lo-Fi",
];

/** Trim, drop empties, dedupe case-insensitively, keep the first spelling used. */
export function cleanTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    const t = raw.trim();
    if (!t || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    out.push(t);
  }
  return out;
}

/** Public, shareable page for a single track. Works client-side and server-side. */
export function trackPath(id: string) {
  return `/track/${id}`;
}

export function trackUrl(id: string) {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXTAUTH_URL ?? "";
  return `${origin}${trackPath(id)}`;
}
