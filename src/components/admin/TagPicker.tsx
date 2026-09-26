"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { PRESET_TAGS, cleanTags } from "@/lib/tags";

export function TagPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const has = (t: string) => value.some((v) => v.toLowerCase() === t.toLowerCase());
  const toggle = (t: string) =>
    onChange(has(t) ? value.filter((v) => v.toLowerCase() !== t.toLowerCase()) : cleanTags([...value, t]));

  const commitDraft = () => {
    if (draft.trim()) onChange(cleanTags([...value, draft]));
    setDraft("");
  };

  // Custom tags = anything selected that is not one of the presets
  const custom = value.filter((v) => !PRESET_TAGS.some((p) => p.toLowerCase() === v.toLowerCase()));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {PRESET_TAGS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => toggle(t)}
            aria-pressed={has(t)}
            className={[
              "px-2.5 py-1 text-[10px] tracking-wider uppercase border rounded-sm transition-colors",
              has(t)
                ? "border-[#c9a84c]/60 text-[#c9a84c] bg-[#c9a84c]/10"
                : "border-[#2a2a2a] text-[#888880] hover:border-[#444]",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
        {custom.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] tracking-wider uppercase border border-[#c9a84c]/60 text-[#c9a84c] bg-[#c9a84c]/10 rounded-sm"
          >
            {t}
            <button type="button" onClick={() => toggle(t)} aria-label={`Remove ${t}`}>
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commitDraft();
          }
        }}
        onBlur={commitDraft}
        placeholder="Add your own tag, press Enter"
        className="w-full bg-[#111111] border border-[#2a2a2a] rounded-sm px-3 py-2 text-sm text-[#f5f0e8] focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
      />
    </div>
  );
}
