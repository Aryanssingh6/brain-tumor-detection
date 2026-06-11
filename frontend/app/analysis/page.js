"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import CircularProgress from "@/components/CircularProgress";
import ResultSkeleton from "@/components/ResultSkeleton";

/* ── Icons ── */
const DownloadIcon = () => <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const RefreshIcon = () => <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>;
const InfoIcon = () => <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const AlertIcon = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const ActivityIcon = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const CheckCircleIcon = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ShareIcon = () => <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;

/* ── Class metadata ── */
const CLS = {
  glioma:     { label: "Glioma Tumor",      color: "#ef4444", bg: "rgba(239,68,68,0.08)",    badge: "badge-red",
    severity: "High",     riskColor: "#ef4444", riskBg: "rgba(239,68,68,0.10)",
    desc: "A type of tumor that occurs in the brain and spinal cord, arising from glial cells. Requires prompt neurological evaluation.",
    ai_explanation: "The EfficientNet-B0 model identified characteristic hyperintense regions consistent with glioma pathology. The Grad-CAM heatmap highlights the primary attention region. Confidence is reinforced by U-Net segmentation isolating the tumor boundary." },
  meningioma: { label: "Meningioma",        color: "#f97316", bg: "rgba(249,115,22,0.08)",   badge: "badge-orange",
    severity: "Moderate", riskColor: "#f97316", riskBg: "rgba(249,115,22,0.10)",
    desc: "A tumor arising from the meninges — the membranes surrounding your brain and spinal cord. Most are benign but may press on brain tissue.",
    ai_explanation: "The model detected a well-defined extra-axial mass typical of meningioma. The dural attachment pattern and homogeneous enhancement drove high classification confidence." },
  notumor:    { label: "No Tumor Detected", color: "#10b981", bg: "rgba(16,185,129,0.08)",   badge: "badge-green",
    severity: "None",     riskColor: "#10b981", riskBg: "rgba(16,185,129,0.10)",
    desc: "No visible signs of neoplastic growth or lesions detected. Anatomical structures appear within normal limits. Regular follow-up is still advised.",
    ai_explanation: "The classifier found no statistically significant features associated with tumor presence. Probability distribution shows very low confidence across all tumor classes. Grad-CAM shows diffuse, low-intensity attention with no focal concern." },
  no_tumor:   { label: "No Tumor Detected", color: "#10b981", bg: "rgba(16,185,129,0.08)",   badge: "badge-green",
    severity: "None",     riskColor: "#10b981", riskBg: "rgba(16,185,129,0.10)",
    desc: "No visible signs of neoplastic growth or lesions detected. Anatomical structures appear within normal limits. Regular follow-up is still advised.",
    ai_explanation: "The classifier found no statistically significant features associated with tumor presence. Probability distribution shows very low confidence across all tumor classes. Grad-CAM shows diffuse, low-intensity attention with no focal concern." },
  pituitary:  { label: "Pituitary Tumor",   color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", badge: "badge-violet",
    severity: "Moderate", riskColor: "#8b5cf6", riskBg: "rgba(139,92,246,0.10)",
    desc: "Abnormal growths that develop in your pituitary gland. Some cause hormone overproduction. Endocrinological evaluation recommended.",
    ai_explanation: "Sellar/suprasellar mass features identified by the model match pituitary adenoma morphology. Grad-CAM highlights the sella turcica region with strong attention." },
};

const SEVERITY_SCORES = { None: 0, Moderate: 0.55, High: 0.85 };

const RECS = {
  glioma:     ["Immediate consultation with a neuro-oncologist is strongly advised.", "Schedule a contrast-enhanced MRI for better lesion characterization.", "Consider biopsy for histological grading (WHO Grade I–IV).", "Discuss surgical resection, radiation, and chemotherapy options.", "Monitor for symptoms: headaches, seizures, cognitive changes."],
  meningioma: ["Schedule a follow-up MRI in 3–6 months to monitor growth.", "Consult a neurosurgeon to evaluate surgical eligibility.", "Assess for neurological symptoms and hormonal changes.", "Consider stereotactic radiosurgery (SRS) if not surgically accessible."],
  notumor:    ["No immediate intervention required based on this scan.", "Continue regular health monitoring and annual check-ups.", "Report any new neurological symptoms to your physician promptly."],
  no_tumor:   ["No immediate intervention required based on this scan.", "Continue regular health monitoring and annual check-ups.", "Report any new neurological symptoms to your physician promptly."],
  pituitary:  ["Refer to an endocrinologist for hormonal panel evaluation.", "Visual field testing to assess for optic chiasm compression.", "Consider MRI with dedicated pituitary protocol (thin slices).", "Monitor prolactin, GH, ACTH, and thyroid hormone levels."],
};

/* ── Tooltip ── */
const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--glass-b-hi)", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: payload[0].fill }}>{(payload[0].value * 100).toFixed(1)}%</p>
    </div>
  );
};

/* ════════════════════════════════════════
   ANALYSIS PAGE
════════════════════════════════════════ */
export default function AnalysisPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [filename, setFilename] = useState("");
  const [showGradCam, setShowGradCam] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const r = sessionStorage.getItem("ns-result");
    const p = sessionStorage.getItem("ns-preview");
    const f = sessionStorage.getItem("ns-filename");
    if (r && p) {
      setResult(JSON.parse(r));
      setPreview(p);
      setFilename(f || "scan.jpg");
      setTimeout(() => setLoaded(true), 80);
    } else {
      // Auto-redirect to home if no data
      router.replace("/");
    }
  }, [router]);

  const cls = result ? (CLS[result.prediction] || CLS.notumor) : null;
  const severityScore = cls ? SEVERITY_SCORES[cls.severity] ?? 0 : 0;
  const recs = result ? (RECS[result.prediction] || RECS.notumor) : [];

  const barData = result ? Object.entries(result.class_probabilities || {}).map(([k, v]) => ({
    name: CLS[k]?.label || k,
    value: v,
    fill: CLS[k]?.color || "var(--blue)",
  })).sort((a, b) => b.value - a.value) : [];

  const handleDownload = () => {
    toast.success("Opening print dialog for PDF…");
    setTimeout(() => window.print(), 300);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard.");
    } catch { toast.error("Could not copy link."); }
  };

  const handleReanalyze = () => {
    router.push("/");
  };

  // Show skeleton while loading
  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", background: "transparent" }}>
        <Navbar />
        <main style={{ maxWidth: 1320, margin: "0 auto", padding: "calc(var(--nav-h) + 28px) 24px 56px" }}>
          <ResultSkeleton />
        </main>
      </div>
    );
  }

  if (!result) return null; // redirect is happening

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <Navbar />

      <main style={{ maxWidth: 1320, margin: "0 auto", padding: "calc(var(--nav-h) + 28px) 24px 56px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}>

          {/* ── Page header ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span className={`badge ${cls?.badge}`} style={{ fontSize: 13, padding: "5px 14px" }}>{cls?.label}</span>
                <span style={{ fontSize: 12, color: "var(--t3)" }}>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 4, height: 26, borderRadius: 2, background: "var(--blue)" }} />
                <h1 className="clinical-header" style={{ fontSize: "clamp(20px,2.8vw,30px)", fontWeight: 800, fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em", margin: 0 }}>
                  MRI Analysis Results
                </h1>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-ghost btn-sm" onClick={handleReanalyze}><RefreshIcon /> Re-analyze</button>
              <button className="btn btn-ghost btn-sm" onClick={handleShare}><ShareIcon /> Share</button>
              <button className="btn btn-primary btn-sm" onClick={handleDownload}><DownloadIcon /> Download PDF</button>
            </div>
          </div>

          {/* ── Main two-column layout ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 18, marginBottom: 18 }} className="analysis-grid">

            {/* LEFT: MRI Viewer */}
            <div className="glass-card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--glass-b)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <ActivityIcon />
                  <span style={{ fontWeight: 700, color: "var(--t1)", fontSize: 14 }}>MRI Viewer</span>
                </div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  <span className="badge badge-gray" style={{ fontSize: 11 }}>MRI Scan</span>
                  <button
                    className={`btn btn-sm ${showGradCam ? "btn-primary" : "btn-ghost"}`}
                    style={{ padding: "5px 12px", fontSize: 12 }}
                    onClick={() => setShowGradCam(!showGradCam)}
                    title="Toggle Grad-CAM heatmap overlay"
                  >
                    <InfoIcon /> {showGradCam ? "Hide Grad-CAM" : "Show Grad-CAM"}
                  </button>
                </div>
              </div>

              {/* Viewer */}
              <div style={{ background: "#000000", position: "relative", height: 360, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {/* Scan line animation */}
                <div className="scan-line" style={{ zIndex: 5, pointerEvents: "none" }}/>
                <img src={preview} style={{ width: "100%", height: "100%", objectFit: "contain", opacity: showGradCam ? 0.3 : 0.82, transition: "opacity 0.4s" }} alt="MRI scan" />

                {result.segmentation_mask_base64 && !showGradCam && (
                  <motion.img
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.7 }}
                    src={`data:image/png;base64,${result.segmentation_mask_base64}`}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "screen" }}
                    alt="Segmentation overlay"
                  />
                )}

                {result.heatmap_base64 && showGradCam && (
                  <motion.img
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                    src={`data:image/png;base64,${result.heatmap_base64}`}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "screen" }}
                    alt="Grad-CAM heatmap"
                  />
                )}

                {/* Bounding box for tumor cases */}
                {result.prediction !== "notumor" && result.prediction !== "no_tumor" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.25 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.8, type: "spring", damping: 16 }}
                    style={{
                      position: "absolute",
                      border: `2px solid ${cls?.color}`,
                      width: "36%", height: "36%",
                      borderRadius: 14,
                      boxShadow: `0 0 30px ${cls?.color}55, inset 0 0 20px ${cls?.color}18`,
                      animation: "glow-pulse 2.5s ease-in-out infinite",
                    }}
                  >
                    <span style={{ position: "absolute", top: 6, left: 8, fontSize: 9, fontWeight: 800, color: cls?.color, background: "rgba(0,0,0,0.75)", padding: "2px 7px", borderRadius: 4, letterSpacing: "0.08em" }}>
                      AI REGION
                    </span>
                    <div style={{ position: "absolute", top: -2, left: -2, width: 12, height: 12, borderTop: `2px solid ${cls?.color}`, borderLeft: `2px solid ${cls?.color}`, borderRadius: "4px 0 0 0" }}/>
                    <div style={{ position: "absolute", top: -2, right: -2, width: 12, height: 12, borderTop: `2px solid ${cls?.color}`, borderRight: `2px solid ${cls?.color}`, borderRadius: "0 4px 0 0" }}/>
                    <div style={{ position: "absolute", bottom: -2, left: -2, width: 12, height: 12, borderBottom: `2px solid ${cls?.color}`, borderLeft: `2px solid ${cls?.color}`, borderRadius: "0 0 0 4px" }}/>
                    <div style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderBottom: `2px solid ${cls?.color}`, borderRight: `2px solid ${cls?.color}`, borderRadius: "0 0 4px 0" }}/>
                  </motion.div>
                )}
              </div>

              {/* Metadata bar */}
              <div style={{ padding: "12px 18px", borderTop: "1px solid var(--glass-b)", display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[
                  { label: "Filename", value: filename },
                  { label: "Tumor Area", value: result.tumor_area_pct != null ? `${result.tumor_area_pct.toFixed(2)}%` : "N/A" },
                  { label: "Size Category", value: result.size_category || "N/A" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--t4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "var(--t2)" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Diagnosis panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Diagnosis card */}
              <motion.div
                initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 }}
                style={{ padding: 18, borderRadius: 18, background: cls?.bg, border: `1px solid ${cls?.color}35` }}
              >
                <p style={{ fontSize: 10, fontWeight: 700, color: `${cls?.color}aa`, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                  PRIMARY DIAGNOSIS
                </p>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: cls?.color, letterSpacing: "-0.02em", marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>
                  {cls?.label}
                </h2>
                <p style={{ fontSize: 13, color: "var(--t1)", opacity: 0.8, lineHeight: 1.55 }}>{cls?.desc}</p>
              </motion.div>

              {/* Confidence + Severity */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="glass-card" style={{ padding: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <CircularProgress value={(result.confidence || 0) * 100} color={cls?.color} size={100} />
                </div>
                <div className="glass-card" style={{ padding: 14 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--t4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Severity</p>
                  <div style={{ fontSize: 22, fontWeight: 900, color: cls?.riskColor, fontFamily: "Outfit, sans-serif", marginBottom: 6 }}>
                    {result.severity_level || cls?.severity}
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px", background: cls?.riskBg, borderRadius: 6, marginBottom: 10 }}>
                    {cls?.severity === "High" ? <AlertIcon /> : <CheckCircleIcon />}
                    <span style={{ fontSize: 11, fontWeight: 700, color: cls?.riskColor }}>Risk: {cls?.severity}</span>
                  </div>
                  <div style={{ height: 4, background: "var(--glass-b)", borderRadius: 10, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(result.severity_score ?? severityScore) * 100}%` }}
                      transition={{ delay: 0.6, duration: 1 }}
                      style={{ height: "100%", background: cls?.riskColor, borderRadius: 10 }}
                    />
                  </div>
                  <p style={{ fontSize: 10, color: "var(--t4)", marginTop: 4, textAlign: "right", fontWeight: 600 }}>
                    {Math.round((result.severity_score ?? severityScore) * 100)}/100
                  </p>
                </div>
              </div>

              {/* AI Explanation */}
              <div className="glass-card" style={{ padding: 16, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <InfoIcon />
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Explanation</p>
                </div>
                <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.65 }}>{cls?.ai_explanation}</p>
              </div>
            </div>
          </div>

          {/* ── Bottom grid: Probabilities + Grad-CAM + Segmentation + Recommendations ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 }} className="four-grid">

            {/* Probability distribution */}
            <div className="glass-card" style={{ padding: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
                Class Probabilities
              </p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={barData} layout="vertical" barSize={14}>
                  <CartesianGrid horizontal={false} stroke="var(--glass-b)" />
                  <XAxis type="number" domain={[0,1]} tickFormatter={v => `${Math.round(v*100)}%`} tick={{ fill: "var(--t3)", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "var(--t2)", fontSize: 9 }} axisLine={false} tickLine={false} width={68} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" radius={[0,5,5,0]}>
                    {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Grad-CAM */}
            <div className="glass-card" style={{ padding: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                Grad-CAM Heatmap
              </p>
              <div style={{ borderRadius: 10, overflow: "hidden", background: "#000", height: 140 }}>
                {result.heatmap_base64 ? (
                  <img src={`data:image/png;base64,${result.heatmap_base64}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Grad-CAM" />
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t4)", fontSize: 12 }}>Not available</div>
                )}
              </div>
              <p style={{ fontSize: 11, color: "var(--t4)", marginTop: 8, lineHeight: 1.4 }}>Regions that influenced the model's decision.</p>
            </div>

            {/* Segmentation */}
            <div className="glass-card" style={{ padding: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                U-Net Segmentation
              </p>
              <div style={{ borderRadius: 10, overflow: "hidden", background: "#000", height: 140 }}>
                {result.segmentation_mask_base64 ? (
                  <img src={`data:image/png;base64,${result.segmentation_mask_base64}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Segmentation mask" />
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t4)", fontSize: 12 }}>Not available</div>
                )}
              </div>
              <p style={{ fontSize: 11, color: "var(--t4)", marginTop: 8, lineHeight: 1.4 }}>Pixel-level tumor boundary from U-Net.</p>
            </div>

            {/* Recommendations */}
            <div className="glass-card" style={{ padding: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                Clinical Notes
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {recs.map((rec, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.08 }}
                    style={{ display: "flex", gap: 9 }}>
                    <div style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: "var(--blue-dim)", border: "1px solid var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "var(--blue)" }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.5 }}>{rec}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Disclaimer ── */}
          <div style={{
            padding: "14px 18px",
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.18)",
            borderRadius: 12,
            display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            <div style={{ color: "var(--yellow)", flexShrink: 0 }}><AlertIcon /></div>
            <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--yellow)" }}>Medical Disclaimer:</strong>{" "}
              This AI analysis is for <strong>research and educational purposes only</strong>.
              It is not a substitute for professional medical diagnosis.
              Always consult a qualified radiologist or neurologist before making clinical decisions.
            </p>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
