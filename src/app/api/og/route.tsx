import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") || "Tattoos Lab";
  const subtitle = searchParams.get("subtitle") || "AI Tattoo Generator";
  const icon = searchParams.get("icon") || "✨";
  const accent = searchParams.get("accent") || "orange";

  const accentColors: Record<string, { from: string; to: string; glow: string }> = {
    orange: { from: "#FF8C00", to: "#FFA01F", glow: "rgba(255,140,0,0.4)" },
    blue: { from: "#2563eb", to: "#06b6d4", glow: "rgba(37,99,235,0.4)" },
    green: { from: "#16a34a", to: "#84cc16", glow: "rgba(22,163,74,0.4)" },
    pink: { from: "#db2777", to: "#f472b6", glow: "rgba(219,39,119,0.4)" },
  };

  const color = accentColors[accent] || accentColors.orange;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "630",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f23 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: color.glow,
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.02)",
            filter: "blur(80px)",
          }}
        />

        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: "0",
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "10",
            gap: "24px",
            padding: "60px",
          }}
        >
          {/* Icon */}
          <div
            style={{
              fontSize: "80px",
              lineHeight: "1",
              marginBottom: "8px",
            }}
          >
            {icon}
          </div>

          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
              }}
            />
            <span
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Tattoos Lab
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "800",
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.1",
              margin: "0",
              maxWidth: "900px",
              textWrap: "balance",
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              margin: "0",
              maxWidth: "700px",
              lineHeight: "1.4",
            }}
          >
            {subtitle}
          </p>

          {/* Decorative line */}
          <div
            style={{
              width: "120px",
              height: "4px",
              borderRadius: "2px",
              background: `linear-gradient(90deg, ${color.from}, ${color.to})`,
              marginTop: "16px",
            }}
          />
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.05em",
            }}
          >
            tattooslab.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
