import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "cn";

interface BreadcrumbItem {
  id?: string;
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: readonly BreadcrumbItem[];
  label?: string;
  className?: string;
}

export function Breadcrumbs({
  items,
  label = "مسار التنقل",
  className,
}: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav aria-label={label} className={cn("min-w-0", className)}>
      <ol className="flex list-none flex-wrap items-center gap-1.5 p-0 text-sm">
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li key={item.id ?? item.href ?? item.label} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-muted-foreground/60 rtl:rotate-180"
                />
              ) : null}

              {current || !item.href ? (
                <span
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "leading-7",
                    current
                      ? "font-medium text-brand-navy"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="rounded-sm leading-7 text-muted-foreground underline-offset-4 transition-colors hover:text-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
