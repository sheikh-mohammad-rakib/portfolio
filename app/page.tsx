// Phase 5 — Assembly
// page.tsx is a Server Component (no "use client") — all animation logic
// lives inside the individual "use client" section components.
// GSAP plugins are registered inside each component that uses them.

import Navbar   from "@/components/layout/Navbar";
import Footer   from "@/components/layout/Footer";
import Hero     from "@/components/sections/Hero";
import About    from "@/components/sections/About";
import Skills   from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact  from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
