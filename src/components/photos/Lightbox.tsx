"use client";

import { useEffect, useRef } from "react";
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
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchMoved  = useRef(false);

  /* Lock body scroll while open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   onChange(Math.max(0, index - 1));
      if (e.key === "ArrowRight")  onChange(Math.min(photos.length - 1, index + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, onClose, onChange]);

  /* Touch swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMoved.current  = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Suppress vertical scroll hijacking while horizontally swiping
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      e.preventDefault();
      touchMoved.current = true;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      touchMoved.current = true;
      if (dx < 0) onChange(Math.min(photos.length - 1, index + 1)); // swipe left  → next
      if (dx > 0) onChange(Math.max(0, index - 1));                  // swipe right → prev
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/96 flex flex-col items-center justify-center"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-[#555550] hover:text-[#f0ebe0] transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={22} />
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center text-[#444440] hover:text-[#f0ebe0] transition-colors"
          onClick={(e) => { e.stopPropagation(); onChange(index - 1); }}
          aria-label="Previous"
        >
          <ChevronLeft size={30} />
        </button>
      )}

      {/* Image */}
      <div
        className="relative flex items-center justify-center w-full h-full px-14 md:px-20 py-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.url}
          alt={photo.caption ?? ""}
          width={photo.width}
          height={photo.height}
          className="object-contain max-h-[80vh] max-w-full w-auto h-auto"
          priority
          draggable={false}
        />
      </div>

      {/* Caption + counter */}
      <div className="absolute bottom-0 inset-x-0 flex items-end justify-between px-5 pb-5 pointer-events-none">
        <p className="text-xs text-[#444440] font-serif italic max-w-xs truncate">
          {photo.caption ?? ""}
        </p>
        <p className="text-[10px] tracking-[0.3em] text-[#333330] tabular-nums">
          {index + 1} / {photos.length}
        </p>
      </div>

      {/* Swipe hint — mobile only, fades after first use */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 md:hidden pointer-events-none">
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#2a2a2a]">swipe to navigate</p>
      </div>

      {/* Next */}
      {index < photos.length - 1 && (
        <button
          className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center text-[#444440] hover:text-[#f0ebe0] transition-colors"
          onClick={(e) => { e.stopPropagation(); onChange(index + 1); }}
          aria-label="Next"
        >
          <ChevronRight size={30} />
        </button>
      )}
    </div>
  );
}
