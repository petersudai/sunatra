import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");

  const photos = await prisma.photo.findMany({
    where: { ...(featured === "true" && { featured: true }) },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const photo = await prisma.photo.create({
    data: {
      url: body.url,
      caption: body.caption,
      category: body.category,
      featured: body.featured ?? false,
      width: body.width ?? 1200,
      height: body.height ?? 800,
      order: body.order ?? 0,
    },
  });

  return NextResponse.json(photo, { status: 201 });
}
