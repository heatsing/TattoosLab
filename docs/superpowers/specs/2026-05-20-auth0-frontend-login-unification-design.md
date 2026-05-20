# Auth0 Frontend Login Unification Design

Date: 2026-05-20
Project: Tattoos Lab
Scope: Complete the frontend authentication loop for the existing `GitHub + Vercel + Supabase + Auth0` stack without changing the billing or database model.

## Context

The project already has three relevant layers in place:

1. Auth0 web authentication primitives exist in [C:\Users\heats\Desktop\Tattoos Lab\src\lib\auth0.ts](C:\Users\heats\Desktop\Tattoos%20Lab\src\lib\auth0.ts).
2. Database user provisioning exists in [C:\Users\heats\Desktop\Tattoos Lab\src\lib\auth\ensure-user.ts](C:\Users\heats\Desktop\Tattoos%20Lab\src\lib\auth\ensure-user.ts).
3. Auth0 Management API and Supabase wrapper support now exist for admin and operational access.

What is still missing is the user-facing login loop: a consistent sign-in/sign-up entry point, stable protected-route handling, post-login user provisioning, and visible session controls in the app shell.

## Goal

Unify the frontend authentication experience so that a new user can:

1. Start from the website or dashboard entry points.
2. Sign in or sign up with Auth0.
3. Return to the intended page.
4. Automatically create or update their Prisma `users` row.
5. Use protected dashboard features without inconsistent redirects.
6. Sign out from a visible, shared navigation point.

## Non-Goals

- Replacing Auth0 with another provider.
- Redesigning the visual style of the app.
- Reworking billing, credits, subscriptions, or admin data models.
- Migrating existing historical Clerk identities in this phase.
- Switching runtime data access away from Prisma.

## Recommended Approach

Use the existing Auth0 Next.js SDK as the single web-session source of truth and tighten the surrounding app behavior around it.

This keeps the architecture simple:

- Auth0 handles browser login, logout, callback, and session cookies.
- Next.js middleware decides whether a route requires authentication.
- Server-side user provisioning runs from the authenticated session using `ensureDatabaseUser()`.
- Shared navigation exposes the current session state to the user.

This is lower risk than introducing a second auth path or custom token orchestration because the project already depends on Auth0 SDK behavior in middleware and server code.

## Architecture

### 1. Session Source of Truth

`Auth0Client` remains the only browser-auth session provider for the web app.

Rules:

- If Auth0 web configuration is incomplete, the app should behave as "auth disabled" and avoid broken login links.
- If Auth0 web configuration is complete, all protected routes should rely on Auth0 session presence.
- Management API credentials remain separate from browser-auth credentials.

### 2. Protected Route Flow

Protected routes continue to be enforced in `middleware.ts`.

Expected behavior:

- Public pages remain public.
- Protected pages redirect unauthenticated users to `/auth/login?returnTo=...`.
- After successful login, Auth0 returns the user to the requested route.
- Middleware should not accidentally intercept webhook callbacks or static assets.

### 3. User Provisioning Flow

Authenticated dashboard access should guarantee a corresponding Prisma `user` exists.

Provisioning behavior:

- On first authenticated access to a protected application surface, call `ensureDatabaseUser()`.
- Upsert the user using Auth0 `sub` as the primary identity.
- Normalize email, name, and avatar updates on subsequent logins.
- Preserve the existing email-conflict protection to avoid silently hijacking an account created under a different identity.
- Ensure starter credits are still applied through the current ledger path.

### 4. Shared Session UI

The app shell should expose clear session actions in one shared location.

Navigation behavior:

- Signed-out state shows `Sign in` and `Get started`.
- Signed-in state shows `Dashboard` and `Log out`.
- Sign-in and sign-up pages should redirect authenticated users away from redundant auth pages.
- Messaging on auth pages should match the real product stack and current plan model.

### 5. Environment Model

The project should distinguish between:

- Web auth env vars:
  - `NEXT_PUBLIC_AUTH0_ENABLED`
  - `AUTH0_DOMAIN`
  - `AUTH0_CLIENT_ID`
  - `AUTH0_CLIENT_SECRET`
  - `AUTH0_SECRET`
  - `APP_BASE_URL` or `NEXT_PUBLIC_APP_URL`
- Management env vars:
  - `AUTH0_MANAGEMENT_API_URL`
  - `AUTH0_MANAGEMENT_AUDIENCE`
  - `AUTH0_MANAGEMENT_CLIENT_ID`
  - `AUTH0_MANAGEMENT_CLIENT_SECRET`

The app should not report auth as "configured" if only management env vars exist.

## File-Level Change Plan

### `src/lib/auth0.ts`

- Tighten configuration checks so "web auth configured" reflects only browser-login requirements.
- Keep management credentials separate from login credentials.
- Preserve the existing `Auth0Client` singleton shape.

### `middleware.ts`

- Keep the current protected-route pattern list.
- Confirm login redirect logic preserves `returnTo`.
- Ensure webhooks and auth callback paths are not broken by protection logic.

### `src/lib/auth/ensure-user.ts`

- Keep Auth0 session to Prisma user provisioning as the canonical server-side identity bridge.
- Reuse this function from protected server entry points so user provisioning is guaranteed before meaningful dashboard actions.

### Shared navigation components

- Add session-aware navigation controls in the shared landing/dashboard shell.
- Avoid duplicating login/logout CTA logic across pages.

### `src/app/sign-in/page.tsx` and `src/app/sign-up/page.tsx`

- Redirect authenticated users to `/dashboard`.
- Keep the pages lightweight and use Auth0 Universal Login as the actual identity UI.
- Make return paths explicit and consistent.

### Dashboard and protected entry points

- Ensure at least one early server boundary in the dashboard path provisions the database user.
- Prefer a shared server-side guard over page-by-page ad hoc checks where possible.

## Error Handling

The frontend auth flow should fail clearly in these cases:

- Missing Auth0 web env vars:
  - show a disabled-auth state instead of broken links
- Missing email from Auth0:
  - return the existing `EMAIL_REQUIRED` error path
- Existing user with same email but different identity:
  - return `AUTH_ACCOUNT_CONFLICT`
- Lost session on protected route:
  - redirect to Auth0 login with `returnTo`

No silent fallbacks should create a fake local session or bypass protected pages.

## Testing and Verification

Minimum verification for this phase:

1. `npm run type-check -- --pretty false`
2. `npm run build`
3. Manual login flow test:
   - open public page
   - click sign in
   - authenticate with Auth0
   - return to dashboard
   - verify Prisma user exists
4. Manual logout flow test:
   - click log out
   - verify protected dashboard route redirects back to login
5. Manual first-user test:
   - create a new Auth0 user
   - verify `ensureDatabaseUser()` creates a DB row

## Risks

### Existing identity mismatch

If production already has users from a previous auth provider keyed by a different ID, Auth0 `sub` will create identity divergence. The current conflict check prevents silent corruption but does not merge historical accounts.

### Partial environment configuration

It is easy to configure Auth0 Management API and forget the web-auth env vars. The implementation must explicitly separate those states so the UI does not imply sign-in is available when it is not.

### Session visibility gaps

If session controls are added only to some nav variants, the app will still feel inconsistent. Session UI should be centralized.

## Rollout Order

1. Tighten web-auth configuration detection.
2. Centralize session-aware nav actions.
3. Redirect authenticated users away from auth entry pages.
4. Guarantee early protected-route user provisioning.
5. Run build and manual auth verification.

## Success Criteria

This phase is complete when:

- Authenticated users can sign in and reach the dashboard reliably.
- A Prisma `user` row is created or updated automatically from the Auth0 session.
- Shared navigation accurately reflects signed-in vs signed-out state.
- Sign out works and protected pages become inaccessible without a session.
- The app builds cleanly with the current Next.js/Auth0 setup.
