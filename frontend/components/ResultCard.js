"use client";
import { motion } from "framer-motion";
import Link from "next/link";

/* ─── Icons ─── */
const EyeIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const CheckSmIcon = () => (
  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const BrainIcon = () => (
  <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, color: "var(--blue)" }}>
    {/* Neural Network Nodes */}
    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
    <circle cx="15" cy="9" r="1.5" fill="currentColor" />
    <circle cx="6" cy="13" r="1.5" fill="currentColor" />
    <circle cx="18" cy="13" r="1.5" fill="currentColor" />
    <circle cx="9" cy="17" r="1.5" fill="currentColor" />
    <circle cx="15" cy="17" r="1.5" fill="currentColor" />
    
    {/* Connections */}
    <path d="M9 9h6M9 9l-3 4 3 4h6l3-4-3-4M6 13h12" opacity="0.75" />
    <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="2 2" opacity="0.6" />
    
    {/* Scanner target corners */}
    <path d="M4 8V4h4" />
    <path d="M16 4h4v4" />
    <path d="M4 16v4h4" />
    <path d="M16 20h4v-4" />
  </svg>
);

const CLS_META = {
  glioma:     { label: "Glioma",      color: "#ef4444", badge: "badge-red" },
  meningioma: { label: "Meningioma",  color: "#fb923c", badge: "badge-orange" },
  notumor:    { label: "No Tumor",    color: "#34d399", badge: "badge-green" },
  no_tumor:   { label: "No Tumor",    color: "#34d399", badge: "badge-green" },
  pituitary:  { label: "Pituitary",   color: "#a78bfa", badge: "badge-violet" },
};

/**
 * ResultCard — compact summary card for a single analysis result.
 * Props: result, preview, filename, onClick, className
 */
export default function ResultCard({ result, preview, filename, onClick, delay = 0 }) {
  if (!result) return null;
  const cls = CLS_META[result.prediction] || CLS_META.notumor;
  const conf = ((result.confidence || 0) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16,1,0.3,1], delay }}
      className="glass-card glass-card-hover"
      style={{ overflow: "hidden", cursor: "pointer" }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick?.()}
    >
      {/* MRI thumbnail */}
      <div style={{ position: "relative", height: 160, background: "#050510", overflow: "hidden" }}>
        {preview ? (
          <img
            src={preview}
            alt="MRI scan"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BrainIcon />
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,16,0.9) 0%, transparent 60%)" }}/>
        {/* Badge */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span className={`badge ${cls.badge}`} style={{ fontSize: 11 }}>{cls.label}</span>
        </div>
        {/* Confidence pill */}
        <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: cls.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckSmIcon/>
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", fontFamily: "Outfit, sans-serif" }}>{conf}%</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>confidence</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--t1)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {filename || "scan.jpg"}
        </p>
        {/* Confidence bar */}
        <div style={{ height: 4, background: "var(--glass-b)", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${conf}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: delay + 0.3 }}
            style={{ height: "100%", background: cls.color, borderRadius: 10 }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "var(--t3)", fontWeight: 600 }}>
            {result.tumor_area_pct != null ? `Area: ${result.tumor_area_pct.toFixed(2)}%` : "EfficientNet-B0"}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: "4px 10px", fontSize: 11, gap: 4 }}
            onClick={e => { e.stopPropagation(); onClick?.(); }}
          >
            <EyeIcon/> View
          </button>
        </div>
      </div>
    </motion.div>
  );
}
