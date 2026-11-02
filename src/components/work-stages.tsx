import type { ReactNode } from "react";
import {
  BadgeCheck,
  CircleCheck,
  FileText,
  Headset,
  Settings,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "cn";

const stageIcons = {
  badge: BadgeCheck,
  check: CircleCheck,
  file: FileText,
  headset: Headset,
  settings: Settings,
  target: Target,
} as const;

type HeadingLevel = 2 | 3;

interface WorkStageNote {
  text: string;
  tone?: "default" | "success";
}

interface WorkStagePhase {
  text: string;
  tone?: "default" | "success";
}

interface WorkStageItem {
  id: string;
  title: string;
  description: string;
  icon?: keyof typeof stageIcons;
  note?: WorkStageNote;
  phase?: WorkStagePhase;
}

interface WorkStagesProps {
  items: readonly WorkStageItem[];
  label: string;
  layout?: "grid" | "list";
  headingLevel?: HeadingLevel;
  className?: string;
}

function CardHeading({
  level,
  className,
  children,
}: {
  level: HeadingLevel;
  className?: string;
  children: ReactNode;
}) {
  if (level === 2) {
    return <h2 className={className}>{children}</h2>;
  }
  return <h3 className={className}>{children}</h3>;
}

function stepNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function WorkStages({
  items,
  label,
  layout = "grid",
  headingLevel = 3,
  className,
}: WorkStagesProps) {
  if (layout === "list") {
    return (
      <ol
        aria-label={label}
        className={cn("flex list-none flex-col gap-3 p-0", className)}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex flex-col gap-4 rounded-xl bg-muted px-4 py-4 ring-1 ring-border/60 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          >
            <div className="flex min-w-0 items-start gap-4">
              <span
                aria-hidden="true"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-sm font-semibold text-primary-foreground"
              >
                {stepNumber(index)}
              </span>
              <div className="min-w-0">
                <CardHeading
                  level={headingLevel}
                  className="text-base font-bold leading-7 text-brand-navy sm:text-lg sm:leading-8"
                >
                  {item.title}
                </CardHeading>
                <p className="mt-1 max-w-3xl text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>

            {item.phase ? (
              <span
                className={cn(
                  "w-fit shrink-0 rounded-full bg-card px-3 py-1 text-xs font-medium text-link ring-1 ring-border",
                  item.phase.tone === "success" &&
                    "bg-success/10 text-success ring-success/20",
                )}
              >
                {item.phase.text}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol
      aria-label={label}
      className={cn(
        "grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-5",
        className,
      )}
    >
      {items.map((item, index) => {
        const Icon = item.icon ? stageIcons[item.icon] : null;

        return (
          <li key={item.id} className="min-w-0">
            <Card className="h-full gap-3 bg-card shadow-sm ring-border/70">
              <CardContent className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-brand-gold">
                    {stepNumber(index)}
                  </span>
                  {Icon ? (
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-blue text-link">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                  ) : null}
                </div>

                <CardHeading
                  level={headingLevel}
                  className="text-sm font-bold leading-6 text-brand-navy"
                >
                  {item.title}
                </CardHeading>
                <p className="text-xs leading-6 text-muted-foreground">
                  {item.description}
                </p>

                {item.note ? (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "mt-auto h-auto w-fit px-2 py-1 text-[11px] font-medium whitespace-normal",
                      item.note.tone === "success" &&
                        "bg-success/10 text-success",
                    )}
                  >
                    {item.note.text}
                  </Badge>
                ) : null}
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ol>
  );
}

export type {
  HeadingLevel as WorkStagesHeadingLevel,
  WorkStageItem,
  WorkStageNote,
  WorkStagePhase,
  WorkStagesProps,
};
