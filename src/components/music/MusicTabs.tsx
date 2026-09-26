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

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const content: Record<TabId, ITrack[]> = { exclusives, released, mixes };
  const tabTracks = content[active];

  // Genre pills come from whatever is in the current tab; hidden if nothing is tagged
  const tagOptions = Array.from(new Set(tabTracks.flatMap((t) => t.tags ?? [])));
  const selectedTag = activeTag && tagOptions.includes(activeTag) ? activeTag : null;
  const tracks = selectedTag ? tabTracks.filter((t) => t.tags?.includes(selectedTag)) : tabTracks;

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

      {tagOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {[null, ...tagOptions].map((tag) => (
            <button
              key={tag ?? "all"}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "px-4 py-1.5 text-[9px] tracking-[0.35em] uppercase border transition-all duration-200",
                selectedTag === tag
                  ? "bg-[#c9a84c]/10 border-[#c9a84c]/40 text-[#c9a84c]"
                  : "border-[#1a1a1a] text-[#444440] hover:border-[#2a2a2a] hover:text-[#888880]"
              )}
            >
              {tag ?? "All"}
            </button>
          ))}
        </div>
      )}

      {tracks.length === 0 ? (
        <p className="font-serif italic text-[#333330] text-sm py-12">
          Nothing here yet.
        </p>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-2">
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
