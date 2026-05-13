export const EXPORT_CARD_WIDTH = 1080;
export const EXPORT_CARD_HEIGHT = 1920;

function percentToPx(value, size) {
  const numericValue = Number.parseFloat(String(value));

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return (numericValue / 100) * size;
}

function positionToPixels(position) {
  return {
    top: `${percentToPx(position.top, EXPORT_CARD_HEIGHT)}px`,
    left: `${percentToPx(position.left, EXPORT_CARD_WIDTH)}px`,
  };
}

import { forwardRef } from "react";

const ExportCard = forwardRef(function ExportCard({ template, userName, profileImage }, ref) {
  const profilePosition = positionToPixels(template.profilePosition);
  const textPosition = positionToPixels(template.textPosition);

  return (
    <div
      ref={ref}
      style={{
        width: `${EXPORT_CARD_WIDTH}px`,
        height: `${EXPORT_CARD_HEIGHT}px`,
        position: "relative",
        overflow: "hidden",
        borderRadius: "48px",
        background: "#f8fafc",
      }}
    >
      <img
        src={template.image}
        alt={template.title}
        crossOrigin="anonymous"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.08), transparent)",
        }}
      />

      <div
        style={{
          position: "absolute",
          ...profilePosition,
          transform: "translate(-50%, -50%)",
          zIndex: 20,
          borderRadius: "9999px",
          padding: "10px",
          border: "6px solid rgba(255, 255, 255, 0.95)",
          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.24)",
          backdropFilter: "none",
        }}
      >
        <div
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "9999px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #fcd34d, #fb923c, #f43f5e)",
          }}
        >
          <img
            src={profileImage}
            alt="User profile"
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          ...textPosition,
          transform: "translate(-50%, -50%)",
          zIndex: 20,
          maxWidth: "760px",
        }}
      >
        <div
          style={{
            borderRadius: "36px",
            border: "1px solid rgba(255, 255, 255, 0.24)",
            background: "rgba(255, 255, 255, 0.14)",
            backdropFilter: "none",
            padding: "28px 32px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.75)",
            }}
          >
            Live Preview
          </p>
          <h2
            style={{
              margin: "18px 0 0",
              fontSize: "72px",
              lineHeight: 1,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "var(--font-heading), ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {userName || "Your Name"}
          </h2>
          <p
            style={{
              margin: "18px 0 0",
              fontSize: "28px",
              lineHeight: 1.5,
              color: "rgba(255, 255, 255, 0.78)",
            }}
          >
            {template.title} card with fixed export coordinates.
          </p>
        </div>
      </div>
    </div>
  );
});

export default ExportCard;