import { redirect } from "next/navigation";
import { AuthEntryCard } from "@/components/auth-compat/auth-entry-card";
import { getAuth0Client, isAuth0Configured } from "@/lib/auth0";
import { getSafeReturnToPath } from "@/lib/auth/return-to";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{
    returnTo?: string | string[];
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const returnTo = getSafeReturnToPath(
    resolvedSearchParams?.returnTo,
    "/dashboard"
  );
  const auth0 = getAuth0Client();
  const session = auth0 ? await auth0.getSession() : null;

  if (session?.user) {
    redirect(returnTo);
  }

  return (
    <AuthEntryCard
      mode="sign-in"
      authHref={`/auth/login?returnTo=${encodeURIComponent(returnTo)}`}
      isConfigured={isAuth0Configured}
    />
  );
}
