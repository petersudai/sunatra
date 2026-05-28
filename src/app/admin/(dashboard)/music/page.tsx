import { prisma } from "@/lib/prisma";
import { MusicManager } from "@/components/admin/MusicManager";
import type { ITrack } from "@/types";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const tracks = await prisma.track.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
    return tracks as ITrack[];
  } catch { return []; }
}

export default async function AdminMusicPage() {
  const tracks = await getData();
  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#f5f0e8] mb-2">Music</h1>
      <p className="text-sm text-[#888880] mb-10">Upload exclusives or add platform embeds.</p>
      <MusicManager initialTracks={tracks} />
    </div>
  );
}
