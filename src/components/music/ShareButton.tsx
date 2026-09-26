"use client";

import { useState } from "react";
import { trackUrl } from "@/lib/tags";

export function ShareButton({
  id,
  title,
  variant = "pill",
}: {
  id: string;
  title: string;
  variant?: "pill" | "icon";
}) {
  const [copied, setCopied] = useState(false);

  const share = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = trackUrl(id);
    // Native share sheet on phones, so it can go straight to IG
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user dismissed the sheet, or share failed: fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const icon = (
    <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13V3M6 6.5L10 3l4 3.5M4 11v5h12v-5" />
    </svg>
  );

  if (variant === "icon") {
    return (
      <button
        onClick={share}
        aria-label={copied ? "Link copied" : "Share track"}
        title={copied ? "Link copied" : "Share"}
        className={["shrink-0 transition-colors", copied ? "text-[#c9a84c]" : "text-[#444440] hover:text-[#c9a84c]"].join(" ")}
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-2 px-4 py-2 border border-[#c9a84c]/30 text-[#c9a84c] text-[9px] tracking-[0.35em] uppercase hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/60 transition-all duration-200"
    >
      {icon}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
