"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

import type { ArticleTocItem } from "@/lib/blog";
import { cn } from "cn";

function useActiveSection(items: readonly ArticleTocItem[]) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null);

    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = Math.min(window.innerHeight * 0.2, 160);
      let current = "";
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > threshold) break;
        current = heading.id;
      }
      setActiveId(current);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [items]);

  return activeId;
}

function TocLinks({
  items,
  activeId,
  onNavigate,
}: {
  items: readonly ArticleTocItem[];
  activeId: string;
  onNavigate?: () => void;
}) {
  return (
    <ol className="space-y-1.5 text-base">
      {items.map((item, index) => {
        const active = item.id === activeId;

        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active ? "true" : undefined}
              onClick={onNavigate}
              className={cn(
                "block rounded-sm px-2 py-2 leading-7 transition-colors",
                active
                  ? "bg-surface-blue font-medium text-link"
                  : "text-muted-foreground hover:bg-surface-blue hover:text-link",
              )}
            >
              {!/^[\d\u0660-\u0669\u06f0-\u06f9]+[.\-ـ،)]/.test(item.label)
                ? `${index + 1}. `
                : null}
              {item.label}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function ArticleToc({
  items,
  className,
}: {
  items: readonly ArticleTocItem[];
  className?: string;
}) {
  const activeId = useActiveSection(items);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="محتويات المقال"
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm print:hidden",
        className,
      )}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <p className="flex items-center gap-2 text-xl font-semibold text-brand-navy">
          <List aria-hidden="true" className="size-5 shrink-0 text-link" />
          فهرس محتويات الدليل
        </p>
        <span className="text-xs text-muted-foreground">
          {items.length} أقسام
        </span>
      </div>
      <div className="max-h-[min(28rem,50vh)] overflow-y-auto overscroll-contain">
        <TocLinks items={items} activeId={activeId} />
      </div>
    </nav>
  );
}

export function ArticleMobileToc({
  items,
  className,
}: {
  items: readonly ArticleTocItem[];
  className?: string;
}) {
  const activeId = useActiveSection(items);

  if (items.length === 0) return null;

  return (
    <details
      className={cn(
        "rounded-xl border border-border bg-card p-1 lg:hidden print:hidden",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold text-brand-navy marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <List aria-hidden="true" className="size-4 text-brand-blue" />
        فهرس محتويات الدليل
        <span className="ms-auto text-xs font-normal text-muted-foreground">
          {items.length} أقسام
        </span>
      </summary>
      <div className="px-3 pb-3 pt-1">
        <TocLinks items={items} activeId={activeId} />
      </div>
    </details>
  );
}
