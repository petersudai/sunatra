export type GlyphState = "idle" | "playing" | "loading";

/** Play / pause / loading icon. All three are always in the markup and CSS
 *  (see .pg in globals.css) shows one, so the state can be switched by a plain
 *  attribute change, with or without React. Safe to render on the server. */
export function PlayGlyph({ state, size = 14 }: { state: GlyphState; size?: number }) {
  return (
    // data-state may be changed by the inline early-play script before hydration
    <span className="pg" data-state={state} aria-hidden="true" suppressHydrationWarning>
      <svg className="pg-play" viewBox="0 0 16 16" width={size} height={size} fill="currentColor" style={{ marginLeft: size * 0.06 }}>
        <path d="M3 2.5l10 5.5-10 5.5z" />
      </svg>
      <svg className="pg-pause" viewBox="0 0 16 16" width={size} height={size} fill="currentColor">
        <rect x="3" y="2" width="3.5" height="12" rx="1" />
        <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
      </svg>
      <svg className="pg-spin" viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" opacity="0.25" />
        <path d="M8 2a6 6 0 0 1 6 6" />
      </svg>
    </span>
  );
}
