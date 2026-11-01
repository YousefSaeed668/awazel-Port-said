"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActivePath } from "@/lib/utils";
import type { HeaderViewModel } from "@/lib/site-view-models";

type HeaderNavigationProps = {
  items: HeaderViewModel["navigation"];
  ariaLabel: string;
};

function HeaderNavigation({ items, ariaLabel }: HeaderNavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className="hidden xl:block">
      <ul className="flex items-center gap-4 2xl:gap-5">
        {items.map(({ key, href, label, external, openInNewTab }) => {
          const active = !external && isActivePath(pathname, href);
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                target={openInNewTab ? "_blank" : undefined}
                rel={openInNewTab ? "noopener noreferrer" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center border-b-2 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:text-link focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                  active
                    ? "border-brand-navy text-brand-navy"
                    : "border-transparent text-muted-foreground",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { HeaderNavigation };
