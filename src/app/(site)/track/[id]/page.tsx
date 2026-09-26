import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AudioPlayer } from "@/components/music/AudioPlayer";
import { EmbedCard } from "@/components/music/EmbedCard";
import { ShareButton } from "@/components/music/ShareButton";
import { CoverPlay } from "@/components/music/CoverPlay";
import type { ITrack } from "@/types";

export const dynamic = "force-dynamic";

async function getTrack(id: string): Promise<ITrack | null> {
  try {
    return (await prisma.track.findUnique({ where: { id } })) as ITrack | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const track = await getTrack(id);
  if (!track) return { title: "Track not found" };

  const description =
    track.description ||
    `${track.title} by ${track.artist}${track.tags?.length ? ` · ${track.tags.join(", ")}` : ""}. Listen on Sunatra.`;

  return {
    title: track.title,
    description,
    openGraph: {
      title: `${track.title} · ${track.artist}`,
      description,
      type: "music.song",
      // No cover: leave images unset so the site-wide OG card is used
      ...(track.coverUrl && { images: [{ url: track.coverUrl }] }),
    },
    twitter: {
      card: track.coverUrl ? "summary_large_image" : "summary",
      title: `${track.title} · ${track.artist}`,
      description,
    },
  };
}

export default async function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const track = await getTrack(id);
  if (!track) notFound();

  return (
    <div className="max-w-3xl mx-auto px-8 md:px-14 pt-28 pb-24">
      <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a84c] mb-8">
        {track.type === "exclusive" ? "Exclusive" : "Sounds"}
      </p>

      <div className="grid md:grid-cols-[minmax(0,260px)_1fr] gap-8 md:gap-12 items-start mb-12">
        {/* Cover */}
        <div className="relative aspect-square w-full max-w-[260px] md:max-w-[320px] bg-[#0d0d0d] border border-[#111] overflow-hidden">
          {track.coverUrl ? (
            <Image
              src={track.coverUrl}
              alt={track.title}
              fill
              priority
              sizes="(min-width: 768px) 260px, 320px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif italic text-6xl text-[#c9a84c]/50">S</span>
            </div>
          )}
          {track.type === "exclusive" && track.audioUrl && <CoverPlay track={track} />}
        </div>

        {/* Info */}
        <div>
          <h1
            className="font-serif font-light text-[#f0ebe0] italic leading-[0.95] mb-4"
            style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)" }}
          >
            {track.title}
          </h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#555550] mb-6">
            {track.artist}
          </p>

          {track.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {track.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[9px] tracking-[0.3em] uppercase border border-[#1a1a1a] text-[#888880]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {track.description && (
            <p className="font-serif italic text-[#888880] text-base md:text-lg leading-relaxed mb-8 whitespace-pre-line">
              {track.description}
            </p>
          )}

          <ShareButton id={track.id} title={track.title} />
        </div>
      </div>

      {/* Player */}
      {track.type === "exclusive" ? <AudioPlayer track={track} /> : <EmbedCard track={track} />}

      <div className="mt-14">
        <Link
          href="/music"
          className="text-[9px] tracking-[0.4em] uppercase text-[#444440] hover:text-[#c9a84c] transition-colors duration-300"
        >
          More sounds →
        </Link>
      </div>
    </div>
  );
}
