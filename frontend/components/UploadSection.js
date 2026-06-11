"use client";
import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

/* ─── Icons ─── */
const UploadCloudIcon = () => (
  <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const CheckIcon = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XIcon = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/>
  </svg>
);
const ActivityIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const LockIcon = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

/**
 * UploadSection — reusable drag-and-drop MRI upload widget.
 *
 * Props:
 *   onAnalyze(file, preview) — async callback triggered after backend analysis
 *   compact    — smaller layout (for dashboard sidebar)
 *   className  — additional CSS classes
 */
export default function UploadSection({ onAnalyze, compact = false, className = "" }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = (f) => {
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(f.type)) {
      toast.error("Please upload a JPG or PNG file."); return;
    }
    setFile(f);
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result);
    r.readAsDataURL(f);
  };

  const reset = (e) => {
    e?.stopPropagation();
    setFile(null); setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const analyze = useCallback(async (e) => {
    e?.stopPropagation();
    if (!file || !preview || isAnalyzing) return;
    setIsAnalyzing(true); setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + Math.random() * 14;
      });
    }, 280);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/analyze`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      clearInterval(interval); setProgress(100);
      await onAnalyze?.(data, preview, file);
    } catch (err) {
      clearInterval(interval); setIsAnalyzing(false); setProgress(0);
      toast.error(err.message || "Cannot reach backend.");
    }
  }, [file, preview, isAnalyzing, onAnalyze]);

  const padding = compact ? "20px 18px" : "36px 28px";

  return (
    <div className={className}>
      <div
        className={`drop-zone${dragging ? " drag" : ""}`}
        style={{ padding: preview ? "18px 20px" : padding, cursor: preview ? "default" : "pointer" }}
        onClick={() => !preview && !isAnalyzing && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        role="button"
        aria-label="Upload MRI scan"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && !preview && inputRef.current?.click()}
      >
        {isAnalyzing ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative", width: 60, height: 60 }}>
              <img src={preview} alt="" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", opacity: 0.45 }}/>
              <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "var(--blue)", animation: "spin 0.85s linear infinite" }}/>
            </div>
            <div style={{ width: "100%", maxWidth: 240 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "var(--t2)", fontWeight: 600 }}>Analyzing scan…</span>
                <span style={{ fontSize: 12, color: "var(--blue-2)", fontWeight: 700 }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 4, background: "var(--glass-b)", borderRadius: 10, overflow: "hidden" }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.3 }}
                  style={{ height: "100%", background: "linear-gradient(to right, var(--blue), var(--violet))", borderRadius: 10 }}
                />
              </div>
            </div>
          </div>
        ) : preview ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img src={preview} alt="preview" style={{ width: compact ? 56 : 72, height: compact ? 56 : 72, borderRadius: 12, objectFit: "cover", border: "2px solid var(--blue)", display: "block" }}/>
              <div style={{ position: "absolute", bottom: -5, right: -5, width: 20, height: 20, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg)", color: "#fff" }}>
                <CheckIcon/>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--t1)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file?.name}</p>
              <p style={{ fontSize: 11, color: "var(--t3)", marginBottom: 10 }}>{file ? `${(file.size / 1024).toFixed(0)} KB · Ready` : ""}</p>
              <div style={{ display: "flex", gap: 7 }}>
                <button className="btn btn-ghost btn-sm" onClick={reset} style={{ fontSize: 12 }}><XIcon/> Remove</button>
                <button className="btn btn-primary btn-sm" onClick={analyze} style={{ fontSize: 12, padding: "6px 16px" }}>
                  <ActivityIcon/> Analyze
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: compact ? 10 : 14, textAlign: "center" }}>
            <div style={{ width: compact ? 48 : 58, height: compact ? 48 : 58, borderRadius: 16, background: "var(--blue-dim)", color: "var(--blue-2)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(59,130,246,0.2)" }}>
              <UploadCloudIcon/>
            </div>
            <div>
              <p style={{ fontSize: compact ? 14 : 15, fontWeight: 700, color: "var(--t1)", marginBottom: 4 }}>
                {dragging ? "Drop your MRI scan here ✓" : "Drag & drop your MRI scan"}
              </p>
              <p style={{ fontSize: 12, color: "var(--t3)" }}>JPG · JPEG · PNG</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}>
              Browse Files
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--t4)" }}>
              <LockIcon/>
              <span>Images processed locally</span>
            </div>
          </div>
        )}
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])}/>
      </div>
    </div>
  );
}
