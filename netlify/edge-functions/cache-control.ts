import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const response = await context.next();
  const url = new URL(request.url);

  // Don't cache HTML files
  if (url.pathname === "/" || url.pathname.endsWith(".html")) {
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  // Cache assets for a long time
  if (url.pathname.startsWith("/assets/")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  return response;
};

export const config = {
  path: "/*"
};