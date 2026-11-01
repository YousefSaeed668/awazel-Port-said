export { cn } from "cn";

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!value) {
    throw new Error(
      "Missing required environment variable NEXT_PUBLIC_SITE_URL. Add the real public origin to .env.local.",
    );
  }

  return value;
}

export function isActivePath(pathname: string | null, href: string) {
  if (!pathname || !href.startsWith("/") || href.startsWith("//")) {
    return false;
  }

  const current = normalizePath(pathname);
  const target = normalizePath(href);

  if (target === "/") return current === "/";
  return current === target || current.startsWith(`${target}/`);
}

function normalizePath(value: string) {
  const pathOnly = value.split(/[?#]/, 1)[0] ?? "/";
  return pathOnly.replace(/\/+$/, "") || "/";
}
