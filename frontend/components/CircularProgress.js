"use client";
import { motion } from "framer-motion";

/**
 * Animated SVG circular progress ring.
 * Props: value (0-100), color, size, strokeWidth, label
 */
export default function CircularProgress({ value, color, size = 120, strokeWidth = 8, label = "CONFIDENCE" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="var(--glass-b-hi)" strokeWidth={strokeWidth} fill="none"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          strokeLinecap="round"
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: size / 4.5, fontWeight: 800, color: "var(--t1)", lineHeight: 1 }}
        >
          {Math.round(value)}%
        </motion.span>
        <span style={{ fontSize: size / 13, color: "var(--t3)", fontWeight: 700, marginTop: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {label}
        </span>
      </div>
    </div>
  );
}
