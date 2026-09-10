import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/shared/providers/app-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexus-messenger.example"),
  title: {
    default: "Nexus — corporate messenger for focused teams",
    template: "%s · Nexus",
  },
  description:
    "A Slack-style workspace messenger with roles, a real API, TanStack Query, and a three-column dark UI.",
  keywords: [
    "corporate messenger",
    "slack alternative",
    "react",
    "next.js",
    "tanstack query",
  ],
  openGraph: {
    title: "Nexus — corporate messenger",
    description:
      "Three-column workspace chat with channels, DMs, presence, and role-based permissions.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
