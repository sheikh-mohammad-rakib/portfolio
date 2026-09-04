"use client";

// SectionDivider — SVG path drawing animation
// Motion API: motion.path, pathLength (0→1), whileInView
// Docs: https://motion.dev/docs/react-svg-animation
//
// Pattern: `pathLength` is a special SVG prop Motion understands natively.
// Animating it from 0 to 1 draws the stroke progressively — no stroke-dasharray
// hack needed. Motion handles it via its SVG renderer.
//
// Three divider designs to fit different section transitions:
//   - "line"    : a simple horizontal rule that draws in from left
//   - "bracket" : an L-shape bracket (left + bottom) — used between major sections
//   - "corner"  : a right-angle corner mark (editorial accent)
//
// Usage in page.tsx:
//   <SectionDivider variant="line" />
//   <SectionDivider variant="bracket" />

import { motion } from "motion/react";

type DividerVariant = "line" | "bracket" | "corner";

interface SectionDividerProps {
  variant?: DividerVariant;
  color?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

// Shared transition — ease matches the editorial easeInOutQuart feel
const DRAW_TRANSITION = (duration: number, delay: number) => ({
  pathLength: {
    duration,
    delay,
    ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
  },
  opacity: {
    duration: 0.01, // instant — the line appears then draws; no fade-in needed
    delay,
  },
});

export default function SectionDivider({
  variant = "line",
  color = "#D8D8D4",           // Design token: border color
  duration = 1.2,
  delay = 0.1,
  className = "",
}: SectionDividerProps) {
  // Shared whileInView props — trigger once as divider enters viewport
  const inViewProps = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: false, margin: "-40px" },
    transition: DRAW_TRANSITION(duration, delay),
  };

  if (variant === "line") {
    // A horizontal line that draws left-to-right across the full width
    return (
      <div
        className={`w-full overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <svg
          width="100%"
          height="1"
          viewBox="0 0 1200 1"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.line
            x1="0"
            y1="0.5"
            x2="1200"
            y2="0.5"
            stroke={color}
            strokeWidth="1"
            {...inViewProps}
          />
        </svg>
      </div>
    );
  }

  if (variant === "bracket") {
    // An opening bracket: vertical stroke on left + horizontal stroke on top
    // Sits at the top-left of a section — creates an editorial "entry mark"
    return (
      <div
        className={`${className}`}
        aria-hidden="true"
        style={{ width: 40, height: 40 }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Horizontal top bar — draws first */}
          <motion.path
            d="M 0 0 L 40 0"
            stroke={color}
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={DRAW_TRANSITION(0.6, delay)}
          />
          {/* Vertical left bar — draws after */}
          <motion.path
            d="M 0 0 L 0 40"
            stroke={color}
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={DRAW_TRANSITION(0.6, delay + 0.3)}
          />
        </svg>
      </div>
    );
  }

  // "corner" — a closing bracket: bottom + right bars
  // Used at the end of a section as a subtle closing mark
  return (
    <div
      className={`${className}`}
      aria-hidden="true"
      style={{ width: 40, height: 40 }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Horizontal bottom bar */}
        <motion.path
          d="M 0 40 L 40 40"
          stroke={color}
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-40px" }}
          transition={DRAW_TRANSITION(0.6, delay)}
        />
        {/* Vertical right bar */}
        <motion.path
          d="M 40 40 L 40 0"
          stroke={color}
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-40px" }}
          transition={DRAW_TRANSITION(0.6, delay + 0.3)}
        />
      </svg>
    </div>
  );
}
