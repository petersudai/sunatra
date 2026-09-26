"use client";

import { usePlayer } from "@/components/player/PlayerContext";
import type { ITrack } from "@/types";

/** Large play/pause button laid over the cover art on the shareable track page.
 *  Sits above the fold on phones, where people land from an IG story. */
export function CoverPlay({ track }: { track: ITrack }) {
  const player = usePlayer();
  const isActive = player.currentTrack?.id === track.id;
  const isPlaying = isActive && player.isPlaying;

  const toggle = () => (isActive ? player.togglePlay() : player.playTrack(track));

  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
      className="absolute inset-0 flex items-center justify-center group/play"
    >
      <span className="w-16 h-16 rounded-full flex items-center justify-center bg-black/45 backdrop-blur-sm border border-[#c9a84c]/60 text-[#c9a84c] group-hover/play:bg-black/60 group-hover/play:border-[#c9a84c] group-active/play:scale-95 transition-all duration-200">
        {isPlaying ? (
          <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor">
            <rect x="3" y="2" width="3.5" height="12" rx="1" />
            <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor" className="ml-0.5">
            <path d="M3 2.5l10 5.5-10 5.5z" />
          </svg>
        )}
      </span>
    </button>
  );
}
