"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, List } from "lucide-react";
import { cn } from "cn";

import type { PrivacyPageContent } from "@/lib/privacy-data";

export function PrivacyToc({
  sections,
  title,
  countLabel,
}: {
  sections: PrivacyPageContent["sections"];
  title: string;
  countLabel: string;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  useEffect(() => {
    const headings = sections.map((section) => ({
      id: section.id,
      element: document.getElementById(`privacy-section-${section.id}`),
    }));
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headings[0]?.id ?? "";
      for (const heading of headings) {
        if (
          heading.element &&
          heading.element.getBoundingClientRect().top <= 160
        )
          current = heading.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sections]);

  return (
    <nav aria-label={title} className="rounded-xl bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold text-brand-navy">
          <List
            aria-hidden="true"
            className="size-4 shrink-0 text-brand-blue"
          />
          {title}
        </h2>
        <span className="text-xs text-muted-foreground">
          {sections.length} {countLabel}
        </span>
      </div>
      <div aria-hidden="true" className="mt-2 h-0.5 w-6 bg-brand-gold" />
      <ol className="mt-2 space-y-1">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#privacy-section-${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg p-2.5 text-sm leading-6 focus-visible:outline-2 focus-visible:outline-ring",
                active === section.id
                  ? "bg-surface-blue font-medium text-link"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded text-xs",
                  active === section.id
                    ? "bg-brand-blue text-white"
                    : "bg-muted text-brand-navy",
                )}
              >
                {index + 1}
              </span>
              {section.tocLabel}
              <ChevronLeft
                aria-hidden="true"
                className="shrink-0 ms-auto size-3.5"
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
