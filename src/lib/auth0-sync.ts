import { db as prisma } from "@/lib/db";
import {
  type Auth0ManagementUser,
  listAuth0Users,
  type ListAuth0UsersOptions,
} from "@/lib/auth0-management";

type SyncUserStatus = "created" | "updated" | "skipped" | "conflict";

type SyncConflict = {
  userId: string;
  email: string | null;
  reason: "EMAIL_CONFLICT" | "MISSING_EMAIL" | "MISSING_USER_ID";
  existingUserId?: string;
};

type SyncUserResult = {
  status: SyncUserStatus;
  userId: string;
  email: string | null;
  existingUserId?: string;
  reason?: SyncConflict["reason"];
};

export type SyncAuth0UsersResult = {
  fetched: number;
  created: number;
  updated: number;
  skipped: number;
  conflicts: SyncConflict[];
  page: number;
  perPage: number;
  total: number;
};

function getDisplayName(user: Auth0ManagementUser) {
  const fullName = [user.given_name, user.family_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return user.name?.trim() || fullName || user.nickname?.trim() || null;
}

function toOptionalDate(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function syncAuth0UserToDatabase(
  auth0User: Auth0ManagementUser
): Promise<SyncUserResult> {
  const userId = auth0User.user_id?.trim();

  if (!userId) {
    return {
      status: "skipped",
      userId: "",
      email: null,
      reason: "MISSING_USER_ID",
    };
  }

  const email = auth0User.email?.trim().toLowerCase() || null;

  if (!email) {
    return {
      status: "skipped",
      userId,
      email: null,
      reason: "MISSING_EMAIL",
    };
  }

  const matches = await prisma.user.findMany({
    where: {
      OR: [{ id: userId }, { email }],
    },
    select: {
      id: true,
      email: true,
    },
  });

  const userById = matches.find((candidate) => candidate.id === userId);
  const userByEmail = matches.find((candidate) => candidate.email === email);

  if (userByEmail && userByEmail.id !== userId) {
    return {
      status: "conflict",
      userId,
      email,
      existingUserId: userByEmail.id,
      reason: "EMAIL_CONFLICT",
    };
  }

  const data = {
    email,
    name: getDisplayName(auth0User),
    imageUrl: auth0User.picture || null,
    authProvider: "AUTH0" as const,
    lastLoginAt: toOptionalDate(auth0User.last_login),
  };

  if (userById) {
    await prisma.user.update({
      where: { id: userId },
      data,
    });

    return {
      status: "updated",
      userId,
      email,
    };
  }

  await prisma.user.create({
    data: {
      id: userId,
      ...data,
      createdAt: toOptionalDate(auth0User.created_at) ?? undefined,
    },
  });

  return {
    status: "created",
    userId,
    email,
  };
}

export async function syncAuth0UsersToDatabase(
  options: ListAuth0UsersOptions = {}
): Promise<SyncAuth0UsersResult> {
  const auth0Page = await listAuth0Users(options);
  const conflicts: SyncConflict[] = [];

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const auth0User of auth0Page.users) {
    const result = await syncAuth0UserToDatabase(auth0User);

    if (result.status === "created") {
      created += 1;
      continue;
    }

    if (result.status === "updated") {
      updated += 1;
      continue;
    }

    skipped += 1;

    if (result.status === "conflict" || result.reason) {
      conflicts.push({
        userId: result.userId,
        email: result.email,
        reason: result.reason ?? "EMAIL_CONFLICT",
        existingUserId: result.existingUserId,
      });
    }
  }

  return {
    fetched: auth0Page.users.length,
    created,
    updated,
    skipped,
    conflicts,
    page: auth0Page.page + 1,
    perPage: auth0Page.perPage,
    total: auth0Page.total,
  };
}
