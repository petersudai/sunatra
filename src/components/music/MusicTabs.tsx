"use client";

import { useState } from "react";
import { AudioPlayer } from "./AudioPlayer";
import { EmbedCard } from "./EmbedCard";
import { cn } from "@/lib/utils";
import type { ITrack } from "@/types";

const tabs = [
  { id: "exclusives", label: "Exclusives" },
  { id: "released", label: "Released" },
  { id: "mixes", label: "Mixes" },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface Props {
  exclusives: ITrack[];
  released: ITrack[];
  mixes: ITrack[];
}

export function MusicTabs({ exclusives, released, mixes }: Props) {
  const [active, setActive] = useState<TabId>("exclusives");

  const content: Record<TabId, ITrack[]> = { exclusives, released, mixes };
  const tracks = content[active];

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-1 mb-10 border-b border-[#111] pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "px-5 py-3 text-[9px] tracking-[0.35em] uppercase transition-all duration-200 border-b-2 -mb-px",
              active === tab.id
                ? "text-[#f0ebe0] border-[#c9a84c]"
                : "text-[#444440] border-transparent hover:text-[#888880]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tracks.length === 0 ? (
        <p className="font-serif italic text-[#333330] text-sm py-12">
          Nothing here yet.
        </p>
      ) : (
        <div className="grid gap-2">
          {tracks.map((track) =>
            track.type === "exclusive" ? (
              <AudioPlayer key={track.id} track={track} />
            ) : (
              <EmbedCard key={track.id} track={track} />
            )
          )}
        </div>
      )}
    </div>
  );
}
