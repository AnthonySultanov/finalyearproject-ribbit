"use client";

import { useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DatabaseError } from "@/components/ui/database-error";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  const isDatabaseError = error.message.includes("Can't reach database server") || 
                         error.message.includes("Connection refused") ||
                         error.message.includes("database");

  if (isDatabaseError) {
    return <DatabaseError onRetry={reset} />;
  }

  return (
    <div className="h-full flex flex-col space-y-4 items-center justify-center text-muted-foreground">
      <h1 className="text-2xl">Something went wrong</h1>
      {error.digest && (
        <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
      )}
      <div className="flex space-x-4">
        <Button onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
