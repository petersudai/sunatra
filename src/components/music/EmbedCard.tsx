import type { ITrack } from "@/types";

const platformColors: Record<string, string> = {
  spotify: "#1DB954",
  soundcloud: "#FF5500",
  mixcloud: "#5000ff",
};

const platformLabels: Record<string, string> = {
  spotify: "Spotify",
  soundcloud: "SoundCloud",
  mixcloud: "Mixcloud",
};

export function EmbedCard({ track }: { track: ITrack }) {
  const color = platformColors[track.platform ?? ""] ?? "#c9a84c";
  const label = platformLabels[track.platform ?? ""] ?? "Stream";

  return (
    <div className="bg-[#0d0d0d] border border-[#111] overflow-hidden hover:border-[#c9a84c]/20 transition-all duration-300">
      {track.embedUrl && (
        <iframe
          src={track.embedUrl}
          width="100%"
          height={track.type === "mix" ? "120" : "80"}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="block"
        />
      )}
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-sans font-semibold text-[#f0ebe0] text-sm truncate">{track.title}</p>
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#444440] mt-0.5">{track.artist}</p>
        </div>
        <span
          className="text-[9px] tracking-[0.2em] uppercase shrink-0 px-2 py-1"
          style={{ color, background: color + "18" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
