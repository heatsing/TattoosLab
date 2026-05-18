type Auth0TokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
};

type Auth0UsersListResponse = {
  users?: Auth0ManagementUser[];
  start?: number;
  limit?: number;
  length?: number;
  total?: number;
};

export type Auth0ManagementUser = {
  user_id: string;
  email?: string;
  name?: string;
  nickname?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  email_verified?: boolean;
  blocked?: boolean;
  identities?: Array<{
    provider?: string;
    user_id?: string;
    connection?: string;
    isSocial?: boolean;
  }>;
};

export type ListAuth0UsersOptions = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type ListAuth0UsersResult = {
  users: Auth0ManagementUser[];
  page: number;
  perPage: number;
  total: number;
  length: number;
};

export class Auth0ManagementError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(
    code: string,
    message: string,
    status: number = 500,
    details?: unknown
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const normalizedAuth0Domain =
  process.env.AUTH0_DOMAIN?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "") || null;

function resolveManagementBaseUrl() {
  const explicitUrl = process.env.AUTH0_MANAGEMENT_API_URL?.trim();

  if (explicitUrl) {
    const parsedUrl = new URL(explicitUrl);
    const normalizedPath = parsedUrl.pathname
      .replace(/\/+$/, "")
      .replace(/\/users$/, "");

    return `${parsedUrl.origin}${normalizedPath}`;
  }

  if (!normalizedAuth0Domain) {
    return null;
  }

  return `https://${normalizedAuth0Domain}/api/v2`;
}

const managementBaseUrl = resolveManagementBaseUrl();
const managementAudience =
  process.env.AUTH0_MANAGEMENT_AUDIENCE?.trim() ||
  (managementBaseUrl ? `${managementBaseUrl}/` : null);
const managementClientId =
  process.env.AUTH0_MANAGEMENT_CLIENT_ID?.trim() ||
  process.env.AUTH0_CLIENT_ID?.trim() ||
  null;
const managementClientSecret =
  process.env.AUTH0_MANAGEMENT_CLIENT_SECRET?.trim() ||
  process.env.AUTH0_CLIENT_SECRET?.trim() ||
  null;

export const isAuth0ManagementConfigured = Boolean(
  normalizedAuth0Domain &&
    managementBaseUrl &&
    managementAudience &&
    managementClientId &&
    managementClientSecret
);

let cachedManagementToken:
  | {
      accessToken: string;
      expiresAt: number;
    }
  | null = null;

async function getManagementAccessToken() {
  if (!isAuth0ManagementConfigured || !normalizedAuth0Domain) {
    throw new Auth0ManagementError(
      "AUTH0_MANAGEMENT_NOT_CONFIGURED",
      "Auth0 Management API is not configured.",
      503
    );
  }

  if (
    cachedManagementToken &&
    cachedManagementToken.expiresAt > Date.now() + 60_000
  ) {
    return cachedManagementToken.accessToken;
  }

  const tokenResponse = await fetch(`https://${normalizedAuth0Domain}/oauth/token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: managementClientId,
      client_secret: managementClientSecret,
      audience: managementAudience,
    }),
  });

  const tokenPayload =
    ((await tokenResponse.json().catch(() => null)) as Auth0TokenResponse | null) ||
    null;

  if (!tokenResponse.ok || !tokenPayload?.access_token) {
    throw new Auth0ManagementError(
      "AUTH0_MANAGEMENT_TOKEN_FAILED",
      "Failed to obtain an Auth0 Management API access token.",
      tokenResponse.status || 500,
      tokenPayload
    );
  }

  cachedManagementToken = {
    accessToken: tokenPayload.access_token,
    expiresAt:
      Date.now() + Math.max((tokenPayload.expires_in ?? 300) - 60, 60) * 1000,
  };

  return cachedManagementToken.accessToken;
}

function escapeAuth0SearchTerm(search: string) {
  return search.trim().replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function auth0ManagementFetch<T>(
  path: string,
  init: RequestInit & {
    query?: Record<string, string | number | boolean | null | undefined>;
  } = {}
) {
  if (!managementBaseUrl) {
    throw new Auth0ManagementError(
      "AUTH0_MANAGEMENT_NOT_CONFIGURED",
      "Auth0 Management API base URL is not configured.",
      503
    );
  }

  const accessToken = await getManagementAccessToken();
  const url = new URL(path.replace(/^\/+/, ""), `${managementBaseUrl}/`);

  if (init.query) {
    for (const [key, value] of Object.entries(init.query)) {
      if (value === null || value === undefined || value === "") {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  const { query: _query, headers, ...requestInit } = init;

  const response = await fetch(url, {
    ...requestInit,
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
      ...headers,
    },
  });

  if (response.status === 204) {
    return null as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Auth0ManagementError(
      "AUTH0_MANAGEMENT_REQUEST_FAILED",
      `Auth0 Management API request failed with status ${response.status}.`,
      response.status,
      payload
    );
  }

  return payload as T;
}

export async function getAuth0User(userId: string) {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    throw new Auth0ManagementError(
      "AUTH0_USER_ID_REQUIRED",
      "Auth0 user id is required.",
      400
    );
  }

  return auth0ManagementFetch<Auth0ManagementUser>(
    `users/${encodeURIComponent(normalizedUserId)}`
  );
}

export async function listAuth0Users(options: ListAuth0UsersOptions = {}) {
  const page = Math.max(0, options.page ?? 0);
  const perPage = Math.min(100, Math.max(1, options.perPage ?? 25));
  const search = options.search?.trim();

  const q = search
    ? (() => {
        const escaped = escapeAuth0SearchTerm(search);
        return `email:*${escaped}* OR name:*${escaped}* OR nickname:*${escaped}*`;
      })()
    : undefined;

  const payload = await auth0ManagementFetch<Auth0UsersListResponse>("users", {
    method: "GET",
    query: {
      page,
      per_page: perPage,
      include_totals: true,
      sort: "updated_at:-1",
      search_engine: "v3",
      q,
    },
  });

  const users = payload.users ?? [];

  return {
    users,
    page,
    perPage: payload.limit ?? perPage,
    total: payload.total ?? users.length,
    length: payload.length ?? users.length,
  } satisfies ListAuth0UsersResult;
}
