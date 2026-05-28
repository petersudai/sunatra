import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { TrackType, Platform } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as TrackType | null;
  const featured = searchParams.get("featured");

  const tracks = await prisma.track.findMany({
    where: {
      ...(type && { type }),
      ...(featured === "true" && { featured: true }),
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(tracks);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const track = await prisma.track.create({
      data: {
        title: body.title,
        artist: body.artist ?? "Sunatra",
        type: body.type as TrackType,
        // Coerce empty string → null so the enum column stays nullable
        platform: (body.platform || null) as Platform | null,
        audioUrl: body.audioUrl || null,
        embedUrl: body.embedUrl || null,
        coverUrl: body.coverUrl || null,
        duration: body.duration ?? null,
        description: body.description || null,
        featured: body.featured ?? false,
        releaseDate: body.releaseDate ? new Date(body.releaseDate) : null,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(track, { status: 201 });
  } catch (err) {
    console.error("Track create error:", err);
    return NextResponse.json({ error: "Failed to create track." }, { status: 500 });
  }
}
