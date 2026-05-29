"use client";

import Image from "next/image";
import { usePlayer } from "@/components/player/PlayerContext";
import { formatDuration, getWaveHeights } from "@/lib/utils";
import type { ITrack } from "@/types";

export function AudioPlayer({ track }: { track: ITrack }) {
  const player = usePlayer();

  const isActive  = player.currentTrack?.id === track.id;
  const isPlaying = isActive && player.isPlaying;
  const progress  = isActive ? player.currentTime : 0;
  const duration  = isActive ? player.duration    : 0;
  const fraction  = duration > 0 ? progress / duration : 0;

  const waveHeights = getWaveHeights(track.id, 48);

  const toggle = () => {
    if (isActive) {
      player.togglePlay();
    } else {
      player.playTrack(track);
    }
  };

  const seekByFraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    player.seek(frac * duration);
  };

  return (
    <div className="group flex items-center gap-4 bg-[#0d0d0d] border border-[#111] px-4 py-3 hover:border-[#c9a84c]/20 transition-all duration-300">

      {/* Cover */}
      <div className="relative w-14 h-14 shrink-0 bg-[#161616] overflow-hidden">
        {track.coverUrl ? (
          <Image src={track.coverUrl} alt={track.title} fill sizes="56px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-serif italic text-xl text-[#c9a84c]/60">S</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row: title + tag */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <p className="font-sans font-semibold text-[#f0ebe0] text-sm truncate leading-tight">
              {track.title}
            </p>
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#444440] mt-0.5">
              {track.artist}
            </p>
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase text-[#c9a84c]/70 shrink-0 mt-0.5">
            Exclusive
          </span>
        </div>

        {/* Bottom row: play + waveform + duration */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-6 h-6 rounded-full border border-[#333] flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] text-[#666660] transition-all duration-200 shrink-0"
          >
            {isPlaying ? (
              <svg viewBox="0 0 10 10" width="9" height="9" fill="currentColor">
                <rect x="1.5" y="1" width="2.5" height="8" rx="0.8" />
                <rect x="6"   y="1" width="2.5" height="8" rx="0.8" />
              </svg>
            ) : (
              <svg viewBox="0 0 10 10" width="9" height="9" fill="currentColor" className="ml-px">
                <path d="M2 1.5l7 3.5-7 3.5z" />
              </svg>
            )}
          </button>

          {/* Waveform */}
          <div
            className="flex-1 flex items-end gap-px cursor-pointer h-8"
            onClick={seekByFraction}
            title={isActive ? "Click to seek" : "Click to play"}
          >
            {waveHeights.map((h, i) => {
              const filled = isActive && i / waveHeights.length < fraction;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-colors duration-150"
                  style={{
                    height: `${h}%`,
                    background: filled ? "#c9a84c" : "#222220",
                  }}
                />
              );
            })}
          </div>

          <span className="text-[10px] text-[#444440] tabular-nums shrink-0 w-8 text-right">
            {formatDuration(Math.floor(duration || 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
