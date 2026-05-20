# Auth0 Frontend Login Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Auth0 web login feel like one consistent product flow from landing pages into the protected dashboard, with reliable user provisioning in Prisma.

**Architecture:** Keep Auth0 middleware as the browser session boundary, add one shared dashboard server layout that provisions the authenticated user early, and expose a shared client auth-availability context so navigation and auth pages make decisions from the same source of truth.

**Tech Stack:** Next.js App Router, TypeScript, Auth0 Next.js SDK, Prisma, React context, server components

---

### Task 1: Centralize web-auth runtime availability

**Files:**
- Create: `C:\Users\heats\Desktop\Tattoos Lab\src\components\auth-compat\runtime-provider.tsx`
- Modify: `C:\Users\heats\Desktop\Tattoos Lab\src\app\layout.tsx`
- Modify: `C:\Users\heats\Desktop\Tattoos Lab\src\components\auth-compat\index.tsx`
- Test: `npm run type-check -- --pretty false`

- [ ] **Step 1: Add a small client context for auth availability**

```tsx
"use client";

import { createContext, useContext } from "react";

const AuthAvailabilityContext = createContext(false);

export function AuthAvailabilityProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <AuthAvailabilityContext.Provider value={enabled}>
      {children}
    </AuthAvailabilityContext.Provider>
  );
}

export function useAuthAvailability() {
  return useContext(AuthAvailabilityContext);
}
```

- [ ] **Step 2: Wrap the app with the provider using the server-side auth configuration check**

```tsx
const isAuth0Enabled =
  process.env.NEXT_PUBLIC_AUTH0_ENABLED === "true" && isAuth0Configured;

return (
  <AuthAvailabilityProvider enabled={isAuth0Enabled}>
    {isAuth0Enabled ? <Auth0Provider>{content}</Auth0Provider> : content}
  </AuthAvailabilityProvider>
);
```

- [ ] **Step 3: Update `SignedIn`, `SignedOut`, and `UserButton` to read the shared provider instead of a raw env flag**

```tsx
const isAuth0Enabled = useAuthAvailability();
```

- [ ] **Step 4: Run the type check**

Run: `npm run type-check -- --pretty false`
Expected: PASS

### Task 2: Add one shared protected dashboard layout

**Files:**
- Create: `C:\Users\heats\Desktop\Tattoos Lab\src\app\(dashboard)\dashboard\layout.tsx`
- Modify: `C:\Users\heats\Desktop\Tattoos Lab\src\app\(dashboard)\dashboard\page.tsx`
- Modify: `C:\Users\heats\Desktop\Tattoos Lab\src\app\(dashboard)\dashboard\generate\layout.tsx`
- Modify: `C:\Users\heats\Desktop\Tattoos Lab\src\app\(dashboard)\dashboard\settings\layout.tsx`
- Modify: `C:\Users\heats\Desktop\Tattoos Lab\src\app\(dashboard)\dashboard\try-on\layout.tsx`
- Test: `npm run build`

- [ ] **Step 1: Create a root dashboard layout that provisions the authenticated user when web auth is enabled**

```tsx
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ensureDatabaseUser } from "@/lib/auth/ensure-user";
import { isAuth0Configured } from "@/lib/auth0";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isAuth0Configured) {
    await ensureDatabaseUser();
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Remove duplicated `Navbar` and `Footer` wrappers from the dashboard page and nested dashboard layouts**

```tsx
return (
  <div className="flex-1 p-6 lg:p-8">
    ...
  </div>
);
```

- [ ] **Step 3: Keep metadata-only nested layouts but return `children` directly**

```tsx
export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

- [ ] **Step 4: Run the production build**

Run: `npm run build`
Expected: PASS

### Task 3: Make sign-in and sign-up pages session-aware

**Files:**
- Modify: `C:\Users\heats\Desktop\Tattoos Lab\src\app\sign-in\page.tsx`
- Modify: `C:\Users\heats\Desktop\Tattoos Lab\src\app\sign-up\page.tsx`
- Modify: `C:\Users\heats\Desktop\Tattoos Lab\src\lib\auth0.ts`
- Test: manual login flow

- [ ] **Step 1: Make auth pages async server components and redirect authenticated users to `/dashboard`**

```tsx
const auth0 = getAuth0Client();
const session = auth0 ? await auth0.getSession() : null;

if (session?.user) {
  redirect("/dashboard");
}
```

- [ ] **Step 2: Read `returnTo` from search params, constrain it to relative in-app paths, and pass it through the Auth0 login link**

```tsx
const requestedReturnTo =
  typeof searchParams?.returnTo === "string" && searchParams.returnTo.startsWith("/")
    ? searchParams.returnTo
    : "/dashboard";
```

- [ ] **Step 3: Keep the disabled-auth fallback copy, but ensure it reflects missing web-auth config rather than generic auth state**

```tsx
Authentication is not configured. Add your Auth0 web application variables to enable sign in.
```

- [ ] **Step 4: Manually verify**

Manual steps:
- Visit `/sign-in` while signed out and confirm the CTA points to `/auth/login`
- Sign in and confirm you return to `/dashboard`
- Visit `/sign-in` again while signed in and confirm you are redirected to `/dashboard`

### Task 4: Verify the unified login loop end to end

**Files:**
- Verify existing runtime behavior in:
  - `C:\Users\heats\Desktop\Tattoos Lab\middleware.ts`
  - `C:\Users\heats\Desktop\Tattoos Lab\src\lib\auth\ensure-user.ts`
- Test: `npm run type-check -- --pretty false`
- Test: `npm run build`

- [ ] **Step 1: Re-check middleware behavior for protected routes and `returnTo` redirects**

```ts
loginUrl.searchParams.set(
  "returnTo",
  `${request.nextUrl.pathname}${request.nextUrl.search}`
);
```

- [ ] **Step 2: Confirm user provisioning still uses Auth0 `sub`, normalized email, and starter credits**

```ts
const user = await prisma.user.upsert({
  where: { id: resolvedUserId },
  ...
});
await ensureStarterCredits(resolvedUserId);
```

- [ ] **Step 3: Run final automated verification**

Run:
- `npm run type-check -- --pretty false`
- `npm run build`

Expected: both PASS

- [ ] **Step 4: Run final manual flow**

Manual steps:
- Open a public page and click `Sign In`
- Authenticate with Auth0
- Confirm `/dashboard` loads
- Confirm the Prisma `users` row exists or updates
- Use the shared nav account menu to sign out
- Re-open `/dashboard` and confirm redirect to login
