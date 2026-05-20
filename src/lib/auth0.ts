import { Auth0Client } from "@auth0/nextjs-auth0/server";

const auth0AppBaseUrl =
  process.env.APP_BASE_URL?.trim() ||
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  null;

export const isAuth0Configured =
  Boolean(process.env.AUTH0_DOMAIN) &&
  Boolean(process.env.AUTH0_CLIENT_ID) &&
  Boolean(process.env.AUTH0_CLIENT_SECRET) &&
  Boolean(process.env.AUTH0_SECRET) &&
  Boolean(auth0AppBaseUrl);

let auth0Client: Auth0Client | null = null;

export function getAuth0Client() {
  if (!isAuth0Configured) {
    return null;
  }

  if (!auth0Client) {
    auth0Client = new Auth0Client({
      appBaseUrl: auth0AppBaseUrl ?? undefined,
      signInReturnToPath: "/dashboard",
      authorizationParameters: {
        scope: "openid profile email",
      },
    });
  }

  return auth0Client;
}
