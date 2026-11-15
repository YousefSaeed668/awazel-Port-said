"use client";

import { cn } from "cn";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

import { isActivePath } from "@/lib/utils";
import type { HeaderViewModel } from "@/lib/site-view-models";

type HeaderNavigationProps = {
  items: HeaderViewModel["navigation"];
  ariaLabel: string;
};

type IndicatorBox = { x: number; y: number; width: number; height: number };

function HeaderNavigation({ items, ariaLabel }: HeaderNavigationProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<IndicatorBox | null>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
      if (!active) {
        setIndicator(null);
        return;
      }
      const parent = nav.getBoundingClientRect();
      const rect = active.getBoundingClientRect();
      if (!rect.width) return;
      const box = {
        x: rect.left - parent.left - nav.clientLeft,
        y: rect.top - parent.top - nav.clientTop,
        width: rect.width,
        height: rect.height,
      };
      setIndicator((previous) => previous &&
        previous.x === box.x && previous.y === box.y &&
        previous.width === box.width && previous.height === box.height
        ? previous : box);
    };
    measure();
    if (!window.ResizeObserver) return;
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    nav.querySelectorAll('a').forEach((link) => observer.observe(link));
    return () => observer.disconnect();
  }, [pathname, items]);

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      className="pointer-events-auto relative isolate hidden rounded-2xl border border-border/80 bg-card/95 p-1.5 shadow-sm backdrop-blur-xl lg:block"
    >
      {indicator && (
        <motion.span
          initial={false}
          animate={indicator}
          transition={reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 280, damping: 32, mass: 1 }}
          className="pointer-events-none absolute top-0 left-0 -z-10 rounded-xl bg-brand-navy shadow-sm"
          data-header-indicator
          aria-hidden="true"
        >
          <span className="absolute inset-x-[36%] bottom-1.5 h-0.5 rounded-full bg-brand-gold" />
        </motion.span>
      )}
      <ul className="flex flex-wrap items-center justify-center gap-1">
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
                  "relative inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none xl:px-6",
                  active
                    ? cn("text-primary-foreground", !indicator && "bg-brand-navy")
                    : "text-muted-foreground hover:bg-surface-blue/70 hover:text-brand-navy",
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
