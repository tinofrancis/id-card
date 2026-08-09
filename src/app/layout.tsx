import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HH Goa 2026 | Official Builder ID & Profile Frame Customizer",
  description: "Claim your official HH Goa 2026 digital builder pass and profile frame. Built for hackers worldwide.",
  keywords: ["HH Goa 2026", "Hacker House", "Goa", "Builder Pass", "Profile Frame", "Developer Badge", "Coastal Hackathon", "Creative Technologist"],
  authors: [{ name: "HH Goa 2026 Creative Team" }],
  openGraph: {
    title: "HH Goa 2026 | Official Builder ID & Profile Frame Customizer",
    description: "Claim your official HH Goa 2026 digital builder pass and profile frame. Built for hackers worldwide.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 | Official Builder ID & Profile Frame Customizer",
    description: "Claim your official HH Goa 2026 digital builder pass and profile frame. Built for hackers worldwide.",
    creator: "@HHGoa2026",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-[#ff5e62]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
