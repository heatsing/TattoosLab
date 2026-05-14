const LIVE_BASE_URL = "https://api-m.paypal.com";
const SANDBOX_BASE_URL = "https://api-m.sandbox.paypal.com";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getPayPalClientId(): string {
  return getRequiredEnv("PAYPAL_CLIENT_ID");
}

export function getPayPalClientSecret(): string {
  return getRequiredEnv("PAYPAL_CLIENT_SECRET");
}

export function getPayPalWebhookId(): string {
  return getRequiredEnv("PAYPAL_WEBHOOK_ID");
}

export function getPayPalBaseUrl(): string {
  return process.env.PAYPAL_ENVIRONMENT === "live"
    ? LIVE_BASE_URL
    : SANDBOX_BASE_URL;
}