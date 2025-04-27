'use client';

import { useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="h-screen flex flex-col space-y-4 items-center justify-center text-muted-foreground">
          <h1 className="text-4xl">Something went wrong!</h1>
          <p className="text-lg">We're sorry for the inconvenience</p>
          <div className="flex space-x-4">
            <Button onClick={() => reset()}>
              Try again
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/">Go back home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}