import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <p className="text-[9px] tracking-[0.45em] uppercase text-[#444440] mb-6">404</p>
      <h1
        className="font-serif font-light text-[#f0ebe0] leading-[0.88] mb-8"
        style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
      >
        Lost.
      </h1>
      <p className="font-serif italic text-[#555550] text-base mb-12 max-w-sm">
        This page doesn&apos;t exist. Maybe it never did.
      </p>
      <Link
        href="/"
        className="text-[9px] tracking-[0.4em] uppercase text-[#444440] hover:text-[#c9a84c] transition-colors duration-300"
      >
        ← Back home
      </Link>
    </div>
  );
}
