import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MusicTabs } from "@/components/music/MusicTabs";
import type { ITrack } from "@/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Music" };

async function getData() {
  try {
    const tracks = await prisma.track.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return tracks as ITrack[];
  } catch {
    return [];
  }
}

export default async function MusicPage() {
  const tracks = await getData();

  const exclusives = tracks.filter((t) => t.type === "exclusive");
  const released = tracks.filter((t) => t.type === "released");
  const mixes = tracks.filter((t) => t.type === "mix");

  return (
    <div className="max-w-4xl mx-auto px-8 md:px-14 pt-28 pb-24">
      <div className="mb-14">
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#444440] mb-5">Music</p>
        <h1
          className="font-serif font-light text-[#f0ebe0] italic leading-[0.88] mb-4"
          style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
        >
          The Work
        </h1>
        <p className="font-serif italic text-[#555550] text-base md:text-lg">
          Beats, sets, and the sound between.
        </p>
        <div className="h-px bg-[#111] mt-8" />
      </div>
      <MusicTabs exclusives={exclusives} released={released} mixes={mixes} />
    </div>
  );
}
