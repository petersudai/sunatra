import { prisma } from "@/lib/prisma";
import { PhotoManager } from "@/components/admin/PhotoManager";
import type { IPhoto } from "@/types";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const photos = await prisma.photo.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
    return photos as IPhoto[];
  } catch { return []; }
}

export default async function AdminPhotosPage() {
  const photos = await getData();
  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-[#f5f0e8] mb-2">Photos</h1>
      <p className="text-sm text-[#888880] mb-10">Upload and manage your photography.</p>
      <PhotoManager initialPhotos={photos} />
    </div>
  );
}
