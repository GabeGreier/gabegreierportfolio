import { noStore } from "next/cache";
import { ImageResponse } from "next/og";
import { getPublicVisuals } from "@/lib/content";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/png";

export default async function Icon() {
  noStore();

  const visuals = await getPublicVisuals();
  const randomVisual = visuals[Math.floor(Math.random() * visuals.length)];
  const visualUrl = randomVisual?.thumbnail_url ?? randomVisual?.image_url ?? null;

  if (!visualUrl) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            fontWeight: 700,
            color: "#111111",
            background: "#ffffff"
          }}
        >
          GG
        </div>
      ),
      size
    );
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <img
          src={visualUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      </div>
    ),
    size
  );
}
