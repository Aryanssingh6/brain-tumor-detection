"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Icons ── */
const ChevronDownIcon = () => <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const CheckCircleIcon = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const GithubIcon = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;
const LinkedInIcon = () => <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;

const BrainIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
const MicroscopeIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18h8" />
    <path d="M3 22h18" />
    <path d="M14 22a7 7 0 1 0-14 0" />
    <path d="M9 14h2" />
    <path d="M12 9V3h3" />
    <path d="M12 5h3" />
    <path d="m14 11 4 4" />
  </svg>
);
const TargetIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const ZapIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const FlameIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
const DeltaIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 20h18L12 4z" />
  </svg>
);
const EyeIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const ImageIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const TelescopeIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 3-5 5" /><path d="m10.7 13.3-3.8 3.8L3 17l.8-3.9 3.8-3.8" />
    <path d="M16 8.5 8.5 16" /><path d="M22 6.5 6.5 22" /><path d="m14 2 8 8" />
  </svg>
);

/* ── Real project data ── */
// Replace placeholder links with your actual ones.
const DEVELOPER = {
  name: "Aryan Singh",
  role: "Developer · B.Tech Student",
  bio: "Built NeuroScan AI as an academic ML project focused on brain tumor classification using EfficientNet-B0, U-Net segmentation, and Grad-CAM explainability. Open to collaboration and feedback.",
  avatar: "A",
  color: "var(--blue)",
  github: "https://github.com/Aryanssingh6",
  linkedin: "https://linkedin.com",
};

// Only 4 meaningful milestones, no inflated history
const TIMELINE = [
  { date: "Q1 2024", title: "Problem Research & Dataset Selection", desc: "Studied the clinical need for accessible AI screening. Selected the Kaggle Brain Tumor Classification dataset (4 classes, ~7,000 MRI images).", color: "var(--blue)" },
  { date: "Q2 2024", title: "Model Training & Evaluation", desc: "Fine-tuned EfficientNet-B0 on the dataset, achieving 97.3% test accuracy. Added U-Net segmentation for tumor boundary detection.", color: "var(--violet)" },
  { date: "Q3 2024", title: "Backend & Grad-CAM Integration", desc: "Built the FastAPI backend serving the classification model, U-Net, Grad-CAM heatmaps, and a severity scoring module.", color: "var(--cyan)" },
  { date: "Q4 2024", title: "Frontend & Full-Stack Launch", desc: "Designed and built the Next.js multi-page frontend with real-time analysis, analytics dashboard, and PDF export.", color: "var(--green)" },
];

const TECHS = [
  { name: "EfficientNet-B0", cat: "Classification", icon: <BrainIcon /> },
  { name: "U-Net",           cat: "Segmentation",   icon: <MicroscopeIcon /> },
  { name: "Grad-CAM",        cat: "Explainability", icon: <TelescopeIcon /> },
  { name: "FastAPI",         cat: "API Backend",    icon: <ZapIcon /> },
  { name: "PyTorch",         cat: "Deep Learning",  icon: <FlameIcon /> },
  { name: "Next.js 16",      cat: "Frontend",       icon: <DeltaIcon /> },
  { name: "Framer Motion",   cat: "Animations",     icon: <TargetIcon /> },
  { name: "OpenCV",          cat: "Image Processing", icon: <EyeIcon /> },
];

const FAQS = [
  {
    q: "What tumor types can the model classify?",
    a: "The model classifies four categories: Glioma, Meningioma, Pituitary Tumor, and No Tumor. These match the four classes in the Kaggle Brain Tumor Classification dataset used for training.",
  },
  {
    q: "What accuracy does the model achieve?",
    a: "EfficientNet-B0 achieves 97.3% classification accuracy on the held-out test split (approximately 20% of the dataset). This metric is measured on static test data — real-world performance on unseen clinical scans may vary.",
  },
  {
    q: "What image formats are accepted?",
    a: "JPEG and PNG formats are supported. The model accepts any resolution; images are automatically resized to 224×224px internally during preprocessing.",
  },
  {
    q: "Are uploaded images stored on a server?",
    a: "No. Images are processed entirely in-memory by the FastAPI backend and are never written to disk or stored permanently. Analysis results are stored only in your browser's sessionStorage/localStorage and cleared when you close the tab.",
  },
  {
    q: "What is Grad-CAM and why is it included?",
    a: "Gradient-weighted Class Activation Mapping (Grad-CAM) is an explainability technique that highlights which regions of the MRI the model focused on. This is critical for building trust in AI-assisted screening — a black-box prediction alone is not useful clinically.",
  },
  {
    q: "Is this tool approved for clinical use?",
    a: "No. NeuroScan AI is an academic research project and is not FDA-cleared or CE-marked for clinical diagnosis. It is intended for educational demonstration and portfolio purposes only. All results must be verified by a qualified medical professional.",
  },
  {
    q: "How do I run this project locally?",
    a: "Clone the repository, install Python dependencies (pip install -r requirements.txt) and Node dependencies (npm install). Start the FastAPI backend with `python backend/main.py` and the frontend with `npm run dev` in the frontend directory.",
  },
];

/* ── Fade-up animation ── */
const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </motion.div>
);

const Chip = ({ children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, background: "var(--blue-dim)", border: "1px solid rgba(59,130,246,0.22)", color: "var(--blue-2)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
    {children}
  </span>
);

/* ── FAQ accordion ── */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeUp delay={index * 0.04}>
      <div className={`faq-item${open ? " open" : ""}`}>
        <button
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          style={{ width: "100%", padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--t1)", paddingRight: 14, lineHeight: 1.4 }}>{q}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }} style={{ flexShrink: 0, color: open ? "var(--blue-2)" : "var(--t3)", display: "flex" }}>
            <ChevronDownIcon />
          </motion.span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
              <div style={{ padding: "0 18px 16px", borderTop: "1px solid var(--glass-b)" }}>
                <p style={{ fontSize: 14, color: "var(--t2)", lineHeight: 1.7, paddingTop: 12 }}>{a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeUp>
  );
}

/* ════════════════════════════════════════
   ABOUT PAGE
════════════════════════════════════════ */
export default function AboutPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.length < 10) e.message = "Message too short";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    // Real implementation: POST to your backend or an email service like Formspree/EmailJS
    await new Promise(r => setTimeout(r, 1200));
    toast.success("Message sent! I'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      <Navbar />

      <main style={{ paddingTop: "var(--nav-h)" }}>

        {/* ── Hero ── */}
        <section style={{ maxWidth: 820, margin: "0 auto", padding: "72px 24px 56px", textAlign: "center" }}>
          <FadeUp>
            <Chip>About This Project</Chip>
            <h1 className="clinical-header" style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "Outfit, sans-serif", margin: "20px 0 18px" }}>
              AI-Powered Brain Tumor Detection System
            </h1>
            <p style={{ fontSize: "clamp(15px,1.8vw,18px)", color: "var(--t2)", maxWidth: 600, margin: "0 auto", lineHeight: 1.65 }}>
              An academic deep learning project combining EfficientNet-B0 classification,
              U-Net segmentation, and Grad-CAM explainability for transparent MRI analysis.
            </p>
          </FadeUp>
        </section>

        {/* ── Project overview ── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="two-col">

            <FadeUp>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 4, height: 24, borderRadius: 2, background: "var(--blue)" }} />
                <h2 className="clinical-header" style={{ fontSize: "clamp(22px,2.8vw,32px)", fontWeight: 800, fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em", margin: 0 }}>
                  Project Goal
                </h2>
              </div>
              <p style={{ fontSize: 15, color: "var(--t2)", lineHeight: 1.75, marginBottom: 14 }}>
                NeuroScan AI demonstrates how modern deep learning techniques can be applied to medical image analysis. The goal is to build a fully explainable, end-to-end system that classifies brain tumors from MRI scans and shows the model&apos;s reasoning via Grad-CAM.
              </p>
              <p style={{ fontSize: 15, color: "var(--t2)", lineHeight: 1.75, marginBottom: 20 }}>
                The project prioritizes <strong style={{ color: "var(--t1)" }}>explainability</strong> — every prediction includes a heatmap so users can see <em>why</em> the model made its decision, not just what it decided.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Open-source, reproducible model training pipeline",
                  "Grad-CAM visualizations for explainable predictions",
                  "Real-time FastAPI backend with automatic OpenAPI docs",
                  "For research & educational use only — not clinical",
                ].map(item => (
                  <div key={item} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <div style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }}><CheckCircleIcon /></div>
                    <span style={{ fontSize: 14, color: "var(--t2)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 4, height: 24, borderRadius: 2, background: "var(--blue)" }} />
                <h2 className="clinical-header" style={{ fontSize: "clamp(22px,2.8vw,32px)", fontWeight: 800, fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em", margin: 0 }}>
                  Dataset & Training
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Dataset", value: "Kaggle Brain Tumor MRI Dataset", color: "var(--blue)" },
                  { label: "Classes", value: "Glioma · Meningioma · Pituitary · No Tumor", color: "var(--violet)" },
                  { label: "Images", value: "~7,023 MRI scans", color: "var(--cyan)" },
                  { label: "Test Accuracy", value: "97.3% (EfficientNet-B0)", color: "var(--green)" },
                  { label: "Preprocessing", value: "224×224px, ImageNet normalisation", color: "var(--yellow)" },
                  { label: "Augmentation", value: "Flip, rotation, brightness variation", color: "var(--orange)" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ padding: "12px 16px", background: "var(--glass)", border: "1px solid var(--glass-b)", borderRadius: 12, display: "flex", gap: 14, alignItems: "center" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--t3)", width: 110, flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: 13, color: "var(--t1)", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── How the AI works ── */}
        <section id="how-it-works" style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <FadeUp>
              <Chip>Technical Architecture</Chip>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", margin: "16px 0 10px" }}>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
                <h2 className="clinical-header" style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", fontFamily: "Outfit, sans-serif", margin: 0 }}>
                  How the AI Model Works
                </h2>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
              </div>
              <p style={{ fontSize: 15, color: "var(--t2)", maxWidth: 520, margin: "0 auto" }}>
                A four-stage pipeline processes each scan through classification, segmentation, and explainability layers.
              </p>
            </FadeUp>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }} className="two-col">
            {[
              { step: "1", icon: <ImageIcon />, color: "var(--blue)",   title: "Image Preprocessing",       desc: "Raw MRI scans are resized to 224×224px and normalized using ImageNet mean/std statistics. Training used flipping, rotation, and brightness augmentation." },
              { step: "2", icon: <BrainIcon />, color: "var(--violet)", title: "EfficientNet-B0 Classifier",  desc: "A fine-tuned EfficientNet-B0 backbone (pretrained on ImageNet) classifies the scan into one of 4 tumor categories with a softmax probability output." },
              { step: "3", icon: <MicroscopeIcon />, color: "var(--cyan)",   title: "U-Net Segmentation",         desc: "A custom U-Net architecture with skip connections segments the tumor region at pixel level, producing a binary mask of the lesion boundary." },
              { step: "4", icon: <TelescopeIcon />, color: "var(--green)",  title: "Grad-CAM Explainability",    desc: "Gradient-weighted Class Activation Mapping generates a heatmap showing which spatial regions most influenced the classification decision." },
            ].map(({ step, icon, color, title, desc }, i) => (
              <FadeUp key={step} delay={i * 0.07}>
                <div className="glass-card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 24 }}>{icon}</span>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 800, color, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 5 }}>STEP {step}</p>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)", marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>{title}</h3>
                      <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.65 }}>{desc}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── Timeline (4 milestones) ── */}
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <FadeUp>
              <Chip>Development Timeline</Chip>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", margin: "16px 0 0" }}>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
                <h2 className="clinical-header" style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", fontFamily: "Outfit, sans-serif", margin: 0 }}>
                  How It Was Built
                </h2>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
              </div>
            </FadeUp>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 11, top: 12, bottom: 12, width: 1, background: "linear-gradient(to bottom, var(--blue), transparent)" }} />
            {TIMELINE.map((item, i) => (
              <FadeUp key={item.date} delay={i * 0.07}>
                <div style={{ display: "flex", gap: 20, paddingBottom: 28, paddingLeft: 4, position: "relative" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: item.color, border: "3px solid var(--bg)", boxShadow: `0 0 10px ${item.color}60`, flexShrink: 0, marginTop: 2, zIndex: 1 }} />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: item.color, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>{item.date}</p>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)", marginBottom: 6, fontFamily: "Outfit, sans-serif" }}>{item.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.65 }}>{item.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── Developer card ── */}
        <section style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <FadeUp>
              <Chip>Developer</Chip>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", margin: "16px 0 0" }}>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
                <h2 className="clinical-header" style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "Outfit, sans-serif", margin: 0 }}>
                  Who Built This
                </h2>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
              </div>
            </FadeUp>
          </div>
          <FadeUp delay={0.07}>
            <div className="glass-card" style={{ padding: 28, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
              <img
                src="/avatar.png"
                alt="Developer Avatar"
                style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--blue)", flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--t1)", fontFamily: "Outfit, sans-serif", marginBottom: 3 }}>{DEVELOPER.name}</h3>
                <p style={{ fontSize: 13, color: "var(--blue-2)", fontWeight: 600, marginBottom: 12 }}>{DEVELOPER.role}</p>
                <p style={{ fontSize: 14, color: "var(--t2)", lineHeight: 1.7, marginBottom: 18 }}>{DEVELOPER.bio}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { icon: <GithubIcon />, href: DEVELOPER.github, label: "GitHub" },
                    { icon: <LinkedInIcon />, href: DEVELOPER.linkedin, label: "LinkedIn" },
                  ].map(({ icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", color: "var(--t2)" }}>
                      {icon} {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ── Tech stack ── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <FadeUp>
              <Chip>Tech Stack</Chip>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", margin: "16px 0 0" }}>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
                <h2 className="clinical-header" style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "Outfit, sans-serif", margin: 0 }}>
                  Technologies Used
                </h2>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
              </div>
            </FadeUp>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="four-grid">
            {TECHS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.05}>
                <div className="glass-card" style={{ padding: "16px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{t.icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--t1)" }}>{t.name}</p>
                    <p style={{ fontSize: 10, color: "var(--t3)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{t.cat}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{ maxWidth: 740, margin: "0 auto", padding: "56px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <FadeUp>
              <Chip>FAQ</Chip>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", margin: "16px 0 0" }}>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
                <h2 className="clinical-header" style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", fontFamily: "Outfit, sans-serif", margin: 0 }}>
                  Frequently Asked Questions
                </h2>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
              </div>
            </FadeUp>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} index={i} />)}
          </div>
        </section>

        {/* ── Contact form ── */}
        <section id="contact" style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <FadeUp>
              <Chip>Get In Touch</Chip>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", margin: "16px 0 10px" }}>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
                <h2 className="clinical-header" style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "Outfit, sans-serif", margin: 0 }}>
                  Contact
                </h2>
                <div style={{ width: 12, height: 4, borderRadius: 2, background: "var(--blue)" }} />
              </div>
              <p style={{ fontSize: 15, color: "var(--t2)" }}>
                Have feedback, questions, or a collaboration idea? Send a message below.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.08}>
            <div className="glass-card" style={{ padding: "32px 28px" }}>
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="two-col">
                  <div>
                    <label htmlFor="contact-name" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--t2)", marginBottom: 7 }}>
                      Full Name <span style={{ color: "var(--red)" }}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      className={`input${errors.name ? " input-error" : ""}`}
                      type="text" placeholder="Your name"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 5 }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--t2)", marginBottom: 7 }}>
                      Email <span style={{ color: "var(--red)" }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      className={`input${errors.email ? " input-error" : ""}`}
                      type="email" placeholder="you@example.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 5 }}>{errors.email}</p>}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="contact-message" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--t2)", marginBottom: 7 }}>
                    Message <span style={{ color: "var(--red)" }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    className={`input${errors.message ? " input-error" : ""}`}
                    placeholder="Your question or feedback…"
                    rows={5} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ resize: "vertical", minHeight: 110 }}
                  />
                  {errors.message && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 5 }}>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "13px", fontSize: 15, borderRadius: 12 }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span className="anim-spin" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} />
                      Sending…
                    </span>
                  ) : "Send Message"}
                </button>
                <p style={{ fontSize: 12, color: "var(--t4)", marginTop: 12, textAlign: "center" }}>
                  Or email directly: <a href="mailto:aryan@example.com" style={{ color: "var(--blue-2)", textDecoration: "none" }}>aryan@example.com</a>
                </p>
              </form>
            </div>
          </FadeUp>
        </section>

      </main>

      <Footer />
    </div>
  );
}
