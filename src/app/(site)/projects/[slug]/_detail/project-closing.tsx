import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { buttonVariants } from "@/components/ui/button-variants";
import type { ProjectsPageContent } from "@/lib/projects";
import { cn } from "cn";

export function ProjectClosing({
  content,
}: {
  content: ProjectsPageContent["closing"];
}) {
  return (
    <section
      aria-labelledby="project-closing-title"
      className="border-t border-border bg-card py-16"
    >
      <MaxWidth>
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-secondary p-8 text-center shadow-sm sm:p-12">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-navy text-primary-foreground">
            <MessageCircle aria-hidden="true" className="size-6" />
          </span>

          <div className="flex max-w-180 flex-col gap-2">
            <h2
              id="project-closing-title"
              className="text-2xl font-semibold leading-[48px] text-brand-navy sm:text-[32px]"
            >
              {content.title}
            </h2>
            <p className="text-base leading-[26px] text-muted-foreground">
              {content.description}
            </p>
          </div>

          <Link
            href={content.whatsappAction.href}
            target={
              content.whatsappAction.openInNewTab ? "_blank" : undefined
            }
            rel={
              content.whatsappAction.openInNewTab
                ? "noopener noreferrer"
                : undefined
            }
            className={cn(
              buttonVariants({ variant: "whatsapp" }),
              "h-12 rounded-lg px-8 text-base",
            )}
          >
            {content.whatsappAction.label}
            <MessageCircle aria-hidden="true" className="size-4 shrink-0" />
          </Link>
        </div>
      </MaxWidth>
    </section>
  );
}
