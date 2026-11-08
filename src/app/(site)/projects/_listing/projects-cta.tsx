import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import { buttonVariants } from "@/components/ui/button-variants";
import type { ProjectsPageContent } from "@/lib/projects";
import { cn } from "cn";

export function ProjectsCta({
  content,
}: {
  content: ProjectsPageContent["closing"];
}) {
  return (
    <section
      aria-labelledby="projects-cta-title"
      className="bg-brand-navy py-16 text-primary-foreground lg:py-20"
    >
      <MaxWidth>
        <div className="flex flex-col gap-10 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
          <div className="flex max-w-168 flex-col items-start gap-3">
            <p className="inline-flex items-center rounded-[4px] border border-brand-gold/30 bg-brand-gold/15 px-3.5 py-1.5 text-xs font-medium text-brand-gold">
              {content.eyebrow}
            </p>
            <h2
              id="projects-cta-title"
              className="text-2xl font-semibold leading-normal tracking-[-0.5px] sm:text-[32px] lg:text-[40px] lg:leading-[58px]"
            >
              {content.title}
            </h2>
            <p className="text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              {content.description}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href={content.whatsappAction.href}
              target={content.whatsappAction.openInNewTab ? "_blank" : undefined}
              rel={
                content.whatsappAction.openInNewTab
                  ? "noopener noreferrer"
                  : undefined
              }
              className={cn(
                buttonVariants({ variant: "whatsapp" }),
                "h-14 rounded-lg px-8 text-base",
              )}
            >
              {content.whatsappAction.label}
              <MessageCircle aria-hidden="true" className="size-4 shrink-0" />
            </Link>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
