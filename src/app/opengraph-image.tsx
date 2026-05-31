import { ImageResponse } from "next/og";

export const runtime     = "edge";
export const alt         = "Sunatra — Sound, image and code from Kajiado";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const waveHeights = [28,52,38,72,45,88,33,65,50,80,42,70,58,40,85,35,62,78,48,90,30,68,44,76,55,38,82,47];

  return new ImageResponse(
    <div
      style={{
        background: "#080808",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "72px 80px 80px",
        fontFamily: "Georgia, 'Times New Roman', serif",
        position: "relative",
      }}
    >
      {/* Subtle right-side gradient */}
      <div style={{
        position: "absolute",
        right: 0, top: 0, bottom: 0,
        width: "40%",
        background: "linear-gradient(to left, rgba(201,168,76,0.04), transparent)",
      }} />

      {/* Waveform decoration — top right */}
      <div style={{
        position: "absolute",
        top: 56,
        right: 80,
        display: "flex",
        alignItems: "flex-end",
        gap: 3,
        height: 60,
        opacity: 0.25,
      }}>
        {waveHeights.map((h, i) => (
          <div key={i} style={{
            width: 4,
            height: `${h}%`,
            background: "#c9a84c",
            borderRadius: 2,
          }} />
        ))}
      </div>

      {/* Gold line */}
      <div style={{ width: 48, height: 1, background: "#c9a84c", marginBottom: 36 }} />

      {/* Name */}
      <div style={{
        fontSize: 116,
        fontWeight: 300,
        color: "#f0ebe0",
        letterSpacing: "-0.025em",
        lineHeight: 0.88,
        marginBottom: 36,
      }}>
        SUNATRA
      </div>

      {/* Location tag */}
      <div style={{
        fontSize: 12,
        letterSpacing: "0.42em",
        textTransform: "uppercase",
        color: "#555550",
      }}>
        KAJIADO · KENYA
      </div>
    </div>,
    { ...size }
  );
}
