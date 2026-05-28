import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { IFavoriteTrack, IColorPalette, IColorSwatch } from "@/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Faves" };

async function getData() {
  try {
    const [tracks, palettes] = await Promise.all([
      prisma.favoriteTrack.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
      prisma.colorPalette.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    ]);
    return {
      tracks: tracks as IFavoriteTrack[],
      palettes: palettes as IColorPalette[],
    };
  } catch {
    return { tracks: [], palettes: [] };
  }
}

export default async function FavoritesPage() {
  const { tracks, palettes } = await getData();

  return (
    <div className="max-w-4xl mx-auto px-8 md:px-14 pt-28 pb-24">
      <div className="mb-14">
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#444440] mb-5">Influence</p>
        <h1
          className="font-serif font-light text-[#f0ebe0] italic leading-[0.88] mb-4"
          style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
        >
          Faves
        </h1>
        <p className="font-serif italic text-[#555550] text-base md:text-lg">
          What I&apos;m listening to. What I keep coming back to.
        </p>
        <div className="h-px bg-[#111] mt-8" />
      </div>

      {/* Tracks on repeat */}
      <section className="mb-20">
        <div className="flex items-center gap-5 mb-10">
          <h2 className="font-serif font-light text-[#f0ebe0] italic text-xl whitespace-nowrap">
            Tracks on repeat
          </h2>
          <div className="flex-1 h-px bg-[#111]" />
        </div>
        {tracks.length === 0 ? (
          <p className="font-serif italic text-[#333330] text-sm">Nothing here yet.</p>
        ) : (
          <div className="grid gap-2">
            {tracks.map((track) => (
              <div key={track.id} className="bg-[#0a0a0a] border border-[#111] overflow-hidden hover:border-[#1e1e1e] transition-colors duration-300">
                {track.embedUrl && (
                  <iframe src={track.embedUrl} width="100%" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media" loading="lazy" className="block" />
                )}
                <div className="px-5 pb-4 pt-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-[#f0ebe0] text-sm leading-snug">{track.title}</p>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-[#444440] mt-1">{track.artist}</p>
                  </div>
                  {track.notes && (
                    <p className="text-[11px] text-[#444440] italic max-w-[180px] text-right leading-relaxed">{track.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Colour palettes */}
      <section>
        <div className="flex items-center gap-5 mb-10">
          <h2 className="font-serif font-light text-[#f0ebe0] italic text-xl whitespace-nowrap">
            Colour palettes
          </h2>
          <div className="flex-1 h-px bg-[#111]" />
        </div>
        {palettes.length === 0 ? (
          <p className="font-serif italic text-[#333330] text-sm">Nothing here yet.</p>
        ) : (
          <div className="grid gap-6">
            {palettes.map((palette) => (
              <div key={palette.id}>
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="font-serif text-[#f0ebe0] text-base italic">{palette.name}</h3>
                  {palette.notes && (
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#444440]">{palette.notes}</p>
                  )}
                </div>
                {/* Full-width color strip */}
                <div className="flex h-12 overflow-hidden">
                  {(palette.colors as IColorSwatch[]).map((swatch, i) => (
                    <div
                      key={i}
                      className="group relative flex-1"
                      style={{ background: swatch.hex }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 bg-[#0a0a0a] border border-[#1e1e1e] text-[9px] text-[#f0ebe0] px-2 py-1 whitespace-nowrap transition-opacity duration-150 z-10 pointer-events-none">
                        {swatch.name ? `${swatch.name} · ` : ""}{swatch.hex}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Hex values below */}
                <div className="flex mt-2">
                  {(palette.colors as IColorSwatch[]).map((swatch, i) => (
                    <div key={i} className="flex-1">
                      <p className="text-[8px] tracking-[0.2em] text-[#333330] font-mono truncate">{swatch.hex}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
