"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/music", label: "Music" },
  { href: "/photos", label: "Photos" },
  { href: "/favorites", label: "Faves" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav
        className={cn(
          "mx-auto px-8 md:px-14 h-14 flex items-center justify-between transition-all duration-500 border-b",
          scrolled
            ? "bg-[#080808]/85 backdrop-blur-md border-[#141412]"
            : "bg-transparent border-transparent"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-[13px] tracking-[0.3em] uppercase text-[#f0ebe0]/50 hover:text-[#c9a84c] transition-colors duration-300"
        >
          Sunatra
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "text-[10px] tracking-[0.3em] uppercase transition-colors duration-300",
                  pathname === l.href || pathname.startsWith(l.href + "/")
                    ? "text-[#c9a84c]"
                    : "text-[#555550] hover:text-[#f0ebe0]"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#555550] hover:text-[#f0ebe0] transition-colors text-[10px] tracking-[0.3em] uppercase"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#080808] px-6 pb-8 pt-4 border-b border-[#1a1a1a]">
          <ul className="flex flex-col gap-6">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "block font-serif text-2xl font-light transition-colors",
                    pathname === l.href ? "text-[#c9a84c]" : "text-[#f0ebe0] hover:text-[#c9a84c]"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
