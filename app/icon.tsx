import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#e06a0e",
          borderRadius: "7px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "14px",
          fontWeight: "700",
          fontFamily: "sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        LN
      </div>
    ),
    { ...size }
  );
}
