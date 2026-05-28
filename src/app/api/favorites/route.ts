import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { FavPlatform } from "@/generated/prisma";

export async function GET() {
  const [tracks, palettes] = await Promise.all([
    prisma.favoriteTrack.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    prisma.colorPalette.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
  ]);
  return NextResponse.json({ tracks, palettes });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, ...body } = await req.json();

  if (type === "palette") {
    const palette = await prisma.colorPalette.create({
      data: {
        name: body.name,
        colors: body.colors,
        notes: body.notes,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(palette, { status: 201 });
  }

  const track = await prisma.favoriteTrack.create({
    data: {
      title: body.title,
      artist: body.artist,
      platform: (body.platform as FavPlatform) ?? "spotify",
      embedUrl: body.embedUrl,
      externalUrl: body.externalUrl,
      notes: body.notes,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(track, { status: 201 });
}
