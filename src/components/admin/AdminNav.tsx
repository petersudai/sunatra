"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Music, Camera, Heart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/music", label: "Music", icon: Music },
  { href: "/admin/photos", label: "Photos", icon: Camera },
  { href: "/admin/favorites", label: "Favorites", icon: Heart },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 flex-1">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              active
                ? "bg-[#c9a84c]/10 text-[#c9a84c]"
                : "text-[#888880] hover:text-[#f5f0e8] hover:bg-[#1a1a1a]"
            )}
          >
            <l.icon size={16} />
            {l.label}
          </Link>
        );
      })}

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#888880] hover:text-red-400 hover:bg-[#1a1a1a] transition-colors mt-auto"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </nav>
  );
}
