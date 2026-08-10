"use client";

// Fill Text — Contact section heading
// MCP confirmed APIs: motion, useSpring, useTransform (grade: A)
// Reference: https://examples.motion.dev/react/loading-fill-text
//
// Technique: CSS `background-clip: text` with a two-stop gradient.
//   Left stop = #1A4A2E (forest green), right stop = #111111 (base text colour).
//   `backgroundSize` is animated from "0% 100%" → "100% 100%" via useScroll.
//   As scroll progresses the green fill bleeds left-to-right across the text —
//   like ink soaking into paper. The text itself stays in the DOM and accessible.
//
// Motion best-practices (react.md):
//   - MotionValues only used in useTransform/style, never read in render
//   - Import from motion/react

import { useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";

// ── Placeholder data ──────────────────────────────────────────────────────────
const EYEBROW  = "Get In Touch";
const HEADING  = "Let's build something.";
const SUBTEXT  =
  "Whether you have a project in mind or just want to say hi — my inbox is always open.";

// TODO: replace all href="#" with real URLs before going live
const LINKS = [
  { label: "Email",    href: "#" }, // TODO: mailto:your@email.com
  { label: "GitHub",   href: "#" }, // TODO: https://github.com/yourusername
  { label: "LinkedIn", href: "#" }, // TODO: https://linkedin.com/in/yourusername
];

// ── Motion variants — preserved for eyebrow, subtext, links ──────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

// ── FillHeading: scroll-driven ink fill on the H2 ────────────────────────────
// Isolated component so it has its own headingRef for useScroll target.
function FillHeading({ text }: { text: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Scroll progress for THIS element (scoped to its own ref)
  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start 0.9", "start 0.4"], // fill completes when top of heading is at 40% viewport
  });

  // Spring-smooth the raw scroll progress for organic ink-bleed feel
  // (useSpring matches the MCP-confirmed pattern: useSpring + useTransform)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  // Map 0→1 scroll progress to backgroundSize "0% 100%" → "100% 100%"
  // Motion best-practices: useTransform result only used in style, never .get() in render
  const backgroundSize = useTransform(
    smoothProgress,
    [0, 1],
    ["0% 100%", "100% 100%"]
  );

  return (
    <motion.h2
      ref={headingRef}
      // Text is rendered as a gradient: green fill layer behind #111111 base
      // background-clip: text clips the gradient to the letterforms only
      // background-repeat: no-repeat keeps the fill from tiling
      style={{
        backgroundImage: `linear-gradient(to right, #1A4A2E, #1A4A2E)`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",         // Safari
        color: "#111111",                     // base colour — shows before fill arrives
        backgroundRepeat: "no-repeat",
        backgroundSize,                       // MotionValue drives this
        // When fill is 100% the green gradient fully covers the text colour.
        // transition to green is smooth because backgroundSize is spring-animated.
      }}
      className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-tight mb-8 max-w-3xl"
    >
      {text}
    </motion.h2>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Contact() {
  return (
    <AnimatePresence>
      <section
        id="contact"
        className="px-8 md:px-16 py-24 md:py-32 border-b border-[#D8D8D4]"
      >
        <div className="max-w-7xl mx-auto">

          {/* Container: stagger children on scroll enter (eyebrow, subtext, links) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {/* Eyebrow */}
            <motion.p
              variants={itemVariants}
              className="text-xs font-sans font-medium uppercase tracking-widest text-[#1A4A2E] mb-8"
            >
              {EYEBROW}
            </motion.p>

            {/* Heading — ink fill (FillHeading has its own scroll MotionValues) */}
            {/* Not a motion.div child so it isn't driven by the stagger variants */}
            <FillHeading text={HEADING} />

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-base text-[#555550] leading-relaxed max-w-lg mb-14"
            >
              {SUBTEXT}
            </motion.p>

            {/* Social links */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              {LINKS.map(({ label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  className="border border-[#D8D8D4] text-[#555550] px-6 py-3 text-sm"
                  whileHover={{ borderColor: "#1A4A2E", color: "#1A4A2E" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  {label} -&gt;
                </motion.a>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </section>
    </AnimatePresence>
  );
}
