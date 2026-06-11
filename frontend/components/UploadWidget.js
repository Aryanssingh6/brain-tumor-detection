"use client";
import { useRef, useState } from "react";

const UploadCloudIcon = () => (
  <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const XIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/>
  </svg>
);
const CheckIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ActivityIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

/**
 * Reusable drag-and-drop upload widget.
 * Props:
 *   onAnalyze(file, preview) — called when user clicks the submit button
 *   ctaLabel — button label (default "Start AI Scan")
 *   isLoading — show progress state
 *   progress — 0-100
 */
export default function UploadWidget({ onAnalyze, ctaLabel = "Start AI Scan", isLoading = false, progress = 0 }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(f.type)) {
      alert("Please upload a JPG or PNG file."); return;
    }
    setFile(f);
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result);
    r.readAsDataURL(f);
  };

  const reset = (e) => {
    e?.stopPropagation();
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleAnalyze = (e) => {
    e?.stopPropagation();
    if (file && onAnalyze) onAnalyze(file, preview);
  };

  return (
    <div
      className={`drop-zone${dragging ? " drag" : ""}`}
      style={{ padding: preview ? "28px 32px" : "52px 40px", display: "flex", flexDirection: "column", alignItems: "center", transition: "all 0.22s" }}
      onClick={() => !preview && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
    >
      {isLoading ? (
        /* Progress state */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <img src={preview} alt="uploading" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", opacity: 0.6 }} />
            <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "3px solid var(--blue-dim)", borderTopColor: "var(--blue)", animation: "spin 1s linear infinite" }} />
          </div>
          <div style={{ width: "100%", maxWidth: 260 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--t2)", fontWeight: 600 }}>Analyzing…</span>
              <span style={{ fontSize: 13, color: "var(--blue-2)", fontWeight: 700 }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 4, background: "var(--glass-b)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(to right, var(--blue), var(--violet))", transition: "width 0.3s linear", borderRadius: 10 }} />
            </div>
          </div>
        </div>
      ) : preview ? (
        /* Preview state */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 120, height: 120, borderRadius: 16, overflow: "hidden", border: "2px solid var(--blue)", boxShadow: "0 0 20px var(--blue-glow)" }}>
              <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", bottom: -8, right: -8, width: 28, height: 28, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", border: "2px solid var(--bg)" }}>
              <CheckIcon />
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--t1)", marginBottom: 4 }}>{file?.name}</p>
            <p style={{ fontSize: 12, color: "var(--t3)", fontWeight: 500 }}>
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""} • Ready for analysis
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button className="btn btn-ghost btn-sm" onClick={reset}>
              <XIcon /> Remove
            </button>
            <button className="btn btn-primary" style={{ padding: "10px 24px", fontSize: 14 }} onClick={handleAnalyze}>
              <ActivityIcon /> {ctaLabel}
            </button>
          </div>
        </div>
      ) : (
        /* Empty state */
        <>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: "var(--blue-dim)", color: "var(--blue-2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20, transition: "transform 0.3s",
          }}>
            <UploadCloudIcon />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--t1)", marginBottom: 8 }}>
            {dragging ? "Drop your MRI here" : "Drag & drop MRI scan"}
          </h3>
          <p style={{ fontSize: 13, color: "var(--t3)", marginBottom: 20 }}>
            Supports high-resolution <strong style={{ color: "var(--t2)" }}>JPG</strong>, <strong style={{ color: "var(--t2)" }}>JPEG</strong>, <strong style={{ color: "var(--t2)" }}>PNG</strong>
          </p>
          <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
            Browse Files
          </button>
          <p style={{ marginTop: 16, fontSize: 11, color: "var(--t4)", fontWeight: 500, textAlign: "center" }}>
            🔒 Images are processed locally and never stored permanently
          </p>
        </>
      )}

      <input
        ref={inputRef} type="file" accept=".jpg,.jpeg,.png"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}
