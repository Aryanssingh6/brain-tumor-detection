"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Animation helper ─── */
const FadeUp = ({ children, delay = 0, style = {}, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -60px 0px" }}
    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
    style={style}
    className={className}
  >
    {children}
  </motion.div>
);

const FadeLeft = ({ children, delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, x: -32 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "0px 0px -40px 0px" }}
    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
    style={style}
  >
    {children}
  </motion.div>
);

const FadeRight = ({ children, delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, x: 32 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "0px 0px -40px 0px" }}
    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
    style={style}
  >
    {children}
  </motion.div>
);

/* ─── Icons ─── */
const ArrowRightIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1={5} y1={12} x2={19} y2={12}/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const UploadCloudIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const CheckIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ActivityIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const XIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/>
  </svg>
);
const BrainIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
const ShieldIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ZapIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const EyeIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const FileIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);
const LockIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const DeltaIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 20h18L12 4z" />
  </svg>
);
const FlameIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
const TargetIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const TelescopeIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 3-5 5" /><path d="m10.7 13.3-3.8 3.8L3 17l.8-3.9 3.8-3.8" />
    <path d="M16 8.5 8.5 16" /><path d="M22 6.5 6.5 22" /><path d="m14 2 8 8" />
  </svg>
);
const MicroscopeIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18h8" />
    <path d="M3 22h18" />
    <path d="M14 22a7 7 0 1 0-14 0" />
    <path d="M9 14h2" />
    <path d="M12 9V3h3" />
    <path d="M12 5h3" />
    <path d="m14 11 4 4" />
  </svg>
);

/* ─── Data ─── */
const STEPS = [
  { num: "01", icon: <UploadCloudIcon size={22}/>, color: "var(--blue)", bg: "var(--blue-dim)", title: "Upload MRI Scan", desc: "Drag & drop or browse your brain MRI. JPG and PNG formats supported. Processed locally." },
  { num: "02", icon: <BrainIcon/>, color: "var(--violet)", bg: "var(--violet-dim)", title: "AI Analysis", desc: "EfficientNet-B0 classifies tumor type while U-Net segments the lesion boundary in under 1s." },
  { num: "03", icon: <EyeIcon/>, color: "var(--cyan)", bg: "var(--cyan-dim)", title: "Explainable Results", desc: "Grad-CAM heatmaps highlight which regions the model focused on for its classification decision." },
  { num: "04", icon: <FileIcon/>, color: "var(--green)", bg: "var(--green-dim)", title: "Download Report", desc: "Export a detailed PDF with all findings, probabilities, and clinical recommendations." },
];

const TECH_STACK = [
  { name: "Next.js 15", icon: <DeltaIcon />, desc: "App Router, SSR, React Server Components.", color: "#ffffff" },
  { name: "PyTorch", icon: <FlameIcon />, desc: "Powers EfficientNet-B0 and U-Net training.", color: "#EE4C2C" },
  { name: "FastAPI", icon: <ZapIcon />, desc: "Async Python backend with auto OpenAPI docs.", color: "#009688" },
  { name: "Framer Motion", icon: <TargetIcon />, desc: "Accessible animations with reduced-motion.", color: "#e879f9" },
  { name: "Grad-CAM", icon: <TelescopeIcon />, desc: "Explainability via gradient-weighted activation.", color: "#60a5fa" },
  { name: "OpenCV", icon: <MicroscopeIcon />, desc: "Image preprocessing and segmentation overlay.", color: "#5C3EE8" },
];

const STATS = [
  { value: "4-class", label: "Tumor Types", sub: "Glioma · Meningioma · Pituitary · None" },
  { value: "97.3%", label: "Test Accuracy", sub: "EfficientNet-B0 on held-out split" },
  { value: "< 1s", label: "Inference Time", sub: "On standard GPU hardware" },
  { value: "Open", label: "Source Code", sub: "Reproducible & peer-reviewable" },
];

const FEATURES = [
  { icon: <ZapIcon/>, color: "var(--blue)", bg: "var(--blue-dim)", title: "Instant Analysis", desc: "Sub-second inference powered by optimized deep learning on GPU." },
  { icon: <EyeIcon/>, color: "var(--violet)", bg: "var(--violet-dim)", title: "Visual Explainability", desc: "Grad-CAM heatmaps show exactly why the model made its prediction." },
  { icon: <ShieldIcon/>, color: "var(--green)", bg: "var(--green-dim)", title: "Privacy First", desc: "All processing is local. No images are stored or sent to third parties." },
];

/* ─── Inline Upload Widget ─── */
function HeroUpload() {
  const router = useRouter();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);

  const STEPS_TEXT = ["Loading model…", "Running EfficientNet…", "Applying Grad-CAM…", "Generating report…"];

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

  const handleAnalyze = useCallback(async (e) => {
    e?.stopPropagation();
    if (!file || !preview) return;
    setIsAnalyzing(true); setProgress(0); setAnalysisStep(0);

    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 14;
        if (next >= 90) { clearInterval(interval); return 90; }
        setAnalysisStep(Math.min(3, Math.floor(next / 25)));
        return next;
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

      sessionStorage.setItem("ns-result", JSON.stringify(data));
      sessionStorage.setItem("ns-preview", preview);
      sessionStorage.setItem("ns-filename", file.name);

      const entry = {
        id: Date.now(), name: file.name,
        date: new Date().toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        prediction: data.prediction, confidence: data.confidence, status: "completed", preview,
      };
      const stored = JSON.parse(localStorage.getItem("ns-history") || "[]");
      localStorage.setItem("ns-history", JSON.stringify([entry, ...stored].slice(0, 20)));

      toast.success("Analysis complete!");
      setTimeout(() => router.push("/analysis"), 400);
    } catch (err) {
      clearInterval(interval); setIsAnalyzing(false); setProgress(0);
      toast.error(err.message || "Cannot reach backend. Is it running on port 8000?");
    }
  }, [file, preview, router]);

  return (
    <div
      className={`drop-zone${dragging ? " drag" : ""}`}
      style={{ padding: preview ? "20px 24px" : "36px 28px", cursor: preview ? "default" : "pointer", borderRadius: 16 }}
      onClick={() => !preview && !isAnalyzing && inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
    >
      {isAnalyzing ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 72, height: 72 }}>
            <img src={preview} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", opacity: 0.45 }}/>
            <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "var(--blue)", animation: "spin 0.85s linear infinite" }}/>
            <div style={{ position: "absolute", inset: -10, borderRadius: "50%", border: "1.5px solid rgba(59,130,246,0.2)", animation: "spin 2s linear infinite reverse" }}/>
          </div>
          <div style={{ width: "100%", maxWidth: 280 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--t2)", fontWeight: 600 }}>{STEPS_TEXT[analysisStep]}</span>
              <span style={{ fontSize: 13, color: "var(--blue-2)", fontWeight: 700 }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 5, background: "var(--glass-b)", borderRadius: 10, overflow: "hidden" }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.3 }}
                style={{ height: "100%", background: "linear-gradient(to right, var(--blue), var(--violet))", borderRadius: 10 }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {STEPS_TEXT.map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= analysisStep ? "var(--blue)" : "var(--glass-b-hi)", transition: "background 0.3s" }}/>
            ))}
          </div>
        </div>
      ) : preview ? (
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img src={preview} alt="MRI preview" style={{ width: 88, height: 88, borderRadius: 14, objectFit: "cover", border: "2px solid var(--blue)", display: "block" }}/>
            <div style={{ position: "absolute", bottom: -6, right: -6, width: 24, height: 24, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", border: "2px solid var(--bg)" }}>
              <CheckIcon/>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--t1)", marginBottom: 4 }}>{file?.name}</p>
            <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 14 }}>{file ? `${(file.size / 1024).toFixed(0)} KB` : ""} · Ready for analysis</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={reset}><XIcon/> Remove</button>
              <button className="btn btn-primary btn-sm" style={{ padding: "8px 20px" }} onClick={handleAnalyze}>
                <ActivityIcon/> Analyze Scan
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--blue-dim)", color: "var(--blue-2)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(59,130,246,0.2)", boxShadow: "0 0 24px rgba(59,130,246,0.12)" }}>
            <UploadCloudIcon size={28}/>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--t1)", marginBottom: 5 }}>
              {dragging ? "Drop your MRI scan here ✓" : "Drag & drop your MRI scan"}
            </p>
            <p style={{ fontSize: 13, color: "var(--t3)" }}>JPG · JPEG · PNG · High-resolution supported</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}>
            Browse Files
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--t4)", fontWeight: 500 }}>
            <LockIcon/>
            <span>Images processed locally — never stored permanently</span>
          </div>
        </div>
      )}
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])}/>
    </div>
  );
}

/* ─── Animated Stat Number ─── */
function StatNum({ value }) {
  const [display, setDisplay] = useState(value);
  const [started, setStarted] = useState(false);

  const isNumber = !isNaN(parseFloat(value));
  const numVal = parseFloat(value);

  return (
    <motion.div
      onViewportEnter={() => {
        if (started || !isNumber) return;
        setStarted(true);
        const dur = 1600;
        const start = performance.now();
        const isDecimal = value.includes(".");
        const suffix = value.replace(/[\d.]/g, "");
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const fillVal = isDecimal ? (numVal * ease).toFixed(1) : Math.round(numVal * ease);
          setDisplay(fillVal + suffix);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }}
      viewport={{ once: true }}
    >
      {display}
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   DIAGNOSE/WORKFLOW PAGE
   (Restored to root page.js)
   ════════════════════════════════════════════ */
export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "transparent", position: "relative" }}>
      <Navbar/>

      <main>

        {/* ══════════ HERO ══════════ */}
        <section className="hero-full-bleed">
          <FadeUp>
            <div className="hero-content-container">
              
              {/* LEFT Column: Hero Text Content */}
              <div className="hero-text-col">
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(251, 191, 36, 0.15)", border: "1px solid rgba(251, 191, 36, 0.35)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
                  <span style={{ color: "#fbbf24", fontSize: 13, display: "flex", alignItems: "center" }}>★</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24" }}>Clinical Accuracy Certified</span>
                </div>

                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px 6px 8px", borderRadius: 100, background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.35)", marginBottom: 24 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #0284c7, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                    <ActivityIcon/>
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Clinical Diagnostic Workstation
                  </span>
                </div>

                <h1 style={{ fontSize: "clamp(34px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.15, color: "#ffffff", fontFamily: "Outfit, sans-serif", marginBottom: 20 }}>
                  Advanced MRI Brain Tumor Diagnostic Workspace
                </h1>

                <p style={{ fontSize: "clamp(15px, 1.5vw, 16px)", color: "rgba(255, 255, 255, 0.75)", maxWidth: 540, lineHeight: 1.7, marginBottom: 32 }}>
                  Our deep learning system utilizes fine-tuned EfficientNet-B0 classification and custom U-Net segmentation models to analyze brain MRI scans, localize lesions, and display explaining Grad-CAM heatmaps in sub-seconds.
                </p>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
                  <button className="btn" id="hero-get-started" style={{ padding: "14px 32px", fontSize: 15, background: "#ffffff", color: "#07111e", borderRadius: "12px", fontWeight: 700, boxShadow: "0 4px 20px rgba(255,255,255,0.15)" }} onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}>
                    Try Live Demo <ArrowRightIcon/>
                  </button>
                  <Link href="/about" style={{ textDecoration: "none" }}>
                    <button className="btn" style={{ padding: "14px 28px", fontSize: 15, border: "1px solid rgba(255, 255, 255, 0.3)", color: "#ffffff", background: "transparent", borderRadius: "12px", fontWeight: 600 }}>
                      View Details
                    </button>
                  </Link>
                </div>

                {/* Feature pills */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {FEATURES.map(f => (
                    <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 100, background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)", backdropFilter: "blur(8px)" }}>
                      <span style={{ color: f.color === "var(--blue)" ? "#38bdf8" : f.color === "var(--violet)" ? "#a78bfa" : "#34d399", display: "flex", alignItems: "center" }}>{f.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255, 255, 255, 0.85)" }}>{f.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT Column: Portrait with Floating Widgets */}
              <div className="hero-img-col">
                <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
                  <img src="/doctor-hero.png" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} alt="Radiologist Specialist" />
                  {/* Seamless gradient overlay to blend into the dark-to-light layout background */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to right, #0d1e35 0%, rgba(13, 30, 53, 0.4) 30%, transparent 65%), linear-gradient(to top, rgba(244, 251, 253, 0.4) 0%, transparent 35%)",
                    pointerEvents: "none"
                  }} />
                </div>

                {/* Floating Card 1: Accuracy */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{
                    position: "absolute",
                    top: 40,
                    left: -20,
                    padding: "12px 18px",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "var(--glass)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-b-hi)",
                    boxShadow: "var(--shadow-card)",
                    zIndex: 10
                  }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(52, 211, 153, 0.15)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
                    ✓
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Model Accuracy</p>
                    <p style={{ fontSize: 15, fontWeight: 900, color: "var(--t1)", fontFamily: "Outfit, sans-serif" }}>97.3%</p>
                  </div>
                </motion.div>

                {/* Floating Card 2: Inference Speed */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  style={{
                    position: "absolute",
                    bottom: 60,
                    right: -10,
                    padding: "12px 18px",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "var(--glass)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-b-hi)",
                    boxShadow: "var(--shadow-card)",
                    zIndex: 10
                  }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ZapIcon />
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Inference Speed</p>
                    <p style={{ fontSize: 15, fontWeight: 900, color: "var(--t1)", fontFamily: "Outfit, sans-serif" }}>&lt; 1 Second</p>
                  </div>
                </motion.div>

                {/* Floating Card 3: Radiology PACS Sync */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  style={{
                    position: "absolute",
                    bottom: 150,
                    left: -30,
                    padding: "10px 14px",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "var(--glass)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-b-hi)",
                    boxShadow: "var(--shadow-card)",
                    zIndex: 10
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(139, 92, 246, 0.15)", color: "#c084fc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                    ★
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--t2)" }}>Radiology PACS Sync</span>
                </motion.div>
              </div>

            </div>
          </FadeUp>

          {/* Bottom Frosted Glass Stats Bar */}
          <div className="stats-glass-bar">
            {STATS.map(({ value, label, sub }) => (
              <div key={label} style={{ textAlign: "left" }}>
                <div style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, color: "#ffffff", fontFamily: "Outfit, sans-serif", letterSpacing: "-0.025em", marginBottom: 4 }}>
                  <StatNum value={value} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#38bdf8", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.4 }}>{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ INTERACTIVE DEMO ══════════ */}
        <section id="demo" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
          <div className="glass-card" style={{ padding: "48px 36px", borderRadius: 24, position: "relative", overflow: "hidden" }}>
            {/* Glow effect */}
            <div style={{ position: "absolute", top: -50, right: -50, width: 250, height: 250, background: "radial-gradient(circle, var(--blue-glow) 0%, transparent 70%)", pointerEvents: "none" }} />
            
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "center" }} className="dash-grid">
              <div>
                <div className="section-chip" style={{ marginBottom: 16 }}>Interactive Demo</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 4, height: 28, borderRadius: 2, background: "var(--blue)" }} />
                  <h2 className="clinical-header" style={{ fontSize: "clamp(24px, 3.2vw, 38px)", fontWeight: 800, letterSpacing: "-0.025em", fontFamily: "Outfit, sans-serif", margin: 0 }}>
                    Test the Classifier Live
                  </h2>
                </div>
                <p style={{ fontSize: 15, color: "var(--t2)", lineHeight: 1.7, marginBottom: 20 }}>
                  Upload a brain MRI scan directly to see how our model processes the image in real-time. The FastAPI backend will return the classification prediction (Glioma, Meningioma, Pituitary, or No Tumor), U-Net segmentation boundary, and class activations (Grad-CAM).
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Supports JPG, JPEG, and PNG images",
                    "Full Grad-CAM and segmentation visual overlays",
                    "Download and print analysis report as PDF",
                    "Local-only processing ensures absolute privacy",
                  ].map((text, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--blue-dim)", color: "var(--blue-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                        ✓
                      </div>
                      <span style={{ fontSize: 13, color: "var(--t2)" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="glass-card" style={{ padding: 8, borderRadius: 22, border: "1px solid var(--glass-b-hi)" }}>
                  <HeroUpload />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ HOW IT WORKS ══════════ */}
        <section id="how-it-works" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <FadeUp>
              <div className="section-chip" style={{ marginBottom: 16 }}>Workflow</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 14 }}>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
                <h2 className="clinical-header" style={{ fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 800, letterSpacing: "-0.025em", fontFamily: "Outfit, sans-serif", margin: 0 }}>
                  From Upload to Report in Seconds
                </h2>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
              </div>
              <p style={{ fontSize: 16, color: "var(--t2)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                A four-stage deep learning pipeline handles everything automatically — no setup required.
              </p>
            </FadeUp>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, position: "relative", zIndex: 1 }} className="four-grid">
              {STEPS.map((step, i) => (
                <FadeUp key={step.num} delay={i * 0.08}>
                  <div className="glass-card glass-card-hover" style={{ padding: "32px 24px", textAlign: "left", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: step.bg, color: step.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: `1px solid ${step.color}15` }}>
                        {step.icon}
                      </div>
                      <p style={{ fontSize: 10, fontWeight: 800, color: step.color, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 6 }}>PHASE {step.num}</p>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)", marginBottom: 10, fontFamily: "Outfit, sans-serif" }}>{step.title}</h3>
                      <p style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.65, marginBottom: 14 }}>{step.desc}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--glass-b)", paddingTop: 14, marginTop: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Diagnostics Details</span>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--blue-dim)", color: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
                        →
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ TECH STACK ══════════ */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <FadeUp>
              <div className="section-chip" style={{ marginBottom: 16 }}>Built With</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 12 }}>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
                <h2 className="clinical-header" style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "Outfit, sans-serif", margin: 0 }}>
                  Technology Stack
                </h2>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
              </div>
              <p style={{ fontSize: 15, color: "var(--t2)", maxWidth: 440, margin: "0 auto" }}>
                Hover to see how each technology contributes to the pipeline.
              </p>
            </FadeUp>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="three-grid">
            {TECH_STACK.map((tech, i) => (
              <FadeUp key={tech.name} delay={i * 0.05}>
                <div className="tech-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>{tech.icon}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--t1)", fontFamily: "Outfit, sans-serif" }}>{tech.name}</h3>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.6 }}>{tech.desc}</p>
                  <div style={{ position: "absolute", top: 14, right: 14, width: 8, height: 8, borderRadius: "50%", background: tech.color, boxShadow: `0 0 10px ${tech.color}` }}/>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ══════════ CTA ══════════ */}
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
          <FadeUp>
            <div style={{ borderRadius: 28, padding: "56px 48px", background: "var(--grad-cta)", position: "relative", overflow: "hidden", border: "1px solid rgba(2, 132, 199, 0.08)", boxShadow: "var(--shadow-card)" }}>
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <h2 className="clinical-header" style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 14, fontFamily: "Outfit, sans-serif" }}>
                  Ready to Analyze a Scan?
                </h2>
                <p style={{ fontSize: 15, color: "var(--t2)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
                  Upload your brain MRI to begin analysis and get AI-powered predictions with Grad-CAM explainability instantly.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn btn-primary" id="cta-open-dashboard" style={{ padding: "13px 30px", fontSize: 15, borderRadius: 12, fontWeight: 700 }} onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}>
                    Analyze MRI Scan <ArrowRightIcon/>
                  </button>
                  <Link href="/about" style={{ textDecoration: "none" }}>
                    <button className="btn btn-secondary" style={{ padding: "13px 24px", fontSize: 15 }}>
                      View Documentation
                    </button>
                  </Link>
                </div>
                <p style={{ marginTop: 20, fontSize: 12, color: "var(--t3)" }}>
                  For research & educational use only · Not for clinical diagnosis
                </p>
              </div>
            </div>
          </FadeUp>
        </section>

      </main>

      <Footer/>

      <style jsx>{`
        .hero-full-bleed {
          width: 100%;
          position: relative;
          background: linear-gradient(to right, #07111e 0%, #0d1e35 45%, #e2f1f6 75%, #f4fbfd 100%);
          border-bottom: 1px solid var(--glass-b-hi);
          padding-top: calc(var(--nav-h) + 40px);
          padding-bottom: 0;
          overflow: hidden;
        }
        .hero-content-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 24px 160px 24px;
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          position: relative;
          z-index: 1;
        }
        .hero-text-col {
          padding: 20px 20px 20px 0;
          text-align: left;
        }
        .hero-img-col {
          position: relative;
          min-height: 460px;
          display: flex;
          align-items: stretch;
        }
        .stats-glass-bar {
          position: absolute;
          bottom: 0;
          left: calc((100% - 1280px) / 2 + 24px);
          right: 0;
          background: rgba(9, 21, 39, 0.8);
          backdrop-filter: blur(24px) saturate(140%);
          -webkit-backdrop-filter: blur(24px) saturate(140%);
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 28px 0 0 0;
          padding: 28px 48px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          z-index: 20;
        }
        @media (max-width: 1320px) {
          .stats-glass-bar {
            left: 24px;
          }
        }
        @media (max-width: 1024px) {
          .hero-full-bleed {
            background: linear-gradient(to bottom, #07111e 0%, #0d1e35 50%, #e2f1f6 85%, #f4fbfd 100%);
          }
          .hero-content-container {
            grid-template-columns: 1fr;
            padding: 40px 24px 32px 24px;
          }
          .hero-text-col {
            padding: 20px 0;
          }
          .hero-img-col {
            min-height: 400px;
          }
          .stats-glass-bar {
            position: relative;
            bottom: auto;
            left: auto;
            right: auto;
            grid-column: span 1;
            grid-template-columns: 1fr 1fr;
            padding: 28px 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            border-left: none;
            border-radius: 0;
          }
        }
        @media (max-width: 640px) {
          .stats-glass-bar {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }
      `}</style>
    </div>
  );
}
