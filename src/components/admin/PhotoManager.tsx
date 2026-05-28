"use client";

import { useState } from "react";
import { Trash2, Star, StarOff, Plus } from "lucide-react";
import Image from "next/image";
import type { IPhoto } from "@/types";

export function PhotoManager({ initialPhotos }: { initialPhotos: IPhoto[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "photos");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const { url } = await uploadRes.json();

      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      await new Promise((res) => (img.onload = res));

      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          caption,
          category,
          featured,
          width: img.naturalWidth || 1200,
          height: img.naturalHeight || 800,
        }),
      });
      if (!res.ok) throw new Error("Failed to save photo.");
      const photo = await res.json();
      setPhotos((prev) => [photo, ...prev]);
      setFile(null);
      setCaption("");
      setCategory("");
      setFeatured(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/photos/${id}`, { method: "DELETE" });
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleFeatured = async (photo: IPhoto) => {
    const res = await fetch(`/api/photos/${photo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !photo.featured }),
    });
    const updated = await res.json();
    setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <div className="space-y-8">
      {/* Upload form */}
      <form onSubmit={submit} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 space-y-4">
        <h2 className="font-serif text-lg text-[#f5f0e8] mb-2">Upload photo</h2>

        <div>
          <label className="block text-xs tracking-wider uppercase text-[#888880] mb-1.5">Image</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className={inputCls}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#888880] mb-1.5">Caption</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#888880] mb-1.5">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Street, Portrait"
              className={inputCls}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-[#888880] cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="accent-[#c9a84c]"
          />
          Feature on homepage
        </label>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="py-2.5 px-6 bg-[#c9a84c] text-[#0a0a0a] text-sm tracking-wider uppercase font-medium hover:bg-[#e2c278] disabled:opacity-50 transition-colors rounded-sm flex items-center gap-2"
        >
          <Plus size={14} />
          {loading ? "Uploading…" : "Upload"}
        </button>
      </form>

      {/* Grid */}
      <div>
        <h2 className="font-serif text-lg text-[#f5f0e8] mb-4">All photos ({photos.length})</h2>
        {photos.length === 0 && <p className="text-[#888880] text-sm">No photos yet.</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-[#1a1a1a] aspect-square">
              <Image src={photo.url} alt={photo.caption ?? ""} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => toggleFeatured(photo)}
                  className="text-white hover:text-[#c9a84c] transition-colors"
                >
                  {photo.featured ? <Star size={18} className="text-[#c9a84c]" /> : <StarOff size={18} />}
                </button>
                <button
                  onClick={() => remove(photo.id)}
                  className="text-white hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {photo.featured && (
                <span className="absolute top-2 right-2 bg-[#c9a84c] text-[#0a0a0a] text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                  Featured
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-[#111111] border border-[#2a2a2a] rounded-sm px-3 py-2.5 text-sm text-[#f5f0e8] focus:outline-none focus:border-[#c9a84c]/50 transition-colors file:mr-3 file:bg-[#2a2a2a] file:text-[#888880] file:border-0 file:rounded-sm file:px-2 file:py-1 file:text-xs";
