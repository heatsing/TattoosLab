"use client";

import React from "react";
import {
  SignedIn as ClerkSignedIn,
  SignedOut as ClerkSignedOut,
  UserButton as ClerkUserButton,
} from "@clerk/nextjs";

// Check if Clerk key is a real key or just a placeholder
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey =
  clerkKey && !clerkKey.includes("...") && clerkKey.length > 20;

export function SignedIn({ children }: { children?: React.ReactNode }) {
  if (!hasValidClerkKey) return null;
  return <ClerkSignedIn>{children}</ClerkSignedIn>;
}

export function SignedOut({ children }: { children?: React.ReactNode }) {
  if (!hasValidClerkKey) return <>{children}</>;
  return <ClerkSignedOut>{children}</ClerkSignedOut>;
}

export function UserButton(props: any) {
  if (!hasValidClerkKey) {
    return (
      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60">
        ?
      </div>
    );
  }
  return <ClerkUserButton {...props} />;
}
