import {
  CircleCheckBig,
  FileCheck2,
  FlaskConical,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import type {
  ProjectVerificationIcon,
  ProjectVerificationItem,
  ProjectVerificationTone,
} from "@/lib/project-detail";
import { cn } from "cn";

const verificationIcons: Record<
  ProjectVerificationIcon,
  typeof ShieldCheck
> = {
  shield: ShieldCheck,
  energy: Zap,
  test: FlaskConical,
  document: FileCheck2,
};

const toneClasses: Record<ProjectVerificationTone, string> = {
  neutral: "bg-surface-blue text-link",
  info: "bg-brand-blue/10 text-brand-blue",
  success: "bg-success/10 text-success",
};

export function ProjectVerification({
  items,
}: {
  items: ProjectVerificationItem[];
}) {
  return (
    <section
      aria-labelledby="project-verification-title"
      className="border-t border-border bg-card py-14"
    >
      <MaxWidth className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-xs font-medium uppercase leading-[18px] text-muted-foreground">
            توثيق الجودة والاعتماد الرسمي
            <span
              aria-hidden="true"
              className="h-4 w-1.5 rounded-full bg-success"
            />
          </p>
          <h2
            id="project-verification-title"
            className="text-2xl font-semibold leading-[48px] text-brand-navy sm:text-[32px]"
          >
            النتيجة الهندسية، الفحص، والتسليم الرسمي
          </h2>
        </div>

        <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = verificationIcons[item.icon];

            return (
              <li
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <span
                  className={cn(
                    "inline-flex size-12 shrink-0 items-center justify-center rounded-lg",
                    toneClasses[item.tone],
                  )}
                >
                  <Icon aria-hidden="true" className="size-6" />
                </span>

                <div className="flex-1">
                  <h3 className="text-[22px] font-semibold leading-[34px] text-brand-navy">
                    {item.title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-2 block h-0.5 w-6 bg-brand-gold"
                  />
                  <p className="mt-3 text-sm leading-[22.75px] text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                  <p
                    className={cn(
                      "text-xs font-semibold leading-[18px]",
                      item.tone === "success"
                        ? "text-success"
                        : "text-brand-navy",
                    )}
                  >
                    {item.footer}
                  </p>
                  <CircleCheckBig
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-muted-foreground"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </MaxWidth>
    </section>
  );
}
