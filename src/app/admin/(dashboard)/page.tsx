import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Music, Camera, Heart, Palette } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCounts() {
  const [tracks, photos, favTracks, palettes] = await Promise.all([
    prisma.track.count(),
    prisma.photo.count(),
    prisma.favoriteTrack.count(),
    prisma.colorPalette.count(),
  ]);
  return { tracks, photos, favTracks, palettes };
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const stats = [
    { label: "Tracks", value: counts.tracks, icon: Music, href: "/admin/music" },
    { label: "Photos", value: counts.photos, icon: Camera, href: "/admin/photos" },
    { label: "Fav Tracks", value: counts.favTracks, icon: Heart, href: "/admin/favorites" },
    { label: "Palettes", value: counts.palettes, icon: Palette, href: "/admin/favorites" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#f5f0e8] mb-2">Dashboard</h1>
      <p className="text-sm text-[#888880] mb-10">Welcome back, Sunatra.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#c9a84c]/30 transition-colors group"
          >
            <s.icon size={20} className="text-[#c9a84c] mb-4" />
            <p className="text-3xl font-serif text-[#f5f0e8] mb-1">{s.value}</p>
            <p className="text-xs tracking-wider uppercase text-[#888880]">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-4">
        {[
          { href: "/admin/music", label: "Manage Music", desc: "Upload tracks, add embeds, manage your discography" },
          { href: "/admin/photos", label: "Manage Photos", desc: "Upload and organise your photography work" },
          { href: "/admin/favorites", label: "Manage Favorites", desc: "Update favourite tracks and colour palettes" },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#c9a84c]/30 transition-colors"
          >
            <h3 className="font-serif text-lg text-[#f5f0e8] mb-2">{card.label}</h3>
            <p className="text-sm text-[#888880]">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
