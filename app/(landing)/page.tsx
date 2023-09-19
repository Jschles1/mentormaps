import LandingContent from "@/components/landing/landing-content";
import LandingHero from "@/components/landing/landing-hero";

export default function LandingPage() {
  return (
    <div className="h-full">
      <LandingHero />
      <LandingContent />
    </div>
  );
}
