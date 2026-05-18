"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  authProvider: "AUTH0" | "LOCAL" | "CLERK";
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  creditBalance: number;
  subscription: {
    tier: "FREE" | "PRO" | "STUDIO";
    status: string;
    currentPeriodEnd: string;
    paymentProvider: "STRIPE" | "PAYPAL";
  } | null;
  counts: {
    generations: number;
    tryOnProjects: number;
    payments: number;
  };
};

type UsersResponse = {
  success: boolean;
  data?: {
    users: AdminUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    managementApiConfigured: boolean;
  };
  error?: string;
  code?: string;
};

type SyncConflict = {
  userId: string;
  email: string | null;
  reason: "EMAIL_CONFLICT" | "MISSING_EMAIL" | "MISSING_USER_ID";
  existingUserId?: string;
};

type SyncResponse = {
  success: boolean;
  data?: {
    fetched: number;
    created: number;
    updated: number;
    skipped: number;
    conflicts: SyncConflict[];
    page: number;
    perPage: number;
    total: number;
    managementApiConfigured: boolean;
  };
  error?: string;
  code?: string;
};

const PAGE_SIZE = 25;

function formatRelativeDate(value: string | null) {
  if (!value) {
    return "Never";
  }

  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

function getSubscriptionTone(subscription: AdminUser["subscription"]) {
  const value = subscription?.tier;

  if (value === "STUDIO") {
    return "bg-pink-500/20 text-pink-300";
  }

  if (value === "PRO") {
    return "bg-brand-500/20 text-brand-300";
  }

  return "text-white/60";
}

function getRoleTone(role: AdminUser["role"]) {
  return role === "ADMIN"
    ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
    : "border-white/10 text-white/60";
}

export function UsersAdminPanel({
  adminEmail,
}: {
  adminEmail: string;
}) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [managementApiConfigured, setManagementApiConfigured] = useState(false);
  const [lastSyncSummary, setLastSyncSummary] = useState<SyncResponse["data"] | null>(
    null
  );

  const pageSummary = useMemo(() => {
    const admins = users.filter((user) => user.role === "ADMIN").length;
    const paid = users.filter(
      (user) => user.subscription?.tier && user.subscription.tier !== "FREE"
    ).length;
    const totalCredits = users.reduce((sum, user) => sum + user.creditBalance, 0);

    return { admins, paid, totalCredits };
  }, [users]);

  useEffect(() => {
    void loadUsers(page, search);
  }, [page, search]);

  async function loadUsers(nextPage: number, nextSearch: string) {
    setIsLoading(true);
    setFatalError(null);

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(PAGE_SIZE),
      });

      if (nextSearch.trim()) {
        params.set("search", nextSearch.trim());
      }

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as UsersResponse;

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "Failed to load users.");
      }

      setUsers(payload.data.users);
      setTotalPages(payload.data.pagination.totalPages);
      setTotalUsers(payload.data.pagination.total);
      setManagementApiConfigured(payload.data.managementApiConfigured);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load admin users.";
      setFatalError(message);
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function handleRefresh() {
    const success = await loadUsers(page, search);

    if (success) {
      toast.success("User list refreshed.");
    }
  }

  async function handleSync() {
    setIsSyncing(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          limit: PAGE_SIZE,
          search: search.trim() || undefined,
        }),
      });

      const payload = (await response.json()) as SyncResponse;

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "Failed to sync Auth0 users.");
      }

      setManagementApiConfigured(payload.data.managementApiConfigured);
      setLastSyncSummary(payload.data);

      const conflictCount = payload.data.conflicts.length;
      toast.success(
        `Auth0 sync finished. ${payload.data.created} created, ${payload.data.updated} updated${conflictCount ? `, ${conflictCount} conflicts` : ""}.`
      );

      await loadUsers(page, search);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sync Auth0 users.";
      toast.error(message);
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Users in Database"
          value={String(totalUsers)}
          note={search ? `Filtered by "${search}"` : "All database users"}
        />
        <MetricCard
          icon={ShieldCheck}
          label="Admins on This Page"
          value={String(pageSummary.admins)}
          note={`Signed in as ${adminEmail}`}
        />
        <MetricCard
          icon={CreditCard}
          label="Paid Accounts on This Page"
          value={String(pageSummary.paid)}
          note="Pro + Studio users"
        />
        <MetricCard
          icon={Sparkles}
          label="Credits on This Page"
          value={String(pageSummary.totalCredits)}
          note="Current wallet balance"
        />
      </div>

      {!managementApiConfigured ? (
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
              <div>
                <CardTitle className="text-amber-100">
                  Auth0 Management API is not configured
                </CardTitle>
                <CardDescription className="mt-1 text-amber-100/75">
                  The page can still list Prisma users, but the sync button will not work
                  until `AUTH0_MANAGEMENT_*` variables are set in your environment.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-white">User Directory</CardTitle>
              <CardDescription>
                Search your Prisma users, then sync the current Auth0 page into the local
                database when needed.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
              <Button
                className="gap-2"
                onClick={handleSync}
                disabled={isSyncing || !managementApiConfigured}
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                Sync Auth0 Page
              </Button>
            </div>
          </div>
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 md:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by email, name, or user id"
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="outline">
              Apply Filters
            </Button>
            {search ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setPage(1);
                }}
              >
                Clear
              </Button>
            ) : null}
          </form>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastSyncSummary ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/75">
                <span>{lastSyncSummary.fetched} fetched</span>
                <span>{lastSyncSummary.created} created</span>
                <span>{lastSyncSummary.updated} updated</span>
                <span>{lastSyncSummary.skipped} skipped</span>
                <span>{lastSyncSummary.conflicts.length} conflicts</span>
              </div>
              {lastSyncSummary.conflicts.length ? (
                <div className="mt-3 space-y-2">
                  {lastSyncSummary.conflicts.slice(0, 5).map((conflict) => (
                    <div
                      key={`${conflict.userId}-${conflict.reason}`}
                      className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/85"
                    >
                      <span className="font-medium">{conflict.reason}</span>
                      {" | "}
                      {conflict.email || conflict.userId}
                      {conflict.existingUserId
                        ? ` already maps to ${conflict.existingUserId}`
                        : ""}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {fatalError ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {fatalError}
            </div>
          ) : null}

          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-brand-400" />
            </div>
          ) : users.length ? (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.06]"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-lg font-semibold text-white">
                          {user.name || user.email}
                        </p>
                        <Badge variant="outline" className={getRoleTone(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            user.subscription
                              ? getSubscriptionTone(user.subscription)
                              : "text-white/50"
                          }
                        >
                          {user.subscription?.tier || "FREE"}
                        </Badge>
                        <Badge variant="outline" className="border-white/10 text-white/50">
                          {user.authProvider}
                        </Badge>
                        {user.subscription?.paymentProvider ? (
                          <Badge variant="outline" className="border-white/10 text-white/50">
                            {user.subscription.paymentProvider}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 truncate text-sm text-white/55">{user.email}</p>
                      <p className="mt-2 break-all text-xs text-white/35">{user.id}</p>
                    </div>

                    <div className="grid min-w-[280px] gap-3 sm:grid-cols-2 xl:w-[360px]">
                      <StatPill label="Credits" value={String(user.creditBalance)} />
                      <StatPill
                        label="Generations"
                        value={String(user.counts.generations)}
                        icon={Wand2}
                      />
                      <StatPill
                        label="Try-on Projects"
                        value={String(user.counts.tryOnProjects)}
                      />
                      <StatPill
                        label="Payments"
                        value={String(user.counts.payments)}
                        icon={CreditCard}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-white/60 md:grid-cols-3">
                    <MetaLine label="Created" value={formatRelativeDate(user.createdAt)} />
                    <MetaLine
                      label="Last Login"
                      value={formatRelativeDate(user.lastLoginAt)}
                    />
                    <MetaLine
                      label="Subscription Status"
                      value={user.subscription?.status || "No subscription"}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
              <Users className="mx-auto mb-4 h-10 w-10 text-white/20" />
              <h3 className="text-lg font-medium text-white">No matching users</h3>
              <p className="mt-2 text-sm text-white/60">
                Try a broader search, or run a sync to pull the latest Auth0 users into
                Prisma.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/45">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="gap-2"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                disabled={page >= totalPages || isLoading}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-white/55">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
            <p className="mt-2 text-xs text-white/35">{note}</p>
          </div>
          <div className="rounded-xl bg-white/8 p-3">
            <Icon className="h-5 w-5 text-brand-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatPill({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Users;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-white/35">{label}</p>
        {Icon ? <Icon className="h-3.5 w-3.5 text-white/30" /> : null}
      </div>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/20 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-white/30">{label}</p>
      <p className="mt-1 text-sm text-white/70">{value}</p>
    </div>
  );
}
