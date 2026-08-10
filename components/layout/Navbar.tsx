"use client";

// Scroll Direction: Hide Header — Motion + GSAP
// Motion: useScroll + useMotionValueEvent to detect scroll direction
//   → motion.nav animates y: 0 ↔ -100% (slides out/in)
// GSAP: ScrollTrigger handles the bg-blur transition (preserved from before)
// Tutorial: https://motion.dev/examples?platform=react&tutorial=true

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// ── Register GSAP plugins outside the component (gsap-react skill) ───────────
gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Placeholder data ──────────────────────────────────────────────────────────
const LOGOTYPE = "Rakib";

const NAV_LINKS = [
  { label: "Work",    href: "#work"    },
  { label: "About",   href: "#about"   },
  { label: "Contact", href: "#contact" },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const navRef     = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  // ── Motion: track scroll position and direction ───────────────────────────
  // useScroll returns a MotionValue for scrollY (Motion best-practices:
  // never read MotionValues in render — use useMotionValueEvent instead)
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Hide when scrolling DOWN past 80px; show when scrolling UP
    if (latest > previous && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // ── GSAP: bg-blur transition when hero section leaves viewport ────────────
  // Preserved from the original Navbar. Scoped to navRef for safe cleanup.
  useGSAP(() => {
    // document.querySelector avoids the scope restriction — #hero is outside the nav.
    // scope is not set here since we only animate navRef.current (no string selectors).
    const heroEl = document.querySelector("#hero");
    if (!heroEl) return;

    ScrollTrigger.create({
      trigger: heroEl,           // element reference, not string
      start: "bottom top",
      onEnter: () => {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(248,248,246,0.92)",
          backdropFilter: "blur(12px)",
          duration: 0.4,
          ease: "power2.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(navRef.current, {
          backgroundColor: "transparent",
          backdropFilter: "blur(0px)",
          duration: 0.3,
          ease: "power2.in",
        });
      },
    });
  });

  return (
    // motion.nav — animates y position based on scroll direction
    // variants keep the logic declarative (Motion best-practices)
    <motion.nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#D8D8D4] px-8 md:px-16 py-5 flex items-center justify-between"
      style={{ backgroundColor: "transparent" }}
      // Slide up when hidden, slide back to 0 when visible
      variants={{
        visible: { y: 0 },
        hidden:  { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
    >
      {/* Logotype */}
      <a
        href="#hero"
        className="font-serif text-xl font-medium tracking-tight text-[#111111] hover:text-[#1A4A2E] transition-colors"
      >
        {LOGOTYPE}
      </a>

      {/* Nav links — arrow-text suffix per Design.md */}
      <ul className="flex items-center gap-8 list-none m-0 p-0">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className="text-sm text-[#555550] hover:text-[#111111] transition-colors"
            >
              {label} -&gt;
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
