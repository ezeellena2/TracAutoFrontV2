import { LandingNavbar } from '../components/LandingNavbar'
import { LandingHero } from '../components/LandingHero'
import { LandingLogos } from '../components/LandingLogos'
import { LandingModules } from '../components/LandingModules'
import { LandingB2C } from '../components/LandingB2C'
import { LandingSteps } from '../components/LandingSteps'
import { LandingPricing } from '../components/LandingPricing'
import { LandingTestimonials } from '../components/LandingTestimonials'
import { LandingCta } from '../components/LandingCta'
import { LandingFooter } from '../components/LandingFooter'

/**
 * Landing page publica — replica fiel del mockup landing/index.html.
 * Secciones: navbar, hero, logos, modulos B2B, B2C, pasos, pricing, testimonios, CTA, footer.
 */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <LandingNavbar />
      <LandingHero />
      <LandingLogos />
      <LandingModules />
      <LandingB2C />
      <LandingSteps />
      <LandingPricing />
      <LandingTestimonials />
      <LandingCta />
      <LandingFooter />
    </div>
  )
}
