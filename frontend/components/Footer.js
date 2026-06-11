"use client";
import Link from "next/link";

const GithubIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const LogoIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 7v6c0 5.52 4.48 10 9 10s9-4.48 9-10V7l-9-5z" stroke="currentColor" strokeWidth={2} opacity="0.85" />
    <path d="M7 13h2.5l1.5-3.5 2 7 1.5-4.5 1.5 1H17" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
    <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
    <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
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

const FOOTER_LINKS = {
  Product: [
    { label: "Home", href: "/" },
    { label: "Analysis", href: "/analysis" },
  ],
  Resources: [
    { label: "About", href: "/about" },
    { label: "Documentation", href: "/about#how-it-works" },
    { label: "FAQ", href: "/about#faq" },
  ],
  Contact: [
    { label: "contact@neuroscan.ai", href: "mailto:contact@neuroscan.ai" },
    { label: "GitHub", href: "https://github.com" },
    { label: "Report Issue", href: "/about#contact" },
  ],
};

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg-1)",
      borderTop: "1px solid var(--glass-b)",
      padding: "60px 24px 32px",
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top: Brand + Links */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
          marginBottom: 56,
        }} className="footer-grid">

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, textDecoration: "none" }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: "linear-gradient(135deg, var(--blue), var(--violet))",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
              }}>
                <LogoIcon />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--t1)", fontFamily: "Outfit, sans-serif" }}>
                NeuroScan <span style={{ color: "var(--blue-2)" }}>AI</span>
              </span>
            </Link>
            <p style={{ fontSize: 14, color: "var(--t3)", lineHeight: 1.7, maxWidth: 260, marginBottom: 24 }}>
              Clinical-grade AI brain tumor detection powered by deep learning. Providing accurate MRI analysis for better patient outcomes.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { icon: <GithubIcon />, href: "https://github.com", label: "GitHub" },
                { icon: <TwitterIcon />, href: "https://twitter.com", label: "Twitter" },
                { icon: <LinkedInIcon />, href: "https://linkedin.com", label: "LinkedIn" },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="footer-social-link"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--t3)", marginBottom: 16 }}>
                {section}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="footer-nav-link"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider-glow" style={{ marginBottom: 24 }} />

        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "var(--t3)" }}>
            © {new Date().getFullYear()} NeuroScan AI. All rights reserved. Not for clinical diagnostic use.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service"].map(t => (
              <a key={t} href="#" className="footer-bottom-link">{t}</a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-social-link {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--glass-b);
          border: 1px solid var(--glass-b-hi);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--t3);
          transition: all 0.2s ease;
        }
        .footer-social-link:hover {
          color: var(--t1);
          border-color: var(--blue);
          background: var(--blue-dim);
          transform: translateY(-2px);
        }
        :global(.footer-nav-link) {
          font-size: 14px;
          color: var(--t2);
          text-decoration: none;
          transition: color 0.18s ease;
        }
        :global(.footer-nav-link:hover) {
          color: var(--t1);
        }
        .footer-bottom-link {
          font-size: 13px;
          color: var(--t3);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-bottom-link:hover {
          color: var(--t2);
        }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
