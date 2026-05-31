"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";
import type { IPhoto } from "@/types";

export function PhotoGrid({ photos }: { photos: IPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  /* Build unique category list from photos that have one */
  const categories = useMemo(() => {
    const cats = photos.map(p => p.category).filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(cats))];
  }, [photos]);

  const showFilter = categories.length > 2; // only render pills if there are real categories

  /* Filtered list + preserve original indices for the lightbox */
  const filtered = useMemo(() =>
    activeCategory === "All"
      ? photos.map((p, i) => ({ photo: p, originalIndex: i }))
      : photos
          .map((p, i) => ({ photo: p, originalIndex: i }))
          .filter(({ photo }) => photo.category === activeCategory),
    [photos, activeCategory]
  );

  if (photos.length === 0) {
    return (
      <p className="text-center font-serif italic text-[#333330] text-sm py-16">
        No photos yet.
      </p>
    );
  }

  return (
    <>
      {/* ── Category filter pills ── */}
      {showFilter && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                "px-4 py-1.5 text-[9px] tracking-[0.35em] uppercase transition-all duration-200",
                activeCategory === cat
                  ? "bg-[#c9a84c]/10 border border-[#c9a84c]/40 text-[#c9a84c]"
                  : "border border-[#1a1a1a] text-[#444440] hover:border-[#2a2a2a] hover:text-[#888880]",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ── Masonry grid ── */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
        {filtered.map(({ photo, originalIndex }, i) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(originalIndex)}
            className="w-full block overflow-hidden group cursor-zoom-in"
            aria-label={photo.caption ?? `Photo ${i + 1}`}
          >
            <Image
              src={photo.url}
              alt={photo.caption ?? ""}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto object-cover brightness-90 group-hover:brightness-100 group-hover:scale-[1.02] transition-all duration-500"
            />
          </button>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </>
  );
}
