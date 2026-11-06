export default async function securityHeaders(
  _event: unknown,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const result = await next();
  if (!(result instanceof Response)) return result;
  const headers = new Headers(result.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=15552000");
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://grok.com; script-src 'self' 'unsafe-inline' https://grok.com; connect-src 'self' https:; frame-src https://maps.google.com https://www.google.com https://grok.com; object-src 'none'; base-uri 'self'",
  );
  return new Response(result.body, { status: result.status, statusText: result.statusText, headers });
}
