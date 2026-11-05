import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";

import type { HeaderViewModel } from "@/lib/site-view-models";

import { getSiteShell } from "./site-settings";

function pathname(href: string) {
  const path = href.split(/[?#]/, 1)[0];
  return path.replace(/\/+$/, "") || "/";
}

// The shell mapper has already removed disabled navigation entries. Exact
// path matching also permits section anchors without enabling unrelated pages.
export function isNavigationPageAvailable(
  header: HeaderViewModel,
  path: string,
) {
  return header.navigation.some(
    (link) => !link.external && pathname(link.href) === pathname(path),
  );
}

export const requireNavigationPage = cache(async (path: string) => {
  const { header } = await getSiteShell();
  if (!isNavigationPageAvailable(header, path)) notFound();
});
