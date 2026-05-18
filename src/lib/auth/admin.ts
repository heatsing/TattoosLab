import { requireDatabaseUser, AuthSessionError } from "@/lib/auth/ensure-user";

export async function requireAdminUser() {
  const user = await requireDatabaseUser();

  if (user.role !== "ADMIN") {
    throw new AuthSessionError(
      "FORBIDDEN",
      "Administrator access is required.",
      403
    );
  }

  return user;
}
