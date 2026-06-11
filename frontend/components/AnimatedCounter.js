"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * AnimatedCounter — animates a number from 0 to `target` when it enters viewport.
 * @param {number} target
 * @param {string} suffix — e.g. "%" or "+"
 * @param {string} prefix — e.g. "$"
 * @param {number} duration — seconds
 * @param {number} decimals — decimal places
 */
export default function AnimatedCounter({ target, suffix = "", prefix = "", duration = 2, decimals = 0 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const frameRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [inView, target, duration, decimals]);

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}{suffix}
    </span>
  );
}
