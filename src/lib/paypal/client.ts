import {
  getPayPalBaseUrl,
  getPayPalClientId,
  getPayPalClientSecret,
  getPayPalWebhookId,
} from "./config";

interface PayPalRequestOptions {
  method?: "GET" | "POST";
  body?: unknown;
  requestId?: string;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method?: string;
}

export class PayPalApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${getPayPalClientId()}:${getPayPalClientSecret()}`
  ).toString("base64");

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const data = (await response.json()) as
    | { access_token?: string; error_description?: string }
    | undefined;

  if (!response.ok || !data?.access_token) {
    throw new PayPalApiError(
      data?.error_description || "Failed to authenticate with PayPal.",
      response.status,
      data
    );
  }

  return data.access_token;
}

export async function paypalRequest<T>(
  path: string,
  options: PayPalRequestOptions = {}
): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${getPayPalBaseUrl()}${path}`, {
    method: options.method ?? (options.body ? "POST" : "GET"),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.requestId ? { "PayPal-Request-Id": options.requestId } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new PayPalApiError(
      data?.message || data?.name || "PayPal request failed.",
      response.status,
      data
    );
  }

  return data as T;
}

export function getPayPalApprovalUrl(links?: PayPalLink[]): string | null {
  return links?.find((link) => link.rel === "approve")?.href ?? null;
}

export async function verifyPayPalWebhookSignature(
  headers: Headers,
  event: unknown
): Promise<boolean> {
  const verification = await paypalRequest<{ verification_status?: string }>(
    "/v1/notifications/verify-webhook-signature",
    {
      body: {
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: getPayPalWebhookId(),
        webhook_event: event,
      },
    }
  );

  return verification.verification_status === "SUCCESS";
}