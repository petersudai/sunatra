"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { ITrack } from "@/types";
import Image from "next/image";

// Generate a consistent waveform pattern from a seed string
function getWaveHeights(seed: string, count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    let h = 0;
    const s = seed + i;
    for (let j = 0; j < s.length; j++) {
      h = ((h << 5) - h) + s.charCodeAt(j);
      h |= 0;
    }
    return 15 + Math.abs(h % 70);
  });
}

export function AudioPlayer({ track }: { track: ITrack }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const waveHeights = getWaveHeights(track.id, 48);
  const progressFraction = duration > 0 ? progress / duration : 0;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setProgress(el.currentTime);
    const onLoad = () => setDuration(el.duration);
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoad);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoad);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
    setPlaying((v) => !v);
  };

  const seekByFraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = frac * duration;
  };

  return (
    <div className="group flex items-center gap-4 bg-[#0d0d0d] border border-[#111] px-4 py-3 hover:border-[#c9a84c]/20 transition-all duration-300">
      <audio ref={audioRef} src={track.audioUrl ?? undefined} preload="metadata" />

      {/* Cover */}
      <div className="relative w-14 h-14 shrink-0 bg-[#161616] overflow-hidden">
        {track.coverUrl ? (
          <Image src={track.coverUrl} alt={track.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-serif italic text-xl text-[#c9a84c]/60">S</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row: title + type tag */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <p className="font-sans font-semibold text-[#f0ebe0] text-sm truncate leading-tight">{track.title}</p>
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#444440] mt-0.5">{track.artist}</p>
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase text-[#c9a84c]/70 shrink-0 mt-0.5">
            Exclusive
          </span>
        </div>

        {/* Bottom row: play + waveform + duration */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="w-6 h-6 rounded-full border border-[#333] flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] text-[#666660] transition-all duration-200 shrink-0"
          >
            {playing ? <Pause size={9} /> : <Play size={9} className="ml-px" />}
          </button>

          {/* Waveform */}
          <div
            className="flex-1 flex items-end gap-px cursor-pointer h-8"
            onClick={seekByFraction}
            title="Click to seek"
          >
            {waveHeights.map((h, i) => {
              const filled = i / waveHeights.length < progressFraction;
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
