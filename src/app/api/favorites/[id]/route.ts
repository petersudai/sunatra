import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { type, ...data } = await req.json();

  if (type === "palette") {
    const palette = await prisma.colorPalette.update({ where: { id }, data });
    return NextResponse.json(palette);
  } else {
    const track = await prisma.favoriteTrack.update({ where: { id }, data });
    return NextResponse.json(track);
  }
}

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
