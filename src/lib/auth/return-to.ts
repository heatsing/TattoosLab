export function getSafeReturnToPath(
  value: string | string[] | undefined,
  fallback: string = "/dashboard"
) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate) {
    return fallback;
  }

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  return candidate;
}
