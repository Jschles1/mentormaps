import Navigation from "@/components/navigation/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full min-h-screen flex flex-col bg-lighter-blue-gray relative">
      <Navigation />
      {children}
    </div>
  );
}
