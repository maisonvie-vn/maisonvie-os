import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maison Vie Operating System",
  description: "Core operating system and operations dashboard for Maison Vie French Neoclassical Villa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased font-sans min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="w-full border-t border-gold-border py-6 text-center text-xs text-foreground/50">
          <div className="font-serif-cormorant tracking-widest text-gold mb-1">MAISON VIE OS</div>
          © {new Date().getFullYear()} Maison Vie. All rights reserved. Neoclassical System Interface.
        </footer>
      </body>
    </html>
  );
}
