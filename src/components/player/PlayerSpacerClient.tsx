"use client";

import { usePlayer } from "./PlayerContext";

export function PlayerSpacerClient() {
  const { isVisible } = usePlayer();
  return isVisible ? <div className="h-[78px] md:h-[80px]" aria-hidden /> : null;
}
