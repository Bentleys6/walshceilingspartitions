/**
 * Security headers added to every page the Worker renders (src/server.ts).
 * public/_headers only covers static files (images, scripts), not these pages.
 *
 * If you add a new outside service (analytics, chat widget, embed, form provider),
 * add its domain to the matching line of the Content-Security-Policy below, or the
 * browser will block it. The security test in src/test/security.test.ts lists them too.
 */
const csp = [
  "default-src 'self'",
  // 'unsafe-inline' is needed for the small inline scripts TanStack Start adds to each page.
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://www.facebook.com",
  "connect-src 'self' https://api.web3forms.com https://cloudflareinsights.com https://www.facebook.com https://connect.facebook.net",
  // Google Maps embed on the contact page.
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://api.web3forms.com",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const securityHeaders: Record<string, string> = {
  "Content-Security-Policy": csp,
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

/** Copy of the response with the security headers added (existing values are kept). */
export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) {
    if (!headers.has(name)) headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
