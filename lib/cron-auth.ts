/**
 * Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`.
 * Manual tests may also pass the same secret as `?secret=` or `x-cron-secret`.
 */
export function isAuthorizedCronRequest(request: Request): { ok: true } | { ok: false; status: number; error: string } {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    if (process.env.NODE_ENV !== "production") return { ok: true };
    return { ok: false, status: 401, error: "CRON_SECRET is not configured." };
  }

  const auth = request.headers.get("authorization") || "";
  const headerSecret = request.headers.get("x-cron-secret") || request.headers.get("x-portfolio-cron-secret") || "";
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret") || "";

  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  const provided = bearer || headerSecret.trim() || querySecret.trim();

  if (provided && provided === secret) return { ok: true };
  return { ok: false, status: 401, error: "Unauthorized." };
}
