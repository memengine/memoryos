import { Navigation } from "@/components/site/navigation";
import { Hero } from "@/components/site/hero";
import { Problem } from "@/components/site/problem";
import { WhereItFits } from "@/components/site/where-it-fits";
import { Engines } from "@/components/site/engines";
import { HowItWorks } from "@/components/site/how-it-works";
import { LiveDemo } from "@/components/site/live-demo";
import { Developers } from "@/components/site/developers";
import { Production } from "@/components/site/production";
import { MemoryPassport } from "@/components/site/memory-passport";
import { UseCases } from "@/components/site/use-cases";
import { FinalCTA } from "@/components/site/final-cta";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        <Hero />
        <Problem />
        <WhereItFits />
        <Engines />
        <HowItWorks />
        <LiveDemo />
        <Developers />
        <Production />
        <MemoryPassport />
        <UseCases />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
