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
import { Architecture } from "@/components/site/architecture";
import { TrustCenter } from "@/components/site/trust-center";
import { MemoryPassport } from "@/components/site/memory-passport";
import { UseCases } from "@/components/site/use-cases";
import { Signals } from "@/components/site/signals";
import { Metrics } from "@/components/site/metrics";
import { Glossary } from "@/components/site/glossary";
import { Pricing } from "@/components/site/pricing";
import { FAQ } from "@/components/site/faq";
import { Changelog } from "@/components/site/changelog";
import { FinalCTA } from "@/components/site/final-cta";
import { Footer } from "@/components/site/footer";
import { LazySection } from "@/components/site/lazy-section";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navigation />
      <CommandPalette />
      <main className="flex-1">
        {/* Above the fold + first few sections: render immediately */}
        <Hero />
        <Traction />
        <Problem />
        <WhereItFits />
        <ComparisonMatrix />
        <Engines />
        <HowItWorks />
        <LiveDemo />
        <Developers />

        {/* Below the fold: lazy-render for faster first paint */}
        <LazySection id="onboarding-wrap" minHeight={500}>
          <Onboarding />
        </LazySection>
        <LazySection id="production-wrap" minHeight={600}>
          <Production />
        </LazySection>
        <LazySection id="architecture-wrap" minHeight={600}>
          <Architecture />
        </LazySection>
        <LazySection id="trust-wrap" minHeight={600}>
          <TrustCenter />
        </LazySection>
        <LazySection id="passport-wrap" minHeight={600}>
          <MemoryPassport />
        </LazySection>
        <LazySection id="use-cases-wrap" minHeight={500}>
          <UseCases />
        </LazySection>
        <LazySection id="signals-wrap" minHeight={400}>
          <Signals />
        </LazySection>
        <LazySection id="metrics-wrap" minHeight={500}>
          <Metrics />
        </LazySection>
        <LazySection id="glossary-wrap" minHeight={500}>
          <Glossary />
        </LazySection>
        <LazySection id="pricing-wrap" minHeight={500}>
          <Pricing />
        </LazySection>
        <LazySection id="faq-wrap" minHeight={500}>
          <FAQ />
        </LazySection>
        <LazySection id="changelog-wrap" minHeight={500}>
          <Changelog />
        </LazySection>
        <LazySection id="cta-wrap" minHeight={400}>
          <FinalCTA />
        </LazySection>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
