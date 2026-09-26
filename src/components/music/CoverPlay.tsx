"use client";

import { usePlayer } from "@/components/player/PlayerContext";
import { PlayGlyph, type GlyphState } from "./PlayGlyph";
import type { ITrack } from "@/types";

/** Large play/pause button laid over the cover art on the shareable track page.
 *  Sits above the fold on phones, where people land from an IG story.
 *  `data-early-play` lets the inline script (lib/earlyPlay) handle a tap that
 *  lands before this component has hydrated. */
export function CoverPlay({ track }: { track: ITrack }) {
  const player = usePlayer();
  const isActive = player.currentTrack?.id === track.id;
  const isPlaying = isActive && player.isPlaying;
  const state: GlyphState = isPlaying ? (player.isBuffering ? "loading" : "playing") : "idle";

  const toggle = () => (isActive ? player.togglePlay() : player.playTrack(track));

  return (
    <button
      onClick={toggle}
      data-early-play
      data-track-id={track.id}
      aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
      className="absolute inset-0 flex items-center justify-center group/play"
    >
      <span className="w-16 h-16 rounded-full flex items-center justify-center bg-black/45 backdrop-blur-sm border border-[#c9a84c]/60 text-[#c9a84c] group-hover/play:bg-black/60 group-hover/play:border-[#c9a84c] group-active/play:scale-95 transition-all duration-200">
        <PlayGlyph state={state} size={22} />
      </span>
    </button>
  );
}
