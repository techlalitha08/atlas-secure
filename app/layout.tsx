import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Atlas Secure — Predict. Verify. Protect.",
  description: "AI-powered Digital Trust Platform. Can you trust this website, email, QR, APK, voice, or document? Atlas Secure answers with multi-agent AI analysis.",
  keywords: ["cybersecurity", "digital trust", "AI security", "phishing detection", "deepfake detection"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050508] text-white">{children}</body>
    </html>
  );
}
