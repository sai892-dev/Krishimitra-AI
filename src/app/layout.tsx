import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KrishiMitra AI | Smart Farming for Andhra Pradesh",
  description:
    "AI-powered agriculture platform for AP farmers — crop health, schemes, market prices, and direct selling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${sourceSerif.variable} antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
