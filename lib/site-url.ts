const PRODUCTION_SITE_URL = "https://10124.vercel.app";

/** Absolute origin for email links and interstitial URLs. No trailing slash. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    if (vercel.startsWith("http://") || vercel.startsWith("https://")) {
      return vercel.replace(/\/+$/, "");
    }
    return `https://${vercel.replace(/\/+$/, "")}`;
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  return PRODUCTION_SITE_URL;
}

export { PRODUCTION_SITE_URL };
