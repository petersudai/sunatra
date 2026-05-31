import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// No auth required — guests trigger this by playing a track.
// Uses an atomic increment so concurrent plays don't race.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.track.update({
      where: { id },
      data: { playCount: { increment: 1 } },
    });
    return NextResponse.json({ ok: true });
  } catch {
    // Silently fail — never interrupt playback over a stat
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
