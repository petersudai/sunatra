import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#0f0f0f] px-8 md:px-14 pt-14 pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">

        {/* Left — statement */}
        <div>
          <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a84c] mb-3">Sunatra</p>
          <p className="font-serif font-light italic text-[#f0ebe0]/30 text-2xl md:text-3xl leading-tight">
            Sound and image,<br />built from Nairobi.
          </p>
        </div>

        {/* Right — nav */}
        <nav className="flex flex-col gap-3 items-start md:items-end">
          {[
            { href: "/music", label: "Music" },
            { href: "/photos", label: "Photos" },
            { href: "/favorites", label: "Inspiration" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[9px] tracking-[0.35em] uppercase text-[#333330] hover:text-[#c9a84c] transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-[#0c0c0c] pt-6">
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#222220]">
          Music · Design · Photography
        </p>
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#222220]">
          &copy; {new Date().getFullYear()} Sunatra
        </p>
      </div>
    </footer>
  );
}
