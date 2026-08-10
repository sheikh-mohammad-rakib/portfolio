"use client";

// Phase 4b — GSAP ScrollTrigger.batch() stagger on skill tags
// gsap-scrolltrigger skill: batch staggers elements that fire near same time
// gsap-react skill: useGSAP with scope ref, plugins registered outside

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Placeholder data ──────────────────────────────────────────────────────────
const SECTION_LABEL = "Skills & Tools";

const SKILLS = [
  "React", "Next.js", "TypeScript", "Node.js",
  "PostgreSQL", "Prisma", "Tailwind CSS", "GSAP",
  "Motion", "Figma", "REST APIs", "GraphQL",
  "Docker", "Git", "Vercel", "Linux",
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  // ── GSAP ScrollTrigger.batch() — stagger tags as they enter viewport ──────
  // gsap-scrolltrigger skill: batch fires one callback for all elements
  // that enter within the interval window, then staggers them together
  useGSAP(
    () => {
      // Set initial invisible state for all tags
      gsap.set("[data-skill]", { opacity: 0, y: 12 });

      ScrollTrigger.batch("[data-skill]", {
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.06,
            overwrite: true,  // gsap-core: prevent conflicts
          });
        },
        onLeaveBack: (elements) => {
          gsap.to(elements, {
            opacity: 0,
            y: 12,
            duration: 0.3,
            ease: "power2.in",
            stagger: 0.03,
            overwrite: true,
          });
        },
        start: "top 88%",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="px-8 md:px-16 py-24 md:py-32 border-b border-[#D8D8D4]"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <p className="text-xs font-sans font-medium uppercase tracking-widest text-[#555550] mb-14">
          {SECTION_LABEL}
        </p>

        {/* Skill tags — GSAP targets [data-skill] via batch */}
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              data-skill
              className="border border-[#D8D8D4] text-[#555550] px-4 py-2 text-sm hover:border-[#1A4A2E] hover:text-[#1A4A2E] transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
