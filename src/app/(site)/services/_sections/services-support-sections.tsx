import { MaxWidth } from "@/components/MaxWidth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ServicesHeading, ServicesPageContent } from "@/lib/services-data";

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
