import Link from "next/link";
import { ClipboardList, MessageCircle, UserRoundCheck } from "lucide-react";

import { MaxWidth } from "@/components/MaxWidth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button-variants";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ServicesHeading, ServicesPageContent } from "@/lib/services-data";
import { cn } from "cn";

export function ServicesSectionHeading({
  id,
  heading,
}: {
  id: string;
  heading: ServicesHeading;
}) {
  return (
    <SectionHeading
      id={id}
      eyebrow={heading.eyebrow}
      title={heading.title}
      description={heading.description}
      eyebrowVariant="plain"
      className="max-w-175"
      titleClassName="text-brand-navy font-semibold sm:text-[32px] sm:leading-[1.5]"
    />
  );
}

export function ServicesFaq({
  content,
}: {
  content: ServicesPageContent["faq"];
}) {
  return (
    <section
      aria-labelledby="services-faq-title"
      className="bg-card py-16 lg:py-24"
    >
      <MaxWidth>
        <div className="mx-auto w-full max-w-220">
          <ServicesSectionHeading
            id="services-faq-title"
            heading={content.heading}
          />
          <Accordion
            defaultValue={content.items.length ? [content.items[0].id] : []}
            className="mt-10 gap-4 lg:mt-12"
          >
            {content.items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="rounded-xl border-0 bg-background px-5 not-last:border-b-0 sm:px-6"
              >
                <AccordionTrigger className="items-center gap-4 py-5 text-start text-base leading-relaxed font-semibold text-brand-navy hover:no-underline sm:py-6 sm:text-xl">
                  <span className="min-w-0 flex-1">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="h-auto pb-6 text-start text-base leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </MaxWidth>
    </section>
  );
}

export function ServicesConsultation({
  content,
}: {
  content: ServicesPageContent["consultation"];
}) {
  return (
    <section
      aria-labelledby="services-consultation-title"
      className="bg-brand-navy py-16 text-primary-foreground lg:py-20"
    >
      <MaxWidth className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-175">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-brand-gold">
            <UserRoundCheck aria-hidden="true" className="size-4" />
            {content.eyebrow}
          </p>
          <h2
            id="services-consultation-title"
            className="mt-3 text-2xl leading-normal font-semibold sm:text-[32px]"
          >
            {content.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
            {content.description}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          {[content.primaryAction, content.secondaryAction].map(
            (action, index) => {
              const Icon = index === 0 ? ClipboardList : MessageCircle;
              return (
                <Link
                  key={index}
                  href={action.href}
                  target={action.openInNewTab ? "_blank" : undefined}
                  rel={action.openInNewTab ? "noopener noreferrer" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: index === 0 ? "inverse" : "whatsapp",
                    }),
                    "h-12 rounded-lg px-6 text-base whitespace-normal text-center",
                  )}
                >
                  {action.label}
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                </Link>
              );
            },
          )}
        </div>
      </MaxWidth>
    </section>
  );
}
