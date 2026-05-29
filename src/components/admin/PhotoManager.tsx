"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { Trash2, Star, StarOff, Plus, Pencil, X, Check } from "lucide-react";
import Image from "next/image";
import type { IPhoto } from "@/types";

type Mode = "add" | "edit";

export function PhotoManager({ initialPhotos }: { initialPhotos: IPhoto[] }) {
  const [photos, setPhotos] = useState(initialPhotos);

  /* ── Add form ── */
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);

  /* ── Edit state ── */
  const [mode, setMode] = useState<Mode>("add");
  const [editingPhoto, setEditingPhoto] = useState<IPhoto | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editFile, setEditFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ─────────────── helpers ─────────────── */
  const uploadFile = async (f: File, folder: string): Promise<string> => {
    const ext = f.name.split(".").pop() ?? "bin";
    const pathname = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const blob = await upload(pathname, f, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    return blob.url;
  };

  const getDimensions = (f: File): Promise<{ width: number; height: number }> =>
    new Promise((resolve) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(f);
      img.onload = () => resolve({ width: img.naturalWidth || 1200, height: img.naturalHeight || 800 });
    });

  /* ─────────────── add ─────────────── */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const url = await uploadFile(file, "photos");
      const { width, height } = await getDimensions(file);

      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, caption, category, featured, width, height }),
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

  /* ─────────────── edit ─────────────── */
  const startEdit = (photo: IPhoto) => {
    setEditingPhoto(photo);
    setEditCaption(photo.caption ?? "");
    setEditCategory(photo.category ?? "");
    setEditFeatured(photo.featured);
    setEditFile(null);
    setError("");
    setMode("edit");
    // Scroll to top of the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setMode("add");
    setEditingPhoto(null);
    setError("");
  };

  const saveEdit = async () => {
    if (!editingPhoto) return;
    setLoading(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        caption: editCaption,
        category: editCategory,
        featured: editFeatured,
      };
      if (editFile) {
        body.url = await uploadFile(editFile, "photos");
        const { width, height } = await getDimensions(editFile);
        body.width = width;
        body.height = height;
      }
      const res = await fetch(`/api/photos/${editingPhoto.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save.");
      const updated = await res.json();
      setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      cancelEdit();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────── other actions ─────────────── */
  const remove = async (id: string) => {
    await fetch(`/api/photos/${id}`, { method: "DELETE" });
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (editingPhoto?.id === id) cancelEdit();
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

  /* ─────────────── render ─────────────── */
  return (
    <div className="space-y-8">

      {/* ── Form: add or edit ── */}
      {mode === "add" ? (
        <form onSubmit={submit} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-lg text-[#f5f0e8] mb-2">Upload photo</h2>

          <div>
            <label className="block text-xs tracking-wider uppercase text-[#888880] mb-1.5">Image</label>
            <input type="file" accept="image/*" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} className={inputCls} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[#888880] mb-1.5">Caption</label>
              <input value={caption} onChange={(e) => setCaption(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[#888880] mb-1.5">Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Street, Portrait" className={inputCls} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#888880] cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-[#c9a84c]" />
            Feature on homepage
          </label>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit" disabled={loading} className="py-2.5 px-6 bg-[#c9a84c] text-[#0a0a0a] text-sm tracking-wider uppercase font-medium hover:bg-[#e2c278] disabled:opacity-50 transition-colors rounded-sm flex items-center gap-2">
            <Plus size={14} />
            {loading ? "Uploading…" : "Upload"}
          </button>
        </form>
      ) : (
        /* ── Edit form ── */
        <div className="bg-[#1a1a1a] border border-[#c9a84c]/30 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-serif text-lg text-[#f5f0e8]">Edit photo</h2>
            <button onClick={cancelEdit} className="text-[#888880] hover:text-[#f0ebe0] transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Current image thumbnail */}
          {editingPhoto && (
            <div className="relative w-full h-40 rounded overflow-hidden bg-[#111]">
              <Image src={editingPhoto.url} alt={editingPhoto.caption ?? ""} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-3 text-[10px] text-[#888880] tracking-wider">Current image</span>
            </div>
          )}

          <div>
            <label className="block text-xs tracking-wider uppercase text-[#888880] mb-1.5">Replace image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files?.[0] ?? null)} className={inputCls} />
            {editFile && (
              <p className="text-[10px] text-[#c9a84c] mt-1">New image selected — will replace current on save.</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[#888880] mb-1.5">Caption</label>
              <input value={editCaption} onChange={(e) => setEditCaption(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[#888880] mb-1.5">Category</label>
              <input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} placeholder="e.g. Street, Portrait" className={inputCls} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#888880] cursor-pointer">
            <input type="checkbox" checked={editFeatured} onChange={(e) => setEditFeatured(e.target.checked)} className="accent-[#c9a84c]" />
            Feature on homepage
          </label>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button onClick={saveEdit} disabled={loading} className="flex items-center gap-1.5 px-5 py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-sm tracking-wider uppercase font-medium hover:bg-[#e2c278] disabled:opacity-50 transition-colors rounded-sm">
              <Check size={13} />
              {loading ? "Saving…" : "Save changes"}
            </button>
            <button onClick={cancelEdit} className="flex items-center gap-1.5 px-5 py-2.5 border border-[#2a2a2a] text-[#888880] text-sm tracking-wider uppercase hover:border-[#444] hover:text-[#f0ebe0] transition-colors rounded-sm">
              <X size={13} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Photo grid ── */}
      <div>
        <h2 className="font-serif text-lg text-[#f5f0e8] mb-4">All photos ({photos.length})</h2>
        {photos.length === 0 && <p className="text-[#888880] text-sm">No photos yet.</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={[
                "relative group rounded-lg overflow-hidden bg-[#1a1a1a] aspect-square",
                editingPhoto?.id === photo.id ? "ring-1 ring-[#c9a84c]/50" : "",
              ].join(" ")}
            >
              <Image src={photo.url} alt={photo.caption ?? ""} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => startEdit(photo)} className="text-white hover:text-[#c9a84c] transition-colors" title="Edit">
                  <Pencil size={16} />
                </button>
                <button onClick={() => toggleFeatured(photo)} className="text-white hover:text-[#c9a84c] transition-colors">
                  {photo.featured ? <Star size={18} className="text-[#c9a84c]" /> : <StarOff size={18} />}
                </button>
                <button onClick={() => remove(photo.id)} className="text-white hover:text-red-400 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
              {photo.featured && (
                <span className="absolute top-2 right-2 bg-[#c9a84c] text-[#0a0a0a] text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                  Featured
                </span>
              )}
              {photo.caption && (
                <span className="absolute bottom-0 inset-x-0 px-2 py-1 text-[10px] text-[#888880] truncate bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.caption}
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
