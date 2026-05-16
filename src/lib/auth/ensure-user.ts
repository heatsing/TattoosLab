import { Prisma } from "@prisma/client";
import { db as prisma } from "@/lib/db";
import { getAuth0Client, isAuth0Configured } from "@/lib/auth0";
import { ensureStarterCredits } from "@/lib/credits/usage";

type UserWithSubscription = Prisma.UserGetPayload<{
  include: { subscription: true };
}>;

type AuthIdentity = {
  userId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
};

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

function getDisplayName(user: {
  name?: string;
  nickname?: string;
  given_name?: string;
  family_name?: string;
}) {
  const fullName = [user.given_name, user.family_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return user.name?.trim() || fullName || user.nickname?.trim() || null;
}

async function getAuthenticatedIdentity(): Promise<AuthIdentity> {
  if (!isAuth0Configured) {
    throw new AuthSessionError(
      "AUTH_NOT_CONFIGURED",
      "Authentication is not configured.",
      503
    );
  }

  const auth0 = getAuth0Client();

  if (!auth0) {
    throw new AuthSessionError(
      "AUTH_NOT_CONFIGURED",
      "Authentication is not configured.",
      503
    );
  }

  const session = await auth0.getSession();
  const authUser = session?.user;

  if (!authUser?.sub) {
    throw new AuthSessionError(
      "UNAUTHORIZED",
      "You must be signed in to continue."
    );
  }

  const email = authUser.email?.trim().toLowerCase();

  if (!email) {
    throw new AuthSessionError(
      "EMAIL_REQUIRED",
      "Your account is missing a primary email address.",
      400
    );
  }

  return {
    userId: authUser.sub,
    email,
    name: getDisplayName(authUser),
    imageUrl: authUser.picture || null,
  };
}

export async function requireAuthenticatedUserId(): Promise<string> {
  const identity = await getAuthenticatedIdentity();
  return identity.userId;
}

export async function ensureDatabaseUser(userId?: string): Promise<UserWithSubscription> {
  const identity = await getAuthenticatedIdentity();
  const resolvedUserId = userId ?? identity.userId;

  if (resolvedUserId !== identity.userId) {
    throw new AuthSessionError(
      "UNAUTHORIZED",
      "You can only access your own account."
    );
  }

  const user = await prisma.user.upsert({
    where: { id: resolvedUserId },
    create: {
      id: resolvedUserId,
      email: identity.email,
      name: identity.name,
      imageUrl: identity.imageUrl,
      authProvider: "AUTH0",
    },
    update: {
      email: identity.email,
      name: identity.name,
      imageUrl: identity.imageUrl,
      authProvider: "AUTH0",
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