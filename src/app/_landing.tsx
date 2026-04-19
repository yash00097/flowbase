import { Capabilities } from "@/components/marketing/capabilities";
import { CodePreview } from "@/components/marketing/code-preview";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Integrations } from "@/components/marketing/integrations";
import { Nav } from "@/components/marketing/nav";
import { Problem } from "@/components/marketing/problem";
import { SocialStrip } from "@/components/marketing/social-strip";

export default function Landing() {
  return (
    <div className="fb-landing relative min-h-screen bg-[color:var(--fb-paper)] text-[color:var(--fb-ink)] selection:bg-[color:var(--fb-accent)]/25 selection:text-[color:var(--fb-ink)]">
      <div
        aria-hidden="true"
        className="fb-grid-bg pointer-events-none fixed inset-0 z-0 opacity-[0.55]"
      />
      <div
        aria-hidden="true"
        className="fb-grid-vignette pointer-events-none fixed inset-0 z-0"
      />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <SocialStrip />
          <Problem />
          <Capabilities />
          <HowItWorks />
          <Integrations />
          <CodePreview />
        </main>
        <Footer />
      </div>
    </div>
  );
}
