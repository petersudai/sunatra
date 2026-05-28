"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { IPhoto } from "@/types";

interface Props {
  photos: IPhoto[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}

export function Lightbox({ photos, index, onClose, onChange }: Props) {
  const photo = photos[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onChange(Math.max(0, index - 1));
      if (e.key === "ArrowRight") onChange(Math.min(photos.length - 1, index + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, photos.length, onClose, onChange]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-[#888880] hover:text-[#f5f0e8] transition-colors"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      {index > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888880] hover:text-[#f5f0e8] transition-colors"
          onClick={(e) => { e.stopPropagation(); onChange(index - 1); }}
        >
          <ChevronLeft size={32} />
        </button>
      )}

      <div
        className="relative max-w-5xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.url}
          alt={photo.caption ?? ""}
          width={photo.width}
          height={photo.height}
          className="object-contain max-h-[85vh] w-auto mx-auto rounded-lg"
          priority
        />
        {photo.caption && (
          <p className="text-center text-sm text-[#888880] mt-3">{photo.caption}</p>
        )}
      </div>

      {index < photos.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888880] hover:text-[#f5f0e8] transition-colors"
          onClick={(e) => { e.stopPropagation(); onChange(index + 1); }}
        >
          <ChevronRight size={32} />
        </button>
      )}

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-[#888880]">
        {index + 1} / {photos.length}
      </p>
    </div>
  );
}
