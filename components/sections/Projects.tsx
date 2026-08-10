"use client";

// Scroll Image Reveal — Projects section
// Pattern: Motion useScroll (per-element) + useTransform → clipPath curtain + scale
// MCP confirmed: motion, useScroll, useTransform (MotionScore grade: A)
// Reference: https://examples.motion.dev/react/scroll-image-reveal
//
// Each project image gets its own scroll-progress MotionValue.
// As the image enters the viewport, a clip-path "curtain" slides up,
// revealing the image from bottom-to-top. Simultaneously, the image
// scales from 1.1 → 1.0 (zooms out into place).
// Motion best-practices: MotionValues only read inside useTransform (not render).

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Placeholder data ──────────────────────────────────────────────────────────
const SECTION_LABEL = "Selected Work";

const PROJECTS = [
  {
    id:          1,
    number:      "01",
    title:       "Nexus Dashboard",
    description: "A real-time analytics platform for SaaS teams. Built with Next.js, Prisma, and PostgreSQL — featuring live data streams and role-based access control.",
    tags:        ["Next.js", "TypeScript", "PostgreSQL"],
    image:       "/images/projects/project-1.png",
    href:        "#", // TODO: replace with live URL
  },
  {
    id:          2,
    number:      "02",
    title:       "Bloom Commerce",
    description: "A full-stack e-commerce storefront with custom cart logic, Stripe integration, and a headless CMS for product management.",
    tags:        ["React", "Node.js", "Stripe"],
    image:       "/images/projects/project-2.png",
    href:        "#", // TODO: replace with live URL
  },
  {
    id:          3,
    number:      "03",
    title:       "Canvas Agency",
    description: "A motion-rich marketing site for a creative studio. Built with GSAP ScrollTrigger for scroll-driven storytelling and Motion for micro-interactions.",
    tags:        ["GSAP", "Motion", "Next.js"],
    image:       "/images/projects/project-3.png",
    href:        "#", // TODO: replace with live URL
  },
];

// ── RevealImage: per-image scroll-linked clip reveal ─────────────────────────
// Isolated component so each image gets its own containerRef and MotionValues.
// Motion best-practices: useScroll with target ref scopes progress to that element.
function RevealImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for THIS element (0 = top of element at bottom of viewport,
  // 1 = bottom of element at top of viewport)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],   // full travel range through viewport
  });

  // Curtain clip-path: starts fully covering the image (inset 100% bottom),
  // reveals to fully uncovered (inset 0%) as element scrolls into view
  // The reveal happens in the first 40% of the element's scroll travel
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.4],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );

  // Subtle scale: image starts slightly zoomed in (1.12) and settles to 1
  // in sync with the clip reveal — creates depth and cinematic feel
  const scale = useTransform(
    scrollYProgress,
    [0, 0.4],
    [1.12, 1]
  );

  return (
    // Outer div: the clip mask container — overflow hidden, holds the curtain
    <div
      ref={containerRef}
      className="aspect-[4/3] overflow-hidden bg-[#F0F0EC] relative"
    >
      {/* motion.div: the clipped layer — clipPath animates from top */}
      <motion.div
        className="absolute inset-0"
        style={{ clipPath }}
      >
        {/* motion.div: the image itself — scales out as it reveals */}
        <motion.div
          className="absolute inset-0"
          style={{ scale }}
          // whileHover: preserved from original (image scales up on hover)
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  // ── GSAP: staggered card entry (opacity + y) — cards animate in first ────
  // Image reveal then plays as user scrolls through each card.
  // The card-level animation and image-level reveal are independent.
  useGSAP(
    () => {
      gsap.set("[data-project-card]", { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.to("[data-project-card]", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.14,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="work"
      ref={sectionRef}
      className="px-8 md:px-16 py-24 md:py-32 border-b border-[#D8D8D4]"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <p className="text-xs font-sans font-medium uppercase tracking-widest text-[#555550] mb-14">
          {SECTION_LABEL}
        </p>

        {/* Tiled grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D8D8D4] border border-[#D8D8D4]">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              data-project-card
              className="bg-[#F8F8F6] flex flex-col"
            >
              {/* Card header */}
              <div className="px-5 py-4 border-b border-[#D8D8D4] flex items-center justify-between">
                <span className="text-xs font-mono text-[#D8D8D4]">
                  {project.number}
                </span>
                <span className="text-sm font-medium text-[#111111]">
                  {project.title}
                </span>
              </div>

              {/* Image — scroll-linked clip-path reveal + scale */}
              <RevealImage
                src={project.image}
                alt={`${project.title} project screenshot`}
              />

              {/* Card body */}
              <div className="px-5 py-5 flex flex-col gap-5 flex-1">
                <p className="text-sm text-[#555550] leading-relaxed flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-[#555550] border border-[#D8D8D4] px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.href}
                  className="self-start text-xs border border-[#D8D8D4] text-[#555550] px-4 py-2 hover:border-[#1A4A2E] hover:text-[#1A4A2E] transition-colors"
                >
                  View project -&gt;
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
