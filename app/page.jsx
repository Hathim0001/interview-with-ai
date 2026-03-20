import HeroSection from "@/components/landing/HeroSection";
import LogosSection from "@/components/landing/LogosSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import RolesSection from "@/components/landing/RolesSection";
import CTASection from "@/components/landing/CTASection";

/**
 * Public landing page.
 *
 * Composed of isolated section components so each can be developed,
 * tested, and reasoned about independently.
 */
export default function LandingPage() {
  return (
    <div className="bg-black overflow-x-hidden">
      <HeroSection />
      <LogosSection />
      <FeaturesSection />
      <RolesSection />
      <CTASection />
    </div>
  );
}
