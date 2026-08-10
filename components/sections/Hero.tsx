"use client";

// Split text reveal on Hero H1 — word by word, masked clip animation
// Pattern: Motion `animate` + `stagger` on split words (Motion tutorial pattern)
// splitText API is Motion+ — implemented manually with the same technique:
// each word wrapped in a clip container, animates from y:100%→0 (rises up)
// Reference: https://examples.motion.dev/react/split-text

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// ── Register plugins once outside the component (gsap-react skill) ───────────
gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Placeholder data ──────────────────────────────────────────────────────────
const EYEBROW    = "Full Stack Creative Developer";
const NAME_LINE1 = "Sheikh Mohammad";
const NAME_LINE2 = "Rakib.";
const SUBHEADING =
  "I design and build products that live at the intersection of clean code and compelling experience.";
const CTA_PRIMARY   = "View My Work";
const CTA_SECONDARY = "Get in touch";

// ── SplitWords: wraps each word in a mask clip so words rise from below ───────
// Each word gets overflow-hidden parent (the "mask"), and the word animates
// from translateY(100%) → translateY(0) — creating a clean reveal from below.
// This is the exact technique used by Motion's splitText API.
function SplitWords({
  text,
  className,
  delay = 0,
  staggerDelay = 0.06,
}: {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.25em]`}>
      {words.map((word, i) => (
        // Outer span: the mask clip (overflow hidden)
        <span key={i} className="overflow-hidden inline-block leading-none">
          {/* Inner motion.span: the word that animates up into the mask */}
          <motion.span
            className={`inline-block ${className ?? ""}`}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.75,
              delay: delay + i * staggerDelay,
              ease: [0.33, 1, 0.68, 1] as [number, number, number, number], // cubic-bezier easeOutCubic
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ── Other entrance items (eyebrow, subheading, CTAs) — simple fade-up ────────
const itemVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.9 }, // starts after H1 reveal finishes
  },
};

// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const bgPatternRef = useRef<HTMLDivElement>(null);

  // ── Motion: scroll-zoom on the dot-grid background ───────────────────────
  // useScroll scoped to the hero section — progress 0 (top) → 1 (bottom)
  // Motion owns `scale`, GSAP owns `yPercent` — no property conflict.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scale 1 → 1.12 as hero scrolls out — subtle zoom-away feel
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  // Spring smoothing for organic feel (faster than fill-text, no lag on load)
  const scale = useSpring(rawScale, { stiffness: 80, damping: 20, restDelta: 0.001 });

  // ── GSAP: parallax scrub on background SVG pattern (yPercent) ────────────
  // GSAP and Motion co-exist: each owns different CSS properties.
  useGSAP(
    () => {
      gsap.to(bgPatternRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-8 md:px-16 overflow-hidden"
    >
      {/* ── SVG background dot-grid — Motion scale + GSAP parallax ─────────── */}
      {/* Motion.div: owns `scale` (scroll-zoom 1→1.12)                         */}
      {/* Inner div ref: GSAP owns `yPercent` (parallax -30%)                   */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{ scale }}     // Motion MotionValue — zoom as hero scrolls away
      >
        <div
          ref={bgPatternRef}  // GSAP target for yPercent parallax
          className="absolute inset-0"
        >
          <svg
            width="100%"
            height="130%"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-[0.04]"
          >
            <defs>
              <pattern
                id="dot-grid"
                x="0"
                y="0"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="#111111" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid)" />
          </svg>
        </div>
      </motion.div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl">

        {/* Eyebrow — fades in first */}
        <motion.p
          className="text-xs font-sans font-medium tracking-widest uppercase text-[#1A4A2E] mb-6"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {EYEBROW}
        </motion.p>

        {/* H1 — split word reveal, line by line ───────────────────────────── */}
        {/* Each word rises from below its own overflow-hidden clip mask       */}
        <h1 className="font-serif font-medium leading-[1.1] tracking-tight text-[#111111] mb-8">
          {/* Line 1: "Sheikh Mohammad" — words start at delay 0.3s */}
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-1">
            <SplitWords
              text={NAME_LINE1}
              delay={0.3}
              staggerDelay={0.08}
            />
          </span>

          {/* Line 2: "Rakib." italic — starts after line 1 finishes */}
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl italic">
            <SplitWords
              text={NAME_LINE2}
              delay={0.55}
              staggerDelay={0.08}
            />
          </span>
        </h1>

        {/* Subheading + CTAs — stagger in after H1 completes ─────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-[#555550] leading-relaxed max-w-xl mb-12"
          >
            {SUBHEADING}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
            <motion.a
              href="#work"
              className="inline-flex items-center gap-2 bg-[#1A4A2E] text-white px-8 py-4 text-sm font-medium tracking-wide"
              whileHover={{ backgroundColor: "#153D25" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {CTA_PRIMARY} &rarr;
            </motion.a>

            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 border border-[#111111] text-[#111111] px-8 py-4 text-sm font-medium"
              whileHover={{ backgroundColor: "#111111", color: "#ffffff" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {CTA_SECONDARY} &rarr;
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll hint ───────────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-10 left-8 md:left-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <p className="text-xs text-[#555550] tracking-widest uppercase">
          Scroll &darr;
        </p>
      </motion.div>
    </section>
  );
}
