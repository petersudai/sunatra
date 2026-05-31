import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = {
  title: "About — Sunatra",
  description: "Sound, image, code — built from Kajiado.",
};

/* ─────────────────────────────────────────────────────────────
   Quote pool — add as many as you like.
   ───────────────────────────────────────────────────────────── */
const QUOTES = [
  "The man who fears losing has already lost.",
  // "Add more quotes here.",
];

/* ─────────────────────────────────────────────────────────────
   Hero image pool
   ───────────────────────────────────────────────────────────── */
const HERO_IMAGES = [
  "/images/wilderness-road.jpg",
  // "/images/another-image.jpg",
];

/* ─────────────────────────────────────────────────────────────
   Bio — edit freely.
   ───────────────────────────────────────────────────────────── */
const BIO = {
  intro: `From Kajiado, Kenya. Producing music, building things, and keeping Sunday League strikers honest.

Shaped by triumphs, heartbreaks, the late night spirals into the quiet before sunrise, and the open roads just after it. Not just in the music. In everything.`,

  second: `When I'm not in the studio, I'm building things. Or watching The Arsenal.
And of course I am a Sunday League Turf legend.`,

  facts: [
    { label: "Based in",   value: "Kajiado, Kenya" },
    { label: "Makes",      value: "Music, sets, apps, strong defensive tackles." },
    { label: "Influences", value: "The wilderness, solitude, rhythm, The Arsenal." },
  ],
};

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const quote   = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const heroSrc = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];

  return (
    <div>

      {/* ── Full-screen hero quote ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[100%_85%] md:object-[50%_35%] hero-ken-burns"
          />
          <div className="absolute inset-0 bg-black/[0.42]" />
        </div>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #080808 0%, rgba(8,8,8,0.92) 22%, rgba(8,8,8,0.6) 44%, rgba(8,8,8,0.18) 65%, rgba(8,8,8,0.45) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[55%] md:hidden bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent" />

        <div className="relative z-10 px-8 md:px-14 pb-20 md:pb-32 max-w-3xl">
          <div className="hero-line h-px bg-[#c9a84c] mb-10" style={{ width: "3rem" }} />
          <p
            className="hero-name font-serif font-light italic text-[#f0ebe0] leading-[1.22]"
            style={{
              fontSize: "clamp(1.45rem, 3vw, 2.75rem)",
              textShadow: "0 2px 24px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1)",
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-8 md:left-14 z-10 flex flex-col items-center gap-1">
          <div className="h-10 w-px overflow-hidden relative">
            <div className="scroll-drop absolute inset-0 bg-[#333330]" />
          </div>
        </div>

      </section>

      {/* ── Bio ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">

        {/* Background image — diani dawn, deeply muted */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/diani-dawn.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Heavy overlay so text always wins */}
          <div className="absolute inset-0 bg-[#080808]/88" />
          {/* Soft vignette edges */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 30%, #080808 100%)" }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-8 md:px-14 py-24 md:py-32">
          <Reveal>
            <p className="text-[9px] tracking-[0.45em] uppercase text-[#444440] mb-10">About</p>
          </Reveal>

          <Reveal>
            <p className="font-serif font-light text-[#c8c2b4] text-lg md:text-xl leading-[1.8] mb-8 whitespace-pre-line">
              {BIO.intro}
            </p>
          </Reveal>

          <Reveal>
            <p className="font-serif font-light text-[#888880] text-base md:text-lg leading-[1.8] mb-16 whitespace-pre-line">
              {BIO.second}
            </p>
          </Reveal>

          {/* Facts row */}
          <Reveal>
            <div className="border-t border-[#ffffff08] pt-10 grid sm:grid-cols-3 gap-8">
              {BIO.facts.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-[#444440] mb-2">{label}</p>
                  <p className="font-serif text-[#c8c2b4] text-sm leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
