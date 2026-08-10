import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Playfair Display: display / hero headings and logotype only
const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

// Inter: all body text, labels, and UI controls
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Sheikh Mohammad Rakib — Full Stack Creative Developer",
  description:
    "Portfolio of Sheikh Mohammad Rakib — a Full Stack Creative Developer who builds thoughtful digital experiences at the intersection of clean code and compelling design.",
  keywords: [
    "Full Stack Developer",
    "Creative Developer",
    "Next.js",
    "React",
    "GSAP",
    "Motion",
    "Portfolio",
  ],
  authors: [{ name: "Sheikh Mohammad Rakib" }],
  openGraph: {
    title: "Sheikh Mohammad Rakib — Full Stack Creative Developer",
    description:
      "Portfolio of Sheikh Mohammad Rakib — a Full Stack Creative Developer.",
    type: "website",
  },
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

