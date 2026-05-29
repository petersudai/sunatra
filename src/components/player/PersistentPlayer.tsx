"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { usePlayer } from "./PlayerContext";
import { formatDuration, getWaveHeights } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Marquee title — scrolls only when text actually overflows
   ───────────────────────────────────────────────────────────── */
function MarqueeTitle({ title }: { title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLSpanElement>(null);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const c = containerRef.current;
    const tx = textRef.current;
    if (!c || !tx) return;

    const check = () => {
      const overflow = tx.scrollWidth - c.clientWidth;
      if (overflow > 4) {
        tx.style.setProperty("--marquee-dist", `-${overflow + 16}px`);
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(c);
    return () => ro.disconnect();
  }, [title]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <span
        ref={textRef}
        className={[
          "text-[#f0ebe0] text-sm font-medium leading-tight",
          scrolling ? "player-title-scroll" : "truncate block",
        ].join(" ")}
      >
        {title}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Waveform progress — replaces flat bar on desktop
   ───────────────────────────────────────────────────────────── */
function WaveProgress({
  trackId,
  fraction,
  duration,
  onSeek,
}: {
  trackId: string;
  fraction: number;
  duration: number;
  onSeek: (t: number) => void;
}) {
  const bars = getWaveHeights(trackId, 52);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(frac * duration);
  };

  return (
    <div
      className="flex items-end gap-px cursor-pointer h-8 flex-1"
      onClick={handleClick}
      title="Click to seek"
    >
      {bars.map((h, i) => {
        const filled = i / bars.length <= fraction;
        return (
          <div
            key={i}
            className="flex-1 rounded-sm transition-colors duration-100"
            style={{
              height: `${h}%`,
              background: filled ? "#c9a84c" : "#1e1e1c",
            }}
          />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Icon atoms
   ───────────────────────────────────────────────────────────── */
const PlayIcon     = () => <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor"><path d="M3 2.5l10 5.5-10 5.5z"/></svg>;
const PauseIcon    = () => <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>;
const PrevIcon     = () => <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M2 2h2v12H2zM13.5 2L5 8l8.5 6z"/></svg>;
const NextIcon     = () => <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M12 2h2v12h-2zM2.5 2L11 8 2.5 14z"/></svg>;
const ShuffleIcon  = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : 0.4}>
    <path d="M2 6h3.5a6 6 0 0 1 4.5 2l1 1.5" />
    <path d="M2 14h3.5a6 6 0 0 0 4.5-2l4-5A6 6 0 0 1 18 5h0M15 3l3 2-3 2" />
    <path d="M18 15h0a6 6 0 0 1-4-2l-1-1.5M15 13l3 2-3 2" />
  </svg>
);
const QueueIcon    = () => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 5h14M3 10h14M3 15h9" />
  </svg>
);
const VolumeIcon = ({ muted }: { muted: boolean }) => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={muted ? 0.3 : 0.6}>
    {muted ? (
      <><path d="M9 5L5 8H2v4h3l4 3V5z"/><path d="M15 8l-4 4M11 8l4 4" strokeWidth="1.5"/></>
    ) : (
      <><path d="M9 5L5 8H2v4h3l4 3V5z"/><path d="M13 7a4 4 0 0 1 0 6"/><path d="M15.5 5a7 7 0 0 1 0 10"/></>
    )}
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   Queue Drawer
   ───────────────────────────────────────────────────────────── */
function QueueDrawer() {
  const { queue, currentTrack, isQueueOpen, setQueueOpen, playTrack } = usePlayer();

  return (
    <div
      className={[
        "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isQueueOpen ? "max-h-[min(320px,50vh)]" : "max-h-0",
      ].join(" ")}
    >
      <div className="bg-[#080808] border-t border-[#141412] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#111]">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#555550]">
            Queue · {queue.length} track{queue.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={() => setQueueOpen(false)}
            className="text-[#333330] hover:text-[#888880] transition-colors"
            aria-label="Close queue"
          >
            <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>
        </div>

        {/* Track list */}
        <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: "calc(min(320px,50vh) - 41px)" }}>
          {queue.map((track, i) => {
            const isActive = track.id === currentTrack?.id;
            return (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className={[
                  "w-full flex items-center gap-3 px-4 md:px-6 py-2.5 text-left transition-colors duration-150",
                  isActive
                    ? "bg-[#c9a84c]/06 border-l-2 border-[#c9a84c]"
                    : "border-l-2 border-transparent hover:bg-[#111]",
                ].join(" ")}
              >
                {/* Index / playing indicator */}
                <span className="w-4 text-center text-[10px] tabular-nums shrink-0" style={{ color: isActive ? "#c9a84c" : "#333330" }}>
                  {isActive ? "♪" : i + 1}
                </span>

                {/* Thumbnail */}
                <div className="relative w-8 h-8 shrink-0 bg-[#111] rounded overflow-hidden">
                  {track.coverUrl ? (
                    <Image src={track.coverUrl} alt={track.title} fill sizes="32px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif italic text-xs text-[#c9a84c]/40">S</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className={["text-sm truncate leading-tight", isActive ? "text-[#c9a84c]" : "text-[#f0ebe0]"].join(" ")}>
                    {track.title}
                  </p>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-[#444440] truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main player bar
   ───────────────────────────────────────────────────────────── */
export function PersistentPlayer() {
  const {
    currentTrack, isPlaying, currentTime, duration,
    volume, isMuted, isVisible, isShuffled, isQueueOpen,
    queue,
    togglePlay, next, prev, seek, setVolume, toggleMute,
    toggleShuffle, setQueueOpen, dismiss,
  } = usePlayer();

  const progressRef = useRef<HTMLDivElement>(null);

  const fraction     = duration > 0 ? currentTime / duration : 0;
  const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
  const hasNext      = currentIndex < queue.length - 1;
  const hasPrev      = currentIndex > 0;

  const handleTopLineSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * duration);
  };

  return (
    <div
      className={[
        "fixed bottom-0 inset-x-0 z-50",
        "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isVisible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      {/* Queue drawer — expands above bar */}
      <QueueDrawer />

      {/* Mobile-only: thin seekable progress line at very top */}
      <div
        ref={progressRef}
        className="md:hidden h-[2px] bg-[#1a1a1a] cursor-pointer relative"
        onClick={handleTopLineSeek}
      >
        <div
          className="absolute inset-y-0 left-0 bg-[#c9a84c] pointer-events-none transition-all duration-100"
          style={{ width: `${fraction * 100}%` }}
        />
      </div>

      {/* Main bar */}
      <div
        className="bg-[#080808]/96 backdrop-blur-md border-t border-[#141412]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center gap-3 md:gap-4 h-[68px] md:h-[76px] px-4 md:px-6 max-w-6xl mx-auto">

          {/* ── Artwork with glow ── */}
          <div
            className={[
              "relative w-11 h-11 md:w-12 md:h-12 shrink-0 rounded overflow-hidden bg-[#111]",
              isPlaying ? "player-art-glow" : "",
            ].join(" ")}
          >
            {currentTrack?.coverUrl ? (
              <Image
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.07)" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" opacity={0.4}>
                  <circle cx="9"  cy="18" r="3" /><circle cx="18" cy="15" r="3" /><path d="M12 18V7l9-3v3" />
                </svg>
              </div>
            )}
          </div>

          {/* ── Track info ── */}
          <div className="min-w-0 w-36 md:w-48 shrink-0">
            <MarqueeTitle title={currentTrack?.title ?? "—"} />
            <p className="text-[9px] tracking-[0.28em] uppercase text-[#444440] mt-0.5 truncate">
              {currentTrack?.artist ?? ""}
            </p>
          </div>

          {/* ── Controls ── */}
          <div className="flex items-center gap-3 md:gap-3.5 shrink-0">
            <button onClick={prev} disabled={!hasPrev} aria-label="Previous"
              className="hidden sm:flex text-[#555550] hover:text-[#f0ebe0] disabled:opacity-20 disabled:cursor-default transition-colors">
              <PrevIcon />
            </button>

            <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[#c9a84c]/40 text-[#c9a84c] hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all duration-200 shrink-0">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button onClick={next} disabled={!hasNext} aria-label="Next"
              className="hidden sm:flex text-[#555550] hover:text-[#f0ebe0] disabled:opacity-20 disabled:cursor-default transition-colors">
              <NextIcon />
            </button>
          </div>

          {/* ── Waveform progress — desktop only ── */}
          <div className="hidden md:flex flex-1 items-center gap-3 min-w-0">
            <span className="text-[10px] text-[#2e2e2c] tabular-nums w-8 text-right shrink-0">
              {formatDuration(Math.floor(currentTime))}
            </span>

            {currentTrack ? (
              <WaveProgress
                trackId={currentTrack.id}
                fraction={fraction}
                duration={duration}
                onSeek={seek}
              />
            ) : (
              <div className="flex-1 h-[2px] bg-[#1a1a1a] rounded-full" />
            )}

            <span className="text-[10px] text-[#2e2e2c] tabular-nums w-8 shrink-0">
              {formatDuration(Math.floor(duration))}
            </span>
          </div>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-3 ml-auto shrink-0">

            {/* Shuffle */}
            <button onClick={toggleShuffle} aria-label="Shuffle"
              aria-pressed={isShuffled}
              className={["hidden sm:flex transition-colors", isShuffled ? "text-[#c9a84c]" : "text-[#444440] hover:text-[#888880]"].join(" ")}>
              <ShuffleIcon active={isShuffled} />
            </button>

            {/* Queue */}
            <button onClick={() => setQueueOpen(!isQueueOpen)} aria-label="Queue"
              aria-pressed={isQueueOpen}
              className={["hidden sm:flex transition-colors", isQueueOpen ? "text-[#c9a84c]" : "text-[#444440] hover:text-[#888880]"].join(" ")}>
              <QueueIcon />
            </button>

            {/* Volume — large screens only */}
            <div className="hidden lg:flex items-center gap-2">
              <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="text-[#444440] hover:text-[#f0ebe0] transition-colors">
                <VolumeIcon muted={isMuted} />
              </button>
              <input
                type="range"
                min={0} max={1} step={0.02}
                value={isMuted ? 0 : volume}
                onChange={e => setVolume(Number(e.target.value))}
                aria-label="Volume"
                className="w-20"
                style={{
                  background: `linear-gradient(to right, #c9a84c ${(isMuted ? 0 : volume) * 100}%, #1e1e1e ${(isMuted ? 0 : volume) * 100}%)`,
                }}
              />
            </div>

            {/* Dismiss */}
            <button onClick={dismiss} aria-label="Close player"
              className="text-[#2e2e2c] hover:text-[#666660] transition-colors">
              <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
