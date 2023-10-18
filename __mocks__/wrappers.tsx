import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";

const queryClient = new QueryClient({
  logger: {
    log: console.log,
    warn: console.warn,
    // ✅ no more errors on the console for tests
    error: process.env.NODE_ENV === "test" ? () => {} : console.error,
  },
});

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ClerkProvider>
);