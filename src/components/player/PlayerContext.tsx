"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { ITrack } from "@/types";

const VOLUME_KEY = "sunatra-player-volume";

/* ─────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────── */
interface PlayerCtx {
  queue:        ITrack[];
  currentTrack: ITrack | null;
  isPlaying:    boolean;
  currentTime:  number;
  duration:     number;
  volume:       number;
  isMuted:      boolean;
  isVisible:    boolean;
  isShuffled:   boolean;
  isQueueOpen:  boolean;
  playTrack:    (track: ITrack) => void;
  setQueue:     (tracks: ITrack[], startIndex?: number) => void;
  togglePlay:   () => void;
  next:         () => void;
  prev:         () => void;
  seek:         (time: number) => void;
  setVolume:    (v: number) => void;
  toggleMute:   () => void;
  toggleShuffle:() => void;
  setQueueOpen: (open: boolean) => void;
  dismiss:      () => void;
}

const PlayerContext = createContext<PlayerCtx | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be inside <PlayerProvider>");
  return ctx;
}

/* ─────────────────────────────────────────────────────────────
   Shuffle helpers
   ───────────────────────────────────────────────────────────── */
function shuffleIndices(indices: number[]): number[] {
  const arr = [...indices];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ─────────────────────────────────────────────────────────────
   Provider
   ───────────────────────────────────────────────────────────── */
export function PlayerProvider({
  children,
  initialTracks,
}: {
  children: ReactNode;
  initialTracks: ITrack[];
}) {
  /* ── persistent refs (survive re-renders, no subscription) ── */
  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const queueRef      = useRef<ITrack[]>(initialTracks);
  const indexRef      = useRef<number>(-1);
  const playOrderRef  = useRef<number[]>(initialTracks.map((_, i) => i));
  const isShuffledRef = useRef(false);

  /* ── state ── */
  const [queue,        setQueueState]  = useState<ITrack[]>(initialTracks);
  const [currentIndex, setIndex]       = useState(-1);
  const [isPlaying,    setIsPlaying]   = useState(false);
  const [currentTime,  setCurrentTime] = useState(0);
  const [duration,     setDuration]    = useState(0);
  const [isMuted,      setIsMuted]     = useState(false);
  const [isVisible,    setIsVisible]   = useState(false);
  const [isShuffled,   setIsShuffled]  = useState(false);
  const [isQueueOpen,  setQueueOpen]   = useState(false);

  /* Volume — persisted to localStorage */
  const [volume, setVolumeState] = useState(() => {
    if (typeof window === "undefined") return 0.8;
    const stored = parseFloat(localStorage.getItem(VOLUME_KEY) ?? "");
    return isNaN(stored) ? 0.8 : stored;
  });

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null;

  /* ── keep refs in sync ── */
  useEffect(() => { queueRef.current     = queue; }, [queue]);
  useEffect(() => { indexRef.current     = currentIndex; }, [currentIndex]);
  useEffect(() => { isShuffledRef.current = isShuffled; }, [isShuffled]);

  /* ── core: load + play by queue index ── */
  const loadAndPlay = useCallback((idx: number) => {
    const audio = audioRef.current;
    const track = queueRef.current[idx];
    if (!audio || !track?.audioUrl) return;
    setIndex(idx);
    setCurrentTime(0);
    setDuration(0);
    audio.src   = track.audioUrl;
    audio.load();
    audio.play().catch(console.error);
    setIsPlaying(true);
    setIsVisible(true);
  }, []);

  /* ── next/prev respecting shuffle order ── */
  const getNextIdx = useCallback((currentIdx: number): number => {
    const order = playOrderRef.current;
    const pos   = order.indexOf(currentIdx);
    return pos < order.length - 1 ? order[pos + 1] : -1;
  }, []);

  const getPrevIdx = useCallback((currentIdx: number): number => {
    const order = playOrderRef.current;
    const pos   = order.indexOf(currentIdx);
    return pos > 0 ? order[pos - 1] : -1;
  }, []);

  /* ── create audio element once ── */
  useEffect(() => {
    const saved = parseFloat(localStorage.getItem(VOLUME_KEY) ?? "");
    const vol   = isNaN(saved) ? 0.8 : saved;

    const audio  = new Audio();
    audio.volume = vol;
    audio.preload = "metadata";
    audioRef.current = audio;

    audio.addEventListener("timeupdate",     () => setCurrentTime(audio.currentTime));
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => {
      const ni = getNextIdx(indexRef.current);
      if (ni !== -1) loadAndPlay(ni);
      else setIsPlaying(false);
    });

    return () => { audio.pause(); audio.src = ""; };
  }, [getNextIdx, loadAndPlay]);

  /* ── keyboard shortcuts ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (["INPUT","TEXTAREA","SELECT"].includes(t.tagName) || t.isContentEditable) return;

      const audio = audioRef.current;

      switch (e.key) {
        case " ":
          if (!audio) return;
          e.preventDefault();
          if (audio.paused) { audio.play().catch(console.error); setIsPlaying(true); }
          else              { audio.pause(); setIsPlaying(false); }
          break;

        case "ArrowRight":
          e.preventDefault();
          if (audio) {
            const t2 = Math.min(audio.currentTime + 10, audio.duration || 0);
            audio.currentTime = t2;
            setCurrentTime(t2);
          }
          break;

        case "ArrowLeft":
          e.preventDefault();
          if (audio) {
            const t2 = Math.max(audio.currentTime - 10, 0);
            audio.currentTime = t2;
            setCurrentTime(t2);
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (audio) {
            const v = Math.min(+(audio.volume + 0.1).toFixed(1), 1);
            audio.volume = v;
            setVolumeState(v);
            localStorage.setItem(VOLUME_KEY, String(v));
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          if (audio) {
            const v = Math.max(+(audio.volume - 0.1).toFixed(1), 0);
            audio.volume = v;
            setVolumeState(v);
            localStorage.setItem(VOLUME_KEY, String(v));
          }
          break;

        case "m": case "M":
          if (audio) { audio.muted = !audio.muted; setIsMuted(audio.muted); }
          break;

        case "n": case "N": {
          const ni = getNextIdx(indexRef.current);
          if (ni !== -1) loadAndPlay(ni);
          break;
        }

        case "p": case "P":
          if (audio && audio.currentTime > 3) { audio.currentTime = 0; break; }
          else { const pi = getPrevIdx(indexRef.current); if (pi !== -1) loadAndPlay(pi); }
          break;

        case "s": case "S":
          setIsShuffled(prev => {
            const next = !prev;
            isShuffledRef.current = next;
            rebuildPlayOrder(indexRef.current, next);
            return next;
          });
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [getNextIdx, getPrevIdx, loadAndPlay]);

  /* ── helpers for shuffle ── */
  const rebuildPlayOrder = (currentIdx: number, shuffle: boolean) => {
    const len     = queueRef.current.length;
    const indices = Array.from({ length: len }, (_, i) => i);
    if (!shuffle) {
      playOrderRef.current = indices;
    } else {
      const others  = indices.filter(i => i !== currentIdx);
      playOrderRef.current = [currentIdx, ...shuffleIndices(others)];
    }
  };

  /* ── public actions ── */
  const playTrack = useCallback((track: ITrack) => {
    let idx = queueRef.current.findIndex(t => t.id === track.id);
    if (idx === -1) {
      const newQueue = [...queueRef.current, track];
      queueRef.current = newQueue;
      setQueueState(newQueue);
      idx = newQueue.length - 1;
    }
    rebuildPlayOrder(idx, isShuffledRef.current);
    loadAndPlay(idx);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadAndPlay]);

  const setQueue = useCallback((tracks: ITrack[], startIndex = 0) => {
    queueRef.current = tracks;
    setQueueState(tracks);
    rebuildPlayOrder(startIndex, isShuffledRef.current);
    loadAndPlay(startIndex);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadAndPlay]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioUrl) return;
    if (audio.paused) { audio.play().catch(console.error); setIsPlaying(true); }
    else              { audio.pause(); setIsPlaying(false); }
  }, [currentTrack]);

  const next = useCallback(() => {
    const ni = getNextIdx(indexRef.current);
    if (ni !== -1) loadAndPlay(ni);
  }, [getNextIdx, loadAndPlay]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) { audio.currentTime = 0; return; }
    const pi = getPrevIdx(indexRef.current);
    if (pi !== -1) loadAndPlay(pi);
  }, [getPrevIdx, loadAndPlay]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume  = v;
    audio.muted   = false;
    setVolumeState(v);
    setIsMuted(false);
    localStorage.setItem(VOLUME_KEY, String(v));
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => {
      const next = !prev;
      isShuffledRef.current = next;
      rebuildPlayOrder(indexRef.current, next);
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setIsVisible(false);
    setQueueOpen(false);
  }, []);

  return (
    <PlayerContext.Provider value={{
      queue, currentTrack, isPlaying, currentTime, duration,
      volume, isMuted, isVisible, isShuffled, isQueueOpen,
      playTrack, setQueue, togglePlay, next, prev,
      seek, setVolume, toggleMute, toggleShuffle, setQueueOpen, dismiss,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}
