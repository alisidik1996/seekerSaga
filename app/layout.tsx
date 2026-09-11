import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeekerSaga — The Occult Nexus & Cosmic Horror Portal",
  description: "Antologi petualangan interaktif horor okultisme dan cosmic horror. Buka 3 segel misteri untuk mengklaim peti relikui voucher.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-neutral-950 text-slate-200 min-h-screen relative selection:bg-occult-crimson selection:text-white font-sans antialiased overflow-x-hidden">
        <div className="fixed inset-0 scanlines z-50 pointer-events-none opacity-30"></div>
        {children}
      </body>
    </html>
  );
}
