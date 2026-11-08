import {
  BadgeCheck,
  ClipboardCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import type {
  ProjectAssuranceIcon,
  ProjectsPageContent,
} from "@/lib/projects";

const assuranceIcons: Record<ProjectAssuranceIcon, LucideIcon> = {
  shield: ShieldCheck,
  compliance: BadgeCheck,
  test: ClipboardCheck,
};

export function ProjectsAssurance({
  content,
}: {
  content: ProjectsPageContent["assurance"];
}) {
  return (
    <section
      aria-label="ضمانات فنية على مستوى التنفيذ"
      className="border-y border-border bg-surface-blue py-12"
    >
      <MaxWidth>
        <ul className="grid list-none gap-8 p-0 md:grid-cols-3 md:gap-8">
          {content.items.map((item) => {
            const Icon = assuranceIcons[item.icon];

            return (
              <li key={item.id} className="flex min-w-0 items-start gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h3 className="text-lg font-semibold leading-relaxed text-brand-navy sm:text-[22px] sm:leading-9">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-card text-brand-blue shadow-sm">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
              </li>
            );
          })}
        </ul>
      </MaxWidth>
    </section>
  );
}
