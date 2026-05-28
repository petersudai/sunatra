import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#0f0f0f] px-8 md:px-14 pt-14 pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">

        {/* Left — statement (placeholder, populate later) */}
        <div>
          <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a84c]">Sunatra</p>
        </div>

        {/* Right — nav */}
        <nav className="flex flex-col gap-3 items-start md:items-end">
          {[
            { href: "/music", label: "Music" },
            { href: "/photos", label: "Photos" },
            { href: "/favorites", label: "Faves" },
            { href: "/about", label: "About" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[9px] tracking-[0.35em] uppercase text-[#777770] hover:text-[#c9a84c] transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-[#0c0c0c] pt-6">
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#222220]">
          Sound · Image · Build · Whatever comes next
        </p>
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#222220]">
          &copy; {new Date().getFullYear()} Sunatra
        </p>
      </div>
    </footer>
  );
}
