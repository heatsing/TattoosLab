"use client";

import * as React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LogOut, Settings } from "lucide-react";
import { useAuthAvailability } from "@/components/auth-compat/runtime-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SignedIn({ children }: { children?: React.ReactNode }) {
  const isAuth0Enabled = useAuthAvailability();
  const { user, isLoading } = useUser();

  if (!isAuth0Enabled || isLoading || !user) {
    return null;
  }

  return <>{children}</>;
}

export function SignedOut({ children }: { children?: React.ReactNode }) {
  const isAuth0Enabled = useAuthAvailability();
  const { user, isLoading } = useUser();

  if (!isAuth0Enabled) {
    return <>{children}</>;
  }

  if (isLoading || user) {
    return null;
  }

  return <>{children}</>;
}

type UserButtonProps = {
  afterSignOutUrl?: string;
  appearance?: {
    elements?: {
      avatarBox?: string;
    };
  };
};

export function UserButton({
  afterSignOutUrl = "/",
  appearance,
}: UserButtonProps) {
  const isAuth0Enabled = useAuthAvailability();
  const { user, isLoading } = useUser();

  if (!isAuth0Enabled || isLoading || !user) {
    return (
      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60">
        ?
      </div>
    );
  }

  const avatarClassName =
    appearance?.elements?.avatarBox ||
    "h-8 w-8 rounded-full object-cover";

  const displayName = user.name || user.nickname || user.email || "Account";
  const logoutHref = `/auth/logout?returnTo=${encodeURIComponent(afterSignOutUrl)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full border border-white/10 bg-white/5 p-0.5 transition-colors hover:border-white/20 hover:bg-white/10"
          aria-label="Open account menu"
        >
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.picture}
              alt={displayName}
              className={avatarClassName}
            />
          ) : (
            <div className={`${avatarClassName} flex items-center justify-center bg-white/10 text-xs text-white`}>
              {displayName.slice(0, 1).toUpperCase()}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 border-white/10 bg-black/95 text-white">
        <DropdownMenuLabel className="space-y-1">
          <div className="text-sm font-medium text-white">{displayName}</div>
          {user.email ? (
            <div className="text-xs font-normal text-white/50">{user.email}</div>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 focus:text-white">
          <Link href="/dashboard/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Account Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 focus:text-white">
          <a href={logoutHref} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
