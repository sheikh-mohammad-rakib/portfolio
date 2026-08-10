"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// ── Register plugins outside component (gsap-react skill rule) ───────────────
gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Placeholder data — replace with real values ──────────────────────────────
const LOGOTYPE = "Rakib";

const NAV_LINKS = [
  { label: "Work",    href: "#work"    },
  { label: "About",   href: "#about"   },
  { label: "Contact", href: "#contact" },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  // ── GSAP: Scroll-aware background (gsap-scrolltrigger + gsap-react skills) ─
  // When the hero section leaves the viewport, the nav gets a semi-transparent
  // canvas background with backdrop-blur. Reverts cleanly on unmount via
  // useGSAP's automatic cleanup.
  useGSAP(
    () => {
      ScrollTrigger.create({
        // The hero section is the first full-viewport block after the nav
        trigger: "#hero",
        start: "bottom top",      // when hero bottom passes nav top
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
    },
    { scope: navRef }
  );

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#D8D8D4] px-8 md:px-16 py-5 flex items-center justify-between"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Logotype — serif, left-anchored */}
      <a
        href="#hero"
        className="font-serif text-xl font-medium tracking-tight text-[#111111] hover:text-[#1A4A2E] transition-colors"
      >
        {LOGOTYPE}
      </a>

      {/* Navigation links — small, muted, arrow-text suffixes */}
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
    </nav>
  );
}
