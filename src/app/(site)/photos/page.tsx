import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PhotoGrid } from "@/components/photos/PhotoGrid";
import type { IPhoto } from "@/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Photos" };

async function getData() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return photos as IPhoto[];
  } catch {
    return [];
  }
}

export default async function PhotosPage() {
  const photos = await getData();
  return (
    <div className="max-w-6xl mx-auto px-8 md:px-14 pt-28 pb-24">
      <div className="mb-14">
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#444440] mb-5">Photography</p>
        <h1
          className="font-serif font-light text-[#f0ebe0] italic leading-[0.88] mb-4"
          style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
        >
          The Image
        </h1>
        <p className="font-serif italic text-[#555550] text-base md:text-lg">
          Nairobi and beyond. Coast, city, and the quiet in between.
        </p>
        <div className="h-px bg-[#111] mt-8" />
      </div>
      <PhotoGrid photos={photos} />
    </div>
  );
}
