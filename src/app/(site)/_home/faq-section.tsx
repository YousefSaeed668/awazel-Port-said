import { MaxWidth } from "@/components/MaxWidth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";

import type { HomepageData } from "@/lib/data";

export function FaqSection({ content }: { content: HomepageData["faq"] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-muted py-12">
      <MaxWidth>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            variant="home"
            id="faq-title"
            eyebrow={content.heading.eyebrow}
            title={content.heading.title}
            description={content.heading.description}
          />
          <Accordion
            defaultValue={content.items.length ? [content.items[0].id] : []}
            className="mt-8 gap-2"
          >
            {content.items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="not-last:border-b-0 rounded-lg border-0 bg-card px-4 shadow-sm"
              >
                <AccordionTrigger className="py-4 text-start text-base font-semibold leading-7 text-brand-navy hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-muted-foreground">
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
