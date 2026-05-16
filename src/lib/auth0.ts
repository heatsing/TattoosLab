import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const isAuth0Configured =
  Boolean(process.env.AUTH0_DOMAIN) &&
  Boolean(process.env.AUTH0_CLIENT_ID) &&
  Boolean(process.env.AUTH0_CLIENT_SECRET) &&
  Boolean(process.env.AUTH0_SECRET);

let auth0Client: Auth0Client | null = null;

export function getAuth0Client() {
  if (!isAuth0Configured) {
    return null;
  }

  if (!auth0Client) {
    auth0Client = new Auth0Client({
      appBaseUrl: process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL,
      signInReturnToPath: "/dashboard",
      authorizationParameters: {
        scope: "openid profile email",
      },
    });
  }

  return auth0Client;
}
