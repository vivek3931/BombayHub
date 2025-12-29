import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { LenisScroll } from "@/components/LenisScroll"; // We will create this

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BombayHub | The Spirit of Mumbai",
  description: "A digital twin of the Maximum City. Real-time weather, news, and vibes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bebasNeue.variable} antialiased bg-asphalt-black text-white`}
      >
        <div className="noise-overlay" />
        <LenisScroll />
        {children}
      </body>
    </html>
  );
}
