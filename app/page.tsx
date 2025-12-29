import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { ExplorerMap } from "@/components/ExplorerMap";
import { VibeGrid } from "@/components/VibeGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-asphalt-black text-white selection:bg-taxi-yellow selection:text-asphalt-black">
      <Navbar />
      <Hero />
      <Dashboard />
      <ExplorerMap />
      <VibeGrid />
      <Footer />
    </main>
  );
}
