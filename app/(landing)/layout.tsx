import LandingFooter from "@/components/landing/landing-footer";
import LandingHeader from "@/components/landing/landing-header";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-lighter-blue-gray overflow-auto relative">
      <LandingHeader />
      <div className="mx-auto max-w-screen-xl h-full w-full">{children}</div>
      <LandingFooter />
    </main>
  );
}
