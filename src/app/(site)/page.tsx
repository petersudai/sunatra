import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AudioPlayer } from "@/components/music/AudioPlayer";
import { EmbedCard } from "@/components/music/EmbedCard";
import { Reveal } from "@/components/ui/Reveal";
import type { ITrack, IPhoto } from "@/types";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [featuredTracks, featuredPhotos] = await Promise.all([
      prisma.track.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 4 }),
      prisma.photo.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 6 }),
    ]);
    return { featuredTracks: featuredTracks as ITrack[], featuredPhotos: featuredPhotos as IPhoto[] };
  } catch {
    return { featuredTracks: [], featuredPhotos: [] };
  }
}

/* Ticker words — no craft labels, just identity */
const TICKER_ITEMS = [
  "SUNATRA", "SOUND", "IMAGE", "CODE", "NAIROBI", "AFROFUTURIST",
  "EST 2020", "WILDERNESS", "BUILDER", "EXPLORER", "CURIOUS",
  "SUNATRA", "SOUND", "IMAGE", "CODE", "NAIROBI", "AFROFUTURIST",
  "EST 2020", "WILDERNESS", "BUILDER", "EXPLORER", "CURIOUS",
];

/* Broad pillars — not a job listing */
const PILLARS = [
  {
    id: "01",
    title: "Sound",
    desc: "Production, performance, and the architecture of feeling. From the studio to the dancefloor — every frequency welcome.",
  },
  {
    id: "02",
    title: "Image",
    desc: "Light, landscape, and the stories that live in a single frame. Kenya and beyond — coast, city, wilderness.",
  },
  {
    id: "03",
    title: "Build",
    desc: "Code, systems, products, and the craft of making ideas real. From backend to brand — whatever the idea demands.",
  },
];

/* Static waveform bars */
const WAVE = [
  28,52,38,72,45,88,33,65,50,80,42,70,58,40,85,35,62,78,48,90,
  30,68,44,76,55,38,82,47,60,85,36,70,50,90,40,65,55,78,42,68,
];

export default async function HomePage() {
  const { featuredTracks, featuredPhotos } = await getData();

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background: wilderness savanna — oversized vertically for parallax room */}
        <div
          className="absolute left-0 right-0 bottom-0 hero-parallax"
          style={{ top: "-18%" }}
        >
          <Image
            src="/images/wilderness-tree.jpg"
            alt=""
            fill
            priority
            className="object-cover object-[62%_45%] hero-ken-burns brightness-[0.72]"
          />
        </div>

        {/* Gradient layers */}
        {/* 1. Left-to-right: keeps text legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #080808 18%, rgba(8,8,8,0.82) 38%, rgba(8,8,8,0.28) 62%, rgba(8,8,8,0.08) 82%)",
          }}
        />
        {/* 2. Sky darkening (top) */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(8,8,8,0.58) 0%, transparent 32%)",
          }}
        />
        {/* 3. Bottom fade to page */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#080808] to-transparent" />

        {/* Mobile avatar — above the name */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 lg:hidden z-10">
          <div
            className="avatar-float avatar-glow relative w-28 h-28 rounded-full overflow-hidden"
          >
            <Image
              src="/images/maastronaut.jpg"
              alt="Sunatra"
              fill
              className="object-cover object-[50%_12%]"
            />
            {/* Edge vignette */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 48%, rgba(8,8,8,0.55) 100%)",
              }}
            />
          </div>
        </div>

        {/* Text — left-anchored, vertically centered */}
        <div className="relative z-10 px-8 md:px-14 max-w-2xl mt-20 md:mt-0">
          <div className="hero-line h-px bg-[#c9a84c] mb-10" style={{ width: "3rem" }} />

          <h1
            className="hero-name font-serif font-light text-[#f0ebe0] leading-[0.88] tracking-[-0.025em] mb-8"
            style={{ fontSize: "clamp(4.5rem, 11vw, 11rem)" }}
          >
            SUNATRA
          </h1>

          <p className="hero-meta text-[10px] tracking-[0.45em] uppercase text-[#888880]">
            Nairobi, Kenya
          </p>
        </div>

        {/* Desktop avatar — right zone, well clear of the SUNATRA text */}
        <div
          className="absolute hidden lg:block z-10"
          style={{ right: "12%", top: "50%", transform: "translateY(-50%)" }}
        >
          <div
            className="avatar-float avatar-glow relative w-[200px] h-[200px] xl:w-[240px] xl:h-[240px] rounded-full overflow-hidden"
          >
            <Image
              src="/images/maastronaut.jpg"
              alt="Sunatra"
              fill
              className="object-cover object-[50%_12%]"
            />
            {/* Edge vignette — blends avatar into landscape */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(8,8,8,0.5) 100%)",
              }}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-8 md:left-14 z-10 flex flex-col items-center gap-1">
          <div className="h-10 w-px overflow-hidden relative">
            <div className="scroll-drop absolute inset-0 bg-[#333330]" />
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────── */}
      <div className="border-y border-[#0f0f0f] py-3.5 bg-[#080808]" style={{ overflow: "hidden" }}>
        <div className="animate-marquee">
          {TICKER_ITEMS.map((item, i) => (
            <span
              key={i}
              style={{ display: "inline-flex", alignItems: "center", gap: "24px", padding: "0 24px" }}
            >
              <span style={{ fontSize: "9px", letterSpacing: "0.42em", color: "#3a3a38", textTransform: "uppercase" }}>
                {item}
              </span>
              <span style={{ color: "rgba(201,168,76,0.25)", fontSize: "7px" }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Manifesto ────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-24 md:py-36">
        <div className="max-w-5xl">

          <Reveal>
            <p
              className="font-serif font-light text-[#f0ebe0] leading-[0.92] mb-16"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)" }}
            >
              Sound and image,<br />built from Nairobi.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 border-t border-[#111] pt-10">
            {PILLARS.map(({ id, title, desc }, i) => (
              <Reveal key={id} delay={(i + 1) as 1 | 2 | 3}>
                <div className="border-l border-[#1c1c1a] pl-5">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c] mb-3">{id}</p>
                  <h3 className="text-[#f0ebe0] text-[11px] font-medium tracking-[0.15em] uppercase mb-3">
                    {title}
                  </h3>
                  <p className="text-[#555550] text-[11px] leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Openness signal */}
          <Reveal delay={4}>
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#252523] mt-10">
              And whatever else curiosity demands.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Work teasers ─────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 border-t border-[#0f0f0f]">

        {/* Music panel */}
        <Link
          href="/music"
          className="group relative flex items-end p-10 md:p-14 h-80 md:h-[28rem] overflow-hidden border-b md:border-b-0 md:border-r border-[#0f0f0f] bg-[#050505]"
        >
          {/* Breathing waveform */}
          <div className="absolute inset-0 flex items-center justify-center gap-[3px] pointer-events-none">
            {WAVE.map((h, i) => (
              <div
                key={i}
                className="wave-bar rounded-sm bg-[#c9a84c]"
                style={{
                  width: "4px",
                  height: `${h}%`,
                  animationDelay: `${(i % 10) * 0.15}s`,
                }}
              />
            ))}
          </div>
          {/* Brighter on hover */}
          <div className="absolute inset-0 bg-[#c9a84c] opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700" />

          <div className="relative z-10">
            <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a84c] mb-4">01 · Music</p>
            <h2
              className="font-serif font-light text-[#f0ebe0] leading-[0.9] mb-5"
              style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}
            >
              The Sound
            </h2>
            <span className="text-[9px] tracking-[0.35em] uppercase text-[#3a3a38] group-hover:text-[#c9a84c] transition-colors duration-300">
              Listen →
            </span>
          </div>
        </Link>

        {/* Photography panel */}
        <Link
          href="/photos"
          className="group relative flex items-end p-10 md:p-14 h-80 md:h-[28rem] overflow-hidden bg-[#050505]"
        >
          <Image
            src="/images/diani-beach.jpg"
            alt="Photography"
            fill
            className="object-cover object-center brightness-[0.42] group-hover:brightness-[0.55] group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

          <div className="relative z-10">
            <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a84c] mb-4">02 · Photography</p>
            <h2
              className="font-serif font-light text-[#f0ebe0] leading-[0.9] mb-5"
              style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}
            >
              The Image
            </h2>
            <span className="text-[9px] tracking-[0.35em] uppercase text-[#888880] group-hover:text-[#f0ebe0] transition-colors duration-300">
              View →
            </span>
          </div>
        </Link>
      </div>

      {/* ── Featured music (conditional) ─────────────────────── */}
      {featuredTracks.length > 0 && (
        <section className="px-8 md:px-14 py-20 md:py-28 border-t border-[#0f0f0f]">
          <Reveal>
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#555550] mb-2">Featured</p>
                <h2
                  className="font-serif font-light text-[#f0ebe0]"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)" }}
                >
                  Music
                </h2>
              </div>
              <Link
                href="/music"
                className="hidden md:flex items-center gap-2 text-[9px] tracking-[0.35em] uppercase text-[#444440] hover:text-[#c9a84c] transition-colors"
              >
                All tracks →
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-2 max-w-3xl">
            {featuredTracks.map((track) =>
              track.type === "exclusive" ? (
                <AudioPlayer key={track.id} track={track} />
              ) : (
                <EmbedCard key={track.id} track={track} />
              )
            )}
          </div>
          <div className="mt-6 md:hidden">
            <Link href="/music" className="text-[9px] tracking-[0.35em] uppercase text-[#444440] hover:text-[#c9a84c] transition-colors">
              All tracks →
            </Link>
          </div>
        </section>
      )}

      {/* ── Featured photos (conditional) ────────────────────── */}
      {featuredPhotos.length > 0 && (
        <section className="px-8 md:px-14 py-20 md:py-28 border-t border-[#0f0f0f]">
          <Reveal>
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#555550] mb-2">Selected</p>
                <h2
                  className="font-serif font-light text-[#f0ebe0]"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)" }}
                >
                  Photography
                </h2>
              </div>
              <Link
                href="/photos"
                className="hidden md:flex items-center gap-2 text-[9px] tracking-[0.35em] uppercase text-[#444440] hover:text-[#c9a84c] transition-colors"
              >
                Full gallery →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px">
            {featuredPhotos.map((photo, i) => (
              <Link
                key={photo.id}
                href="/photos"
                className={[
                  "block overflow-hidden group relative bg-[#111]",
                  i === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-square",
                ].join(" ")}
              >
                <Image
                  src={photo.url}
                  alt={photo.caption ?? ""}
                  fill
                  className="object-cover brightness-75 group-hover:brightness-90 group-hover:scale-105 transition-all duration-700"
                />
              </Link>
            ))}
          </div>
          <div className="mt-6 md:hidden">
            <Link href="/photos" className="text-[9px] tracking-[0.35em] uppercase text-[#444440] hover:text-[#c9a84c] transition-colors">
              Full gallery →
            </Link>
          </div>
        </section>
      )}

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section className="border-t border-[#0f0f0f] px-8 md:px-14 py-16 md:py-24">
        <Reveal>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
            <div>
              <p
                className="font-serif font-light italic text-[#f0ebe0]/[0.18] leading-[0.9] select-none mb-5"
                style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
              >
                Available for<br />collaboration.
              </p>
              <p className="text-[9px] tracking-[0.35em] uppercase text-[#2e2e2c]">
                Sound · Image · Code · Whatever comes next.
              </p>
            </div>
            <nav className="flex flex-col gap-3 items-start md:items-end">
              {[
                { href: "/music", label: "Music" },
                { href: "/photos", label: "Photos" },
                { href: "/favorites", label: "Inspiration" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[9px] tracking-[0.35em] uppercase text-[#2e2e2c] hover:text-[#c9a84c] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
