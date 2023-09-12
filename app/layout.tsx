import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProviders from "./query-providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Mentoring Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignInUrl="/roadmaps">
      <html className="!h-auto" lang="en">
        <body className={inter.className}>
          <QueryProviders>
            {children}
            <Toaster />
          </QueryProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
