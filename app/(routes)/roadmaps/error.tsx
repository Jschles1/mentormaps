"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="text-lg h-full w-full text-gray font-bold flex items-center justify-center">
      <div className="flex flex-col w-[300px] items-center gap-y-4">
        <h2>Something went wrong!</h2>
        <Button onClick={() => reset()}>Try Again</Button>
      </div>
    </div>
  );
}
