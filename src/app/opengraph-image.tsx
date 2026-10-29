import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Silverkammen – Barbershop i Söderköping";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Samma märke som favicon.
  const mark = await readFile(join(process.cwd(), "src/app/icon.svg"), "utf8");
  const markSrc = `data:image/svg+xml;base64,${Buffer.from(mark).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf9f6",
          color: "#1d1b19",
        }}
      >
        <img src={markSrc} width={200} height={200} alt="" />
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, marginTop: 24 }}>
          Silver Kammen
        </div>
        <div
          style={{
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#94744a",
            marginTop: 16,
          }}
        >
          Barbershop · Söderköping
        </div>
        <div style={{ fontSize: 28, color: "#6b645c", marginTop: 36 }}>
          Ringvägen 44 · Boka tid online
        </div>
      </div>
    ),
    size,
  );
}
