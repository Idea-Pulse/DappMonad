"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

interface PrivyAuthGuardProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export const PrivyAuthGuard = ({ children, fallbackUrl = "/" }: PrivyAuthGuardProps) => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push(fallbackUrl);
    }
  }, [ready, authenticated, router, fallbackUrl]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect, no need to render anything
  }

  return <>{children}</>;
} 