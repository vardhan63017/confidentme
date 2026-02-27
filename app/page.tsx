import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ProgressSection } from "@/components/progress-section"
import { LiveSessionSection } from "@/components/live-session-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTAFooter } from "@/components/cta-footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ProgressSection />
      <LiveSessionSection />
      <TestimonialsSection />
      <CTAFooter />
    </main>
  )
}
