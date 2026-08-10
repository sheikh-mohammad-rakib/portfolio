// Phase 5 — Assembly
// page.tsx is a Server Component (no "use client") — all animation logic
// lives inside the individual "use client" section components.
// GSAP plugins are registered inside each component that uses them.

import Navbar         from "@/components/layout/Navbar";
import Footer         from "@/components/layout/Footer";
import Hero           from "@/components/sections/Hero";
import About          from "@/components/sections/About";
import Skills         from "@/components/sections/Skills";
import Projects       from "@/components/sections/Projects";
import Contact        from "@/components/sections/Contact";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Bracket mark: top-left accent that draws in as About enters */}
        <div className="px-8 md:px-16 pt-16 -mb-8">
          <SectionDivider variant="bracket" delay={0.1} />
        </div>

        <About />

        {/* Full-width horizontal rule draws in after About */}
        <SectionDivider variant="line" delay={0.2} />

        <Skills />

        {/* Full-width rule before Projects */}
        <SectionDivider variant="line" delay={0.1} />

        <Projects />

        {/* Corner closing mark — bottom-right, after Projects */}
        <div className="px-8 md:px-16 pb-8 flex justify-end -mt-8">
          <SectionDivider variant="corner" delay={0.1} />
        </div>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
