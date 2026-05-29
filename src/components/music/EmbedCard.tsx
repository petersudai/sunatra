"use client";

import { useState } from "react";
import Image from "next/image";
import type { ITrack } from "@/types";

/* ─────────────────────────────────────────────────────────────
   URL normaliser — converts any share link to the correct
   embed URL so the web player loads (not the app deep-link).
   ───────────────────────────────────────────────────────────── */
function toEmbedUrl(url: string, platform: string): string {
  if (!url) return url;

  if (platform === "spotify") {
    // Already an embed URL — ensure dark theme param
    if (url.includes("/embed/")) {
      const sep = url.includes("?") ? "&" : "?";
      return url.includes("theme=") ? url : url + sep + "theme=0";
    }
    // Convert any share URL: track, album, playlist, episode, show
    const match = url.match(
      /spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/
    );
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
    }
    return url;
  }

  if (platform === "soundcloud") {
    if (url.includes("w.soundcloud.com")) return url; // already widget URL
    const clean = url.split("?")[0];
    const encoded = encodeURIComponent(clean);
    return (
      `https://w.soundcloud.com/player/?url=${encoded}` +
      `&color=%23c9a84c&auto_play=false&hide_related=true` +
      `&show_comments=false&show_user=true&show_reposts=false&visual=true`
    );
  }

  if (platform === "mixcloud") {
    if (url.includes("widget")) return url; // already widget URL
    const match = url.match(/mixcloud\.com(\/.+)/);
    const feed = match ? match[1] : url;
    return (
      `https://www.mixcloud.com/widget/iframe/` +
      `?hide_cover=1&autoplay=0&feed=${encodeURIComponent(feed)}`
    );
  }

  return url;
}

/* ─────────────────────────────────────────────────────────────
   Platform meta
   ───────────────────────────────────────────────────────────── */
const COLORS: Record<string, string> = {
  spotify: "#1DB954",
  soundcloud: "#FF5500",
  mixcloud: "#5000ff",
};

const LABELS: Record<string, string> = {
  spotify: "Spotify",
  soundcloud: "SoundCloud",
  mixcloud: "Mixcloud",
};

/* iframe heights that show artwork in each platform's own player */
const HEIGHTS: Record<string, number> = {
  spotify: 152,    // Spotify compact — shows artwork
  soundcloud: 166, // SoundCloud visual mode — artwork fills top
  mixcloud: 120,   // Mixcloud compact mix player
};

/* ─────────────────────────────────────────────────────────────
   EmbedCard — custom wrapper, platform iframe expands on click
   ───────────────────────────────────────────────────────────── */
export function EmbedCard({ track }: { track: ITrack }) {
  const [open, setOpen] = useState(false);

  const platform = track.platform ?? "spotify";
  const color    = COLORS[platform]  ?? "#c9a84c";
  const label    = LABELS[platform]  ?? "Stream";
  const height   = track.type === "mix" ? 120 : (HEIGHTS[platform] ?? 152);
  const embedUrl = track.embedUrl ? toEmbedUrl(track.embedUrl, platform) : "";

  return (
    <div className="bg-[#0d0d0d] border border-[#111] overflow-hidden hover:border-[#c9a84c]/20 transition-all duration-300">

      {/* ── Card header — always visible, consistent across all platforms ── */}
      <div className="flex items-stretch">

        {/* Artwork square */}
        <div className="relative w-[72px] h-[72px] shrink-0 bg-[#111]">
          {track.coverUrl ? (
            <Image
              src={track.coverUrl}
              alt={track.title}
              fill
              sizes="72px"
              className="object-cover"
            />
          ) : (
            /* Branded placeholder when no cover uploaded */
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: color + "10" }}
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ opacity: 0.35 }}
              >
                <circle cx="9" cy="18" r="3" />
                <circle cx="18" cy="15" r="3" />
                <path d="M12 18V7l9-3v3" />
              </svg>
            </div>
          )}
        </div>

        {/* Title / artist / controls */}
        <div className="flex-1 px-4 py-3 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0">
            <p className="font-sans font-medium text-[#f0ebe0] text-sm truncate leading-tight">
              {track.title}
            </p>
            <p className="text-[9px] tracking-[0.28em] uppercase text-[#444440] mt-1">
              {track.artist}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Platform badge */}
            <span
              className="text-[8px] tracking-[0.2em] uppercase px-2 py-1"
              style={{ color, background: color + "18" }}
            >
              {label}
            </span>

            {/* Play / collapse toggle */}
            {embedUrl && (
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Collapse player" : "Play track"}
                className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 shrink-0"
                style={{
                  borderColor: open ? color : color + "45",
                  background: open ? color + "22" : "transparent",
                  color: open ? color : color + "88",
                }}
              >
                {open ? (
                  /* Pause/collapse icon */
                  <svg viewBox="0 0 10 10" width="10" height="10" fill="currentColor">
                    <rect x="1.5" y="1" width="2.5" height="8" rx="1" />
                    <rect x="6"   y="1" width="2.5" height="8" rx="1" />
                  </svg>
                ) : (
                  /* Play triangle */
                  <svg viewBox="0 0 10 10" width="10" height="10" fill="currentColor">
                    <path d="M2 1.5l7 3.5-7 3.5z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Expandable platform iframe — mounts only when open ── */}
      {open && embedUrl && (
        <div className="border-t border-[#0f0f0f]">
          <iframe
            src={embedUrl}
            width="100%"
            height={height}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="block"
            title={track.title}
          />
        </div>
      )}
    </div>
  );
}
