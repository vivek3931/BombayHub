import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CoreValues } from "@/components/CoreValues";
import { TrendGrid } from "@/components/TrendGrid";
import { PlacesPreview } from "@/components/PlacesPreview";
import { LivePulse } from "@/components/LivePulse";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-taxi-yellow selection:text-asphalt-black">
      <Navbar />
      <Hero />
      <CoreValues />
      <TrendGrid />
      <LivePulse />
      <PlacesPreview />
      <Footer />
    </main>
  );
}
