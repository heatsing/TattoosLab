import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { db as prisma } from "@/lib/db";
import { ensureStarterCredits } from "@/lib/credits/usage";

type UserWithSubscription = Prisma.UserGetPayload<{
  include: { subscription: true };
}>;

export class AuthSessionError extends Error {
  status: number;
  code: string;

  constructor(
    code: string,
    message: string,
    status: number = 401
  ) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function getPrimaryEmail(clerkUser: Awaited<ReturnType<typeof currentUser>>) {
  if (!clerkUser) {
    return null;
  }

  const primaryEmailId = clerkUser.primaryEmailAddressId;
  const primaryEmail =
    clerkUser.emailAddresses.find((email) => email.id === primaryEmailId) ??
    clerkUser.emailAddresses[0];

  return primaryEmail?.emailAddress ?? null;
}

function getDisplayName(clerkUser: Awaited<ReturnType<typeof currentUser>>) {
  if (!clerkUser) {
    return null;
  }

  const fullName = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || clerkUser.username || null;
}

async function getClerkUser(userId: string) {
  const activeUser = await currentUser();
  if (activeUser?.id === userId) {
    return activeUser;
  }

  const client = await clerkClient();
  return client.users.getUser(userId);
}

export async function requireAuthenticatedUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new AuthSessionError(
      "UNAUTHORIZED",
      "You must be signed in to continue."
    );
  }

  return userId;
}

export async function ensureDatabaseUser(userId?: string): Promise<UserWithSubscription> {
  const resolvedUserId = userId ?? (await requireAuthenticatedUserId());
  const clerkUser = await getClerkUser(resolvedUserId);
  const email = getPrimaryEmail(clerkUser);

  if (!email) {
    throw new AuthSessionError(
      "EMAIL_REQUIRED",
      "Your account is missing a primary email address.",
      400
    );
  }

  const name = getDisplayName(clerkUser);

  const user = await prisma.user.upsert({
    where: { id: resolvedUserId },
    create: {
      id: resolvedUserId,
      email,
      name,
      imageUrl: clerkUser.imageUrl || null,
    },
    update: {
      email,
      name,
      imageUrl: clerkUser.imageUrl || null,
    },
    include: {
      subscription: true,
    },
  });

  await ensureStarterCredits(resolvedUserId);

  return user;
}

export async function requireDatabaseUser(): Promise<UserWithSubscription> {
  const userId = await requireAuthenticatedUserId();
  return ensureDatabaseUser(userId);
}