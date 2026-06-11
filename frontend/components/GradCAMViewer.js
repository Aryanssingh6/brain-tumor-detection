"use client";

/*
  GradCAMViewer — legacy component, retained for compatibility.
  The main ResultCard now uses inline ImageCard components directly.

  Props:
    preview        — data-URL of original MRI
    heatmapBase64  — raw base64 PNG string
    accentColor    — hex color for the active class
*/
export default function GradCAMViewer({ preview, heatmapBase64, accentColor = "#0ea5e9" }) {
  const imgSrc = heatmapBase64 ? `data:image/png;base64,${heatmapBase64}` : null;

  const panelStyle = {
    background: "#050507",
    border: "1px solid var(--border)",
    borderRadius: 10, overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: 180, position: "relative",
  };

  return (
    <div style={{ borderTop: "1px solid var(--border)", padding: "16px 20px" }}>
      <p className="label-xs" style={{ marginBottom: 12 }}>Visual Explainability — Grad-CAM</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

        {/* Original MRI */}
        <div>
          <p className="label-xs" style={{ marginBottom: 8 }}>Original MRI</p>
          <div style={panelStyle}>
            {preview
              ? <img src={preview} alt="Original MRI" style={{ maxWidth: "100%", maxHeight: 220, objectFit: "contain", display: "block" }} />
              : <span style={{ fontSize: 12, color: "var(--text-faint)" }}>No preview</span>
            }
          </div>
        </div>

        {/* Grad-CAM */}
        <div>
          <p className="label-xs" style={{ marginBottom: 8 }}>Grad-CAM Heatmap</p>
          <div style={{ ...panelStyle, borderColor: `${accentColor}30` }}>
            {imgSrc
              ? <img src={imgSrc} alt="Grad-CAM heatmap" style={{ maxWidth: "100%", maxHeight: 220, objectFit: "contain", display: "block" }} />
              : <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Generating…</span>
            }
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 60, height: 4, borderRadius: 100,
            background: "linear-gradient(90deg, #00f, #0ff, #0f0, #ff0, #f00)",
          }} />
          <span style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.04em" }}>
            LOW → HIGH ACTIVATION
          </span>
        </div>
      </div>
    </div>
  );
}
