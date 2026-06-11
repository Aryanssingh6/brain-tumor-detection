"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ── Icons ── */
const LogoIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 7v6c0 5.52 4.48 10 9 10s9-4.48 9-10V7l-9-5z" stroke="currentColor" strokeWidth={2} opacity="0.85" />
    <path d="M7 13h2.5l1.5-3.5 2 7 1.5-4.5 1.5 1H17" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
    <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
    <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
  </svg>
);

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
const SunIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={12} cy={12} r={5}/><line x1={12} y1={1} x2={12} y2={3}/><line x1={12} y1={21} x2={12} y2={23}/>
    <line x1={4.22} y1={4.22} x2={5.64} y2={5.64}/><line x1={18.36} y1={18.36} x2={19.78} y2={19.78}/>
    <line x1={1} y1={12} x2={3} y2={12}/><line x1={21} y1={12} x2={23} y2={12}/>
    <line x1={4.22} y1={19.78} x2={5.64} y2={18.36}/><line x1={18.36} y1={5.64} x2={19.78} y2={4.22}/>
  </svg>
);
const MoonIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const MenuIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1={3} y1={6} x2={21} y2={6}/><line x1={3} y1={12} x2={21} y2={12}/><line x1={3} y1={18} x2={21} y2={18}/>
  </svg>
);
const XIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/>
  </svg>
);
const ActivityIcon = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const NAV_LINKS = [
  { href: "/",          label: "Home" },
  { href: "/analysis",  label: "Analysis" },
  { href: "/about",     label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDarkHeader = pathname === "/" && !scrolled;

  useEffect(() => {
    setTheme("light");
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleTheme = () => {
    // Clinical workstation theme is dark only
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          height: "var(--nav-h)",
          background: scrolled ? "var(--glass-heavy)" : "transparent",
          backdropFilter: scrolled ? "blur(28px) saturate(160%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(28px) saturate(160%)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--glass-b-hi)" : "transparent"}`,
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
          display: "flex", alignItems: "center",
          padding: "0 24px",
          transition: "background 0.35s, border-color 0.35s, box-shadow 0.35s, backdrop-filter 0.35s",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(59,130,246,0.40), 0 0 0 1px rgba(59,130,246,0.2)",
              flexShrink: 0,
            }}>
              <LogoIcon />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.025em", color: isDarkHeader ? "#ffffff" : "var(--t1)", fontFamily: "Outfit, sans-serif", transition: "color 0.35s" }}>
              Neuro<span className={isDarkHeader ? "logo-scan-dark" : "logo-scan-light"}>Scan AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hide-mobile">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link${pathname === href ? " active" : ""}${isDarkHeader ? " dark-mode-link" : ""}`}
                style={{ textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Engine status */}
            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "5px 12px", 
              background: isDarkHeader ? "rgba(255, 255, 255, 0.06)" : "var(--glass-b)",
              borderRadius: 100, 
              border: isDarkHeader ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid var(--glass-b-hi)",
              color: isDarkHeader ? "rgba(255, 255, 255, 0.85)" : "inherit",
              transition: "all 0.35s",
            }} className="hide-mobile">
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", flexShrink: 0, boxShadow: "0 0 6px #34d399" }} className="anim-pulse" />
              <ActivityIcon />
              <span style={{ fontSize: 11, fontWeight: 700, color: isDarkHeader ? "rgba(255, 255, 255, 0.85)" : "var(--t2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Engine Online</span>
            </div>

            <div style={{ width: 1, height: 20, background: isDarkHeader ? "rgba(255, 255, 255, 0.15)" : "var(--glass-b)", transition: "background 0.35s" }} className="hide-mobile" />

            {/* Theme toggle disabled for clinical layout */}

            {/* CTA */}
            <Link href="/#demo" className="hide-mobile" style={{ textDecoration: "none" }}>
              <button className="btn btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>
                Analyze Scan
              </button>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="btn btn-ghost btn-icon show-mobile"
              style={{
                color: isDarkHeader ? "#ffffff" : "var(--t2)",
                background: isDarkHeader ? "rgba(255, 255, 255, 0.06)" : "var(--glass-lite)",
                borderColor: isDarkHeader ? "rgba(255, 255, 255, 0.1)" : "var(--glass-b)",
                transition: "all 0.35s",
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            style={{
              position: "fixed", top: "var(--nav-h)", right: 0, bottom: 0,
              width: 280, zIndex: 999,
              background: "var(--glass-heavy)",
              backdropFilter: "blur(32px)",
              borderLeft: "1px solid var(--glass-b)",
              padding: "24px 20px",
              display: "flex", flexDirection: "column", gap: 8,
            }}
          >
            {NAV_LINKS.map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={href}
                  className={`nav-link${pathname === href ? " active" : ""}`}
                  style={{ display: "block", padding: "12px 16px", fontSize: 16, textDecoration: "none" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <div className="divider" style={{ margin: "12px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} className="anim-pulse" />
              <span style={{ fontSize: 13, color: "var(--t2)" }}>AI Engine Online</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.nav-link.dark-mode-link) {
          color: rgba(255, 255, 255, 0.72) !important;
        }
        :global(.nav-link.dark-mode-link:hover) {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        :global(.nav-link.dark-mode-link.active) {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        :global(.nav-link.dark-mode-link.active::after) {
          background: linear-gradient(to right, #60a5fa, #a78bfa) !important;
        }
        .logo-scan-dark {
          background: linear-gradient(135deg, #38bdf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: background 0.35s;
        }
        .logo-scan-light {
          background: linear-gradient(135deg, var(--blue), var(--indigo));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: background 0.35s;
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
