"use client";

// Phase 4b — Motion whileInView stagger + AnimatePresence wrapper
// motion/react best-practices: imports from motion/react, variants for stagger

import { motion, AnimatePresence } from "motion/react";

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

// ── Motion variants ───────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────

export default function Contact() {
  return (
    // AnimatePresence wraps the section for future exit animations if routed
    <AnimatePresence>
      <section
        id="contact"
        className="px-8 md:px-16 py-24 md:py-32 border-b border-[#D8D8D4]"
      >
        <div className="max-w-7xl mx-auto">

          {/* Container: stagger children on scroll enter */}
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

            {/* Heading */}
            <motion.h2
              variants={itemVariants}
              className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium text-[#111111] leading-[1.05] tracking-tight mb-8 max-w-3xl"
            >
              {HEADING}
            </motion.h2>

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
                  whileHover={{
                    borderColor: "#1A4A2E",
                    color: "#1A4A2E",
                  }}
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
