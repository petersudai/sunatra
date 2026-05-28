"use client";

import { useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import type { IFavoriteTrack, IColorPalette, IColorSwatch } from "@/types";

const trackEmpty = { title: "", artist: "", platform: "spotify" as IFavoriteTrack["platform"], embedUrl: "", externalUrl: "", notes: "" };
const paletteEmpty = { name: "", notes: "", colors: [{ hex: "#c9a84c", name: "" }] };

export function FavoritesManager({
  initialTracks,
  initialPalettes,
}: {
  initialTracks: IFavoriteTrack[];
  initialPalettes: IColorPalette[];
}) {
  const [tracks, setTracks] = useState(initialTracks);
  const [palettes, setPalettes] = useState(initialPalettes);
  const [trackForm, setTrackForm] = useState(trackEmpty);
  const [paletteForm, setPaletteForm] = useState(paletteEmpty);
  const [loading, setLoading] = useState(false);

  const addTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trackForm),
    });
    const track = await res.json();
    setTracks((prev) => [track, ...prev]);
    setTrackForm(trackEmpty);
    setLoading(false);
  };

  const removeTrack = async (id: string) => {
    await fetch(`/api/favorites/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "track" }),
    });
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  const addPalette = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "palette", ...paletteForm }),
    });
    const palette = await res.json();
    setPalettes((prev) => [palette, ...prev]);
    setPaletteForm(paletteEmpty);
    setLoading(false);
  };

  const removePalette = async (id: string) => {
    await fetch(`/api/favorites/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "palette" }),
    });
    setPalettes((prev) => prev.filter((p) => p.id !== id));
  };

  const addSwatch = () =>
    setPaletteForm((f) => ({ ...f, colors: [...f.colors, { hex: "#ffffff", name: "" }] }));

  const removeSwatch = (i: number) =>
    setPaletteForm((f) => ({ ...f, colors: f.colors.filter((_, idx) => idx !== i) }));

  const updateSwatch = (i: number, key: keyof IColorSwatch, val: string) =>
    setPaletteForm((f) => ({
      ...f,
      colors: f.colors.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)),
    }));

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      {/* Left: tracks */}
      <div className="space-y-6">
        <form onSubmit={addTrack} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-lg text-[#f5f0e8]">Add favourite track</h2>
          <Field label="Title">
            <input value={trackForm.title} onChange={(e) => setTrackForm((f) => ({ ...f, title: e.target.value }))} required className={cls} />
          </Field>
          <Field label="Artist">
            <input value={trackForm.artist} onChange={(e) => setTrackForm((f) => ({ ...f, artist: e.target.value }))} required className={cls} />
          </Field>
          <Field label="Platform">
            <select value={trackForm.platform} onChange={(e) => setTrackForm((f) => ({ ...f, platform: e.target.value as IFavoriteTrack["platform"] }))} className={cls}>
              <option value="spotify">Spotify</option>
              <option value="soundcloud">SoundCloud</option>
              <option value="youtube">YouTube</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Embed URL (optional)">
            <input value={trackForm.embedUrl} onChange={(e) => setTrackForm((f) => ({ ...f, embedUrl: e.target.value }))} className={cls} />
          </Field>
          <Field label="Notes (optional)">
            <input value={trackForm.notes} onChange={(e) => setTrackForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Why you love it…" className={cls} />
          </Field>
          <button type="submit" disabled={loading} className={btnCls}>
            <Plus size={14} /> Add
          </button>
        </form>

        <div className="space-y-2">
          {tracks.map((t) => (
            <div key={t.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-[#f5f0e8] truncate">{t.title}</p>
                <p className="text-xs text-[#888880]">{t.artist} · {t.platform}</p>
              </div>
              <button onClick={() => removeTrack(t.id)} className="text-[#888880] hover:text-red-400 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right: palettes */}
      <div className="space-y-6">
        <form onSubmit={addPalette} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-lg text-[#f5f0e8]">Add colour palette</h2>
          <Field label="Palette name">
            <input value={paletteForm.name} onChange={(e) => setPaletteForm((f) => ({ ...f, name: e.target.value }))} required className={cls} />
          </Field>
          <Field label="Notes (optional)">
            <input value={paletteForm.notes} onChange={(e) => setPaletteForm((f) => ({ ...f, notes: e.target.value }))} className={cls} />
          </Field>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#888880] mb-2">Swatches</label>
            <div className="space-y-2">
              {paletteForm.colors.map((swatch, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={swatch.hex}
                    onChange={(e) => updateSwatch(i, "hex", e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    value={swatch.hex}
                    onChange={(e) => updateSwatch(i, "hex", e.target.value)}
                    placeholder="#000000"
                    className={cls + " w-28"}
                  />
                  <input
                    value={swatch.name ?? ""}
                    onChange={(e) => updateSwatch(i, "name", e.target.value)}
                    placeholder="Name (optional)"
                    className={cls + " flex-1"}
                  />
                  {paletteForm.colors.length > 1 && (
                    <button type="button" onClick={() => removeSwatch(i)} className="text-[#888880] hover:text-red-400">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addSwatch} className="mt-2 text-xs text-[#888880] hover:text-[#c9a84c] transition-colors flex items-center gap-1">
              <Plus size={12} /> Add swatch
            </button>
          </div>
          <button type="submit" disabled={loading} className={btnCls}>
            <Plus size={14} /> Add palette
          </button>
        </form>

        <div className="space-y-3">
          {palettes.map((p) => (
            <div key={p.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-serif text-[#f5f0e8]">{p.name}</p>
                <button onClick={() => removePalette(p.id)} className="text-[#888880] hover:text-red-400 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {p.colors.map((s, i) => (
                  <div key={i} className="w-8 h-8 rounded" style={{ background: s.hex }} title={s.name ?? s.hex} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-[#888880] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const cls = "w-full bg-[#111111] border border-[#2a2a2a] rounded-sm px-3 py-2 text-sm text-[#f5f0e8] focus:outline-none focus:border-[#c9a84c]/50 transition-colors";
const btnCls = "py-2.5 px-6 bg-[#c9a84c] text-[#0a0a0a] text-sm tracking-wider uppercase font-medium hover:bg-[#e2c278] disabled:opacity-50 transition-colors rounded-sm flex items-center gap-2";
