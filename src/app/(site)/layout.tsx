import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PlayerProvider } from "@/components/player/PlayerContext";
import { PersistentPlayer } from "@/components/player/PersistentPlayer";
import { PlayerSpacerClient } from "@/components/player/PlayerSpacerClient";
import { prisma } from "@/lib/prisma";
import type { ITrack } from "@/types";

export const dynamic = "force-dynamic";

async function getExclusiveTracks(): Promise<ITrack[]> {
  try {
    const tracks = await prisma.track.findMany({
      where: { type: "exclusive" },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return tracks as ITrack[];
  } catch {
    return [];
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const exclusiveTracks = await getExclusiveTracks();

  return (
    <PlayerProvider initialTracks={exclusiveTracks}>
      <Navbar />
      <main>{children}</main>
      {/* Spacer prevents last page section hiding behind the player bar */}
      <PlayerSpacerClient />
      <Footer />
      <PersistentPlayer />
    </PlayerProvider>
  );
}
