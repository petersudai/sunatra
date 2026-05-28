"use client";

import { useState } from "react";
import { Trash2, Star, StarOff, Plus } from "lucide-react";
import type { ITrack } from "@/types";

type TrackType = "exclusive" | "released" | "mix";
type Platform = "spotify" | "soundcloud" | "mixcloud";

const emptyForm = {
  title: "",
  artist: "Sunatra",
  type: "exclusive" as TrackType,
  platform: "" as Platform | "",
  embedUrl: "",
  description: "",
  featured: false,
};

export function MusicManager({ initialTracks }: { initialTracks: ITrack[] }) {
  const [tracks, setTracks] = useState(initialTracks);
  const [form, setForm] = useState(emptyForm);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file: File, folder: string) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Upload failed. Check BLOB_READ_WRITE_TOKEN in Vercel.");
    return data.url as string;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const body: Record<string, unknown> = { ...form };

      if (form.type === "exclusive") {
        if (!audioFile) throw new Error("Please select an audio file.");
        body.audioUrl = await uploadFile(audioFile, "audio");
      }
      if (coverFile) {
        body.coverUrl = await uploadFile(coverFile, "covers");
      }

      const res = await fetch("/api/tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save track.");
      const track = await res.json();
      setTracks((prev) => [track, ...prev]);
      setForm(emptyForm);
      setAudioFile(null);
      setCoverFile(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/tracks/${id}`, { method: "DELETE" });
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleFeatured = async (track: ITrack) => {
    const res = await fetch(`/api/tracks/${track.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !track.featured }),
    });
    const updated = await res.json();
    setTracks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      {/* Form */}
      <form onSubmit={submit} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 space-y-4">
        <h2 className="font-serif text-lg text-[#f5f0e8] mb-2">Add track</h2>

        <Field label="Title">
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            className={inputCls}
          />
        </Field>

        <Field label="Artist">
          <input
            value={form.artist}
            onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
            className={inputCls}
          />
        </Field>

        <Field label="Type">
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as TrackType, platform: "" }))}
            className={inputCls}
          >
            <option value="exclusive">Exclusive (upload)</option>
            <option value="released">Released (embed)</option>
            <option value="mix">Mix (Mixcloud)</option>
          </select>
        </Field>

        {form.type === "exclusive" ? (
          <Field label="Audio file (MP3/WAV)">
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
              className={inputCls}
            />
          </Field>
        ) : (
          <>
            <Field label="Platform">
              <select
                value={form.platform}
                onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value as Platform }))}
                className={inputCls}
              >
                <option value="">Select…</option>
                <option value="spotify">Spotify</option>
                <option value="soundcloud">SoundCloud</option>
                <option value="mixcloud">Mixcloud</option>
              </select>
            </Field>
            <Field label="Embed URL">
              <input
                value={form.embedUrl}
                onChange={(e) => setForm((f) => ({ ...f, embedUrl: e.target.value }))}
                placeholder="https://open.spotify.com/embed/track/..."
                className={inputCls}
              />
            </Field>
          </>
        )}

        <Field label="Cover image (optional)">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
            className={inputCls}
          />
        </Field>

        <Field label="Description (optional)">
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className={inputCls + " resize-none"}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-[#888880] cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            className="accent-[#c9a84c]"
          />
          Feature on homepage
        </label>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#c9a84c] text-[#0a0a0a] text-sm tracking-wider uppercase font-medium hover:bg-[#e2c278] disabled:opacity-50 transition-colors rounded-sm flex items-center justify-center gap-2"
        >
          <Plus size={14} />
          {loading ? "Saving…" : "Add track"}
        </button>
      </form>

      {/* Track list */}
      <div className="space-y-3">
        <h2 className="font-serif text-lg text-[#f5f0e8]">All tracks ({tracks.length})</h2>
        {tracks.length === 0 && <p className="text-[#888880] text-sm">No tracks yet.</p>}
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-sm text-[#f5f0e8] truncate">{track.title}</p>
              <p className="text-xs text-[#888880]">
                {track.type} {track.platform ? `· ${track.platform}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleFeatured(track)}
                className="text-[#888880] hover:text-[#c9a84c] transition-colors"
                title={track.featured ? "Unfeature" : "Feature"}
              >
                {track.featured ? <Star size={16} className="text-[#c9a84c]" /> : <StarOff size={16} />}
              </button>
              <button
                onClick={() => remove(track.id)}
                className="text-[#888880] hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
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

const inputCls =
  "w-full bg-[#111111] border border-[#2a2a2a] rounded-sm px-3 py-2.5 text-sm text-[#f5f0e8] focus:outline-none focus:border-[#c9a84c]/50 transition-colors file:mr-3 file:bg-[#2a2a2a] file:text-[#888880] file:border-0 file:rounded-sm file:px-2 file:py-1 file:text-xs";
