import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Deterministic waveform heights from a seed string (track id) */
export function getWaveHeights(seed: string, count: number): number[] {
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

export function serializeDoc<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}
