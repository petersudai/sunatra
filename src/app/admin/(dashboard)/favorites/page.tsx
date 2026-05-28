import { prisma } from "@/lib/prisma";
import { FavoritesManager } from "@/components/admin/FavoritesManager";
import type { IFavoriteTrack, IColorPalette } from "@/types";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [tracks, palettes] = await Promise.all([
      prisma.favoriteTrack.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
      prisma.colorPalette.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    ]);
    return { tracks: tracks as IFavoriteTrack[], palettes: palettes as IColorPalette[] };
  } catch { return { tracks: [], palettes: [] }; }
}

export default async function AdminFavoritesPage() {
  const { tracks, palettes } = await getData();
  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#f5f0e8] mb-2">Favorites</h1>
      <p className="text-sm text-[#888880] mb-10">Manage favourite tracks and colour palettes.</p>
      <FavoritesManager initialTracks={tracks} initialPalettes={palettes} />
    </div>
  );
}
