import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HH Goa 2026 Builder Studio",
  description: "Generate premium branded HH Goa 2026 profile frames and Builder ID Cards client-side in under 10 seconds. Get ready to show the world you are building in Goa!",
  keywords: ["HH Goa 2026", "Hacker House", "Goa", "Builder Card", "Profile Frame", "Event Badge", "Web3", "Developer Studio"],
  authors: [{ name: "HH Goa Team" }],
  openGraph: {
    title: "HH Goa 2026 Builder Studio",
    description: "Generate branded profile frames and Builder ID Cards in under 10 seconds client-side. See you in Goa!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 Builder Studio",
    description: "Generate branded profile frames and Builder ID Cards in under 10 seconds client-side. See you in Goa!",
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
