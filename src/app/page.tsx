import { Navigation } from "@/components/site/navigation";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { BackToTop } from "@/components/site/back-to-top";
import { CommandPalette } from "@/components/site/command-palette";
import { Hero } from "@/components/site/hero";
import { Traction } from "@/components/site/traction";
import { Problem } from "@/components/site/problem";
import { WhereItFits } from "@/components/site/where-it-fits";
import { ComparisonMatrix } from "@/components/site/comparison-matrix";
import { Engines } from "@/components/site/engines";
import { HowItWorks } from "@/components/site/how-it-works";
import { LiveDemo } from "@/components/site/live-demo";
import { Developers } from "@/components/site/developers";
import { Onboarding } from "@/components/site/onboarding";
import { Production } from "@/components/site/production";
import { MemoryPassport } from "@/components/site/memory-passport";
import { UseCases } from "@/components/site/use-cases";
import { Pricing } from "@/components/site/pricing";
import { FAQ } from "@/components/site/faq";
import { FinalCTA } from "@/components/site/final-cta";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navigation />
      <CommandPalette />
      <main className="flex-1">
        <Hero />
        <Traction />
        <Problem />
        <WhereItFits />
        <ComparisonMatrix />
        <Engines />
        <HowItWorks />
        <LiveDemo />
        <Developers />
        <Onboarding />
        <Production />
        <MemoryPassport />
        <UseCases />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
