import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({ type: "track" }));

  if (body.type === "palette") {
    await prisma.colorPalette.delete({ where: { id } });
  } else {
    await prisma.favoriteTrack.delete({ where: { id } });
  }

  return NextResponse.json({ ok: true });
}
