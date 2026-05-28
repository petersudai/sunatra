import Image from "next/image";

export const metadata = {
  title: "About — Sunatra",
  description: "Sound, image, code — built from Kajiado.",
};

/* ─────────────────────────────────────────────────────────────
   Quote pool — add as many as you like.
   Each page load picks one at random (server-side, no JS flicker).
   ───────────────────────────────────────────────────────────── */
const QUOTES = [
  "The man who fears losing has already lost.",
  // "Your next quote here.",
];

/* ─────────────────────────────────────────────────────────────
   Hero image pool — add more paths from /public/images/.
   Each page load picks one at random.
   ───────────────────────────────────────────────────────────── */
const HERO_IMAGES = [
  "/images/wilderness-road.jpg",
  // "/images/another-image.jpg",
];

/*
  FUTURE: timed rotation (quote + image changes every N seconds)
  → Convert this to a "use client" component
  → useState for quoteIndex + imageIndex
  → useEffect with setInterval to cycle through the arrays
  → Consider a fade transition between swaps (opacity + CSS transition)
  → Recommended interval: 8–12 s for quotes, 20–30 s for images
*/

/* force-dynamic ensures Math.random() reruns on every request,
   not once at build time */
export const dynamic = "force-dynamic";

export default function AboutPage() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const heroSrc = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];

  return (
    <div>

      {/* ── Full-screen statement ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">

        {/* Background — rotates from the pool on each load */}
        <div className="absolute inset-0">
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            className="object-cover object-center hero-ken-burns brightness-[0.58]"
          />
        </div>

        {/* Gradient: strong bottom fade, veil across top */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #080808 0%, rgba(8,8,8,0.92) 22%, rgba(8,8,8,0.6) 44%, rgba(8,8,8,0.18) 65%, rgba(8,8,8,0.45) 100%)",
          }}
        />
        {/* Extra mobile bottom — ensures quote stays readable on short viewports */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] md:hidden bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent" />

        {/* Quote — anchored to the bottom-left, letting the image breathe above */}
        <div className="relative z-10 px-8 md:px-14 pb-20 md:pb-32 max-w-3xl">
          <div
            className="hero-line h-px bg-[#c9a84c] mb-10"
            style={{ width: "3rem" }}
          />
          <p
            className="hero-name font-serif font-light italic text-[#f0ebe0] leading-[1.22]"
            style={{
              fontSize: "clamp(1.45rem, 3vw, 2.75rem)",
              textShadow: "0 2px 24px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1)",
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>
          <p className="hero-meta text-[9px] tracking-[0.45em] uppercase text-[#555550] mt-8">
            Sunatra &middot; Kajiado
          </p>
        </div>

      </section>

    </div>
  );
}
