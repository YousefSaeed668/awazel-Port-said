import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

interface SectionHeadingProps {
  title: ReactNode;
  eyebrow?: string;
  description?: string;
  action?: { href: string; label: string };
  align?: "start" | "center";
  headingLevel?: 1 | 2 | 3;
  id?: string;
  className?: string;
  titleClassName?: string;
  variant?: "default" | "home";
  eyebrowVariant?: "badge" | "plain";
}

export function SectionHeading({
  title,
  eyebrow,
  description,
  action,
  align = "start",
  headingLevel = 2,
  id,
  className,
  titleClassName,
  variant = "default",
  eyebrowVariant = "badge",
}: SectionHeadingProps) {
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3";
  const centered = align === "center";
  const home = variant === "home";

  return (
    <div
      className={cn(
        "flex gap-5",
        centered
          ? "flex-col items-center text-center"
          : "flex-col text-start sm:flex-row sm:items-end sm:justify-between",
        home && "gap-3",
        className,
      )}
    >
      <div className={cn("min-w-0", centered ? "max-w-3xl" : "max-w-4xl")}>
        {eyebrow && eyebrowVariant === "plain" ? (
          <p className="text-xs font-medium text-link">{eyebrow}</p>
        ) : eyebrow ? (
          <p
            className={cn(
              "flex items-center gap-2",
              centered && "justify-center",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-0.5 shrink-0 rounded-full bg-brand-gold",
                home ? "w-6" : "w-8",
              )}
            />
            <Badge
              variant="secondary"
              className={cn(
                "h-auto text-xs font-medium",
                home
                  ? "rounded bg-muted px-2 py-1 text-muted-foreground"
                  : "rounded-md px-3 py-1.5 text-muted-foreground ring-1 ring-border",
              )}
            >
              {eyebrow}
            </Badge>
          </p>
        ) : null}
        <Heading
          id={id}
          className={cn(
            "text-2xl font-bold leading-relaxed sm:text-3xl",
            home ? "text-brand-navy" : "text-black",
            eyebrow &&
              (eyebrowVariant === "plain" ? "mt-1" : home ? "mt-2" : "mt-4"),
            titleClassName,
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p
            className={cn(
              "text-sm leading-7 text-muted-foreground sm:text-base",
              home ? "mt-2" : "mt-3",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-sm text-sm font-semibold text-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
            centered ? "self-center" : "self-start sm:self-auto",
          )}
        >
          {action.label}
          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 rtl:rotate-180"
          />
        </Link>
      ) : null}
    </div>
  );
}
