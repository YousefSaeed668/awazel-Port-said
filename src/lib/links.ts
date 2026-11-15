export type DestinationInput =
  | {
      kind?: string | null;
      href?: string | null;
      openInNewTab?: boolean | null;
    }
  | null
  | undefined;

export type ResolvedDestination = {
  href: string;
  external: boolean;
  openInNewTab: boolean;
};

const UNSAFE_URL_CHARACTERS = /[\s\\\u0000-\u001f\u007f]/;

export function isSafeInternalPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  return !UNSAFE_URL_CHARACTERS.test(value);
}

export function isSafeExternalUrl(value: string) {
  if (UNSAFE_URL_CHARACTERS.test(value)) return false;

  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function resolveDestination(
  input: DestinationInput,
): ResolvedDestination | null {
  const href = input?.href?.trim();
  if (!href) return null;

  if (input?.kind === "external") {
    return isSafeExternalUrl(href)
      ? {
          href,
          external: true,
          openInNewTab: input?.openInNewTab !== false,
        }
      : null;
  }

  if (input?.kind === "internal") {
    return isSafeInternalPath(href)
      ? { href, external: false, openInNewTab: false }
      : null;
  }

  if (isSafeInternalPath(href)) {
    return { href, external: false, openInNewTab: false };
  }

  if (isSafeExternalUrl(href)) {
    return {
      href,
      external: true,
      openInNewTab: input?.openInNewTab !== false,
    };
  }

  return null;
}

export function getTelHref(phone: string | null | undefined) {
  if (!phone) return undefined;
  const value = phone.replace(/[^\d+]/g, "");
  return value ? `tel:${value}` : undefined;
}

export function getMailtoHref(email: string | null | undefined) {
  if (!email) return undefined;
  const value = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? `mailto:${value}`
    : undefined;
}

export function getWhatsAppHref(number: string | null | undefined) {
  if (!number) return undefined;
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : undefined;
}

export function getGoogleMapsEmbedUrl(value: string | null | undefined) {
  const input = value?.trim();
  if (!input) return null;

  // Accept Google's copied iframe, but use only its validated src, never its HTML.
  const source = input.startsWith("<")
    ? input.match(/^<iframe\b[^>]*?\s+src\s*=\s*(["'])(.*?)\1/i)?.[2]
    : input;
  const href = source?.replace(/&amp;/gi, "&");
  if (!href || UNSAFE_URL_CHARACTERS.test(href)) return null;

  try {
    const url = new URL(href);
    return url.protocol === "https:" &&
      (url.hostname === "www.google.com" || url.hostname === "google.com") &&
      !url.username &&
      !url.password &&
      !url.port &&
      (url.pathname === "/maps/embed" ||
        url.pathname.startsWith("/maps/embed/v1/"))
      ? url.href
      : null;
  } catch {
    return null;
  }
}
