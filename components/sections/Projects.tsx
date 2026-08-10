"use client";

// Scroll Image Reveal + Tilt Card — Projects section
// Motion MCP confirmed APIs:
//   Tilt card:    motion, useSpring (grade: A) — https://examples.motion.dev/react/tilt-card
//   Image reveal: motion, useScroll, useTransform (grade: A) — https://examples.motion.dev/react/scroll-image-reveal
// GSAP: staggered card entry on scroll (preserved)

import { useRef, MouseEvent } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "motion/react";
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
    href:        "#",
  },
  {
    id:          2,
    number:      "02",
    title:       "Bloom Commerce",
    description: "A full-stack e-commerce storefront with custom cart logic, Stripe integration, and a headless CMS for product management.",
    tags:        ["React", "Node.js", "Stripe"],
    image:       "/images/projects/project-2.png",
    href:        "#",
  },
  {
    id:          3,
    number:      "03",
    title:       "Canvas Agency",
    description: "A motion-rich marketing site for a creative studio. Built with GSAP ScrollTrigger for scroll-driven storytelling and Motion for micro-interactions.",
    tags:        ["GSAP", "Motion", "Next.js"],
    image:       "/images/projects/project-3.png",
    href:        "#",
  },
];

// ── RevealImage: per-image scroll-linked clip reveal ─────────────────────────
// Isolated so each image has its own scroll MotionValues (no cross-card sharing).
// Motion best-practices: MotionValues only used in useTransform/style, never in render.
function RevealImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Curtain: slides up revealing image as it enters viewport (0–40% travel)
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.4],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );

  // Image starts zoomed in (1.12) and settles to 1.0 with the reveal
  const revealScale = useTransform(scrollYProgress, [0, 0.4], [1.12, 1]);

  return (
    <div
      ref={containerRef}
      className="aspect-[4/3] overflow-hidden bg-[#F0F0EC] relative"
    >
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        {/* revealScale from scroll — whileHover scale layered on top via motion */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: revealScale }}
          whileHover={{ scale: 1.04 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
          }}
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

// ── TiltCard: 3D perspective tilt toward the pointer using useSpring ──────────
// MCP confirmed pattern: motion + useSpring (tilt-card example, grade A).
// useSpring adds natural physics so the tilt doesn't snap instantly.
// Motion best-practices: useMotionValue for x/y, never read .get() in render.
// Tilt is applied on the CARD wrapper — RevealImage (clipPath/scale) and
// whileHover image scale are on INNER elements — no property conflicts.
function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Raw pointer position MotionValues
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smoothed tilt values — stiffness/damping tuned for editorial feel
  // (less bouncy than the default; subtle and controlled)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 25,
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalize pointer to -0.5 → +0.5 range relative to card bounds
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
  }

  function handleMouseLeave() {
    // Spring back to center on leave — useSpring animates this automatically
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,  // perspective on the element itself (no parent needed)
      }}
      // transformOrigin center — tilt pivots from card center
      className="bg-[#F8F8F6] flex flex-col" // same classes as the original card div
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  // ── GSAP: staggered card entry (opacity + y) — runs once on scroll ────────
  // GSAP owns opacity + translateY on [data-project-card].
  // Motion tilt owns rotateX + rotateY. Different properties — no conflict.
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

        <p className="text-xs font-sans font-medium uppercase tracking-widest text-[#555550] mb-14">
          {SECTION_LABEL}
        </p>

        {/* gap-px tiled grid — Design.md §4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D8D8D4] border border-[#D8D8D4]">
          {PROJECTS.map((project) => (
            // data-project-card: GSAP targets this for entry animation
            // TiltCard wraps the inner content — GSAP's y/opacity + Motion's rotateX/Y = no conflict
            <div
              key={project.id}
              data-project-card
            >
              <TiltCard>
                {/* Card header */}
                <div className="px-5 py-4 border-b border-[#D8D8D4] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#D8D8D4]">
                    {project.number}
                  </span>
                  <span className="text-sm font-medium text-[#111111]">
                    {project.title}
                  </span>
                </div>

                {/* Image — scroll clip reveal + whileHover scale (both kept) */}
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
              </TiltCard>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
