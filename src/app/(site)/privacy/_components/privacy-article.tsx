import { cn } from "cn";
import {
  BadgeCheck,
  BellOff,
  Building2,
  CircleCheck,
  Clock3,
  ContactRound,
  Info,
  KeyRound,
  LockKeyhole,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Server,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getMailtoHref, getTelHref } from "@/lib/links";
import type { PrivacyCardIcon, PrivacyPageContent } from "@/lib/privacy-data";

const cardIcons = {
  contact: ContactRound,
  building: Building2,
  server: Server,
  key: KeyRound,
  lock: LockKeyhole,
} satisfies Record<PrivacyCardIcon, LucideIcon>;

export function PrivacyArticle({ content }: { content: PrivacyPageContent }) {
  return (
    <article className="min-w-0 space-y-6 lg:col-span-8 print:col-span-full">
      {content.sections.map((section, index) => {
        const NoteIcon = section.note?.tone === "blue" ? BellOff : Info;
        return (
          <section
            key={section.id}
            aria-labelledby={`privacy-section-${section.id}`}
          >
            <Card className="gap-4 py-6 shadow-sm ring-0 sm:py-8 print:break-inside-auto print:shadow-none">
              <CardContent className="space-y-4 px-5 sm:px-8">
                <h2
                  id={`privacy-section-${section.id}`}
                  className="flex scroll-mt-8 items-start gap-2 text-xl leading-relaxed font-semibold text-brand-navy sm:text-2xl"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-blue text-xl text-link">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.id}
                    className="text-base leading-8 text-foreground sm:text-lg sm:leading-9"
                  >
                    {paragraph.text}
                  </p>
                ))}
                {section.cards.length > 0 ? (
                  <div
                    className={cn(
                      "grid gap-4 pt-1",
                      section.cards.length === 3
                        ? "sm:grid-cols-3"
                        : "sm:grid-cols-2",
                    )}
                  >
                    {section.cards.map((card) => {
                      const CardIcon = cardIcons[card.icon];
                      return (
                        <div
                          key={card.id}
                          className={cn(
                            "rounded-lg bg-muted p-4",
                            card.items.length === 0 && "text-center",
                          )}
                        >
                          <h3
                            className={cn(
                              "flex items-center gap-2 font-semibold text-brand-navy",
                              card.items.length === 0 &&
                                "justify-center text-lg",
                            )}
                          >
                            <CardIcon
                              aria-hidden="true"
                              className="size-4 shrink-0 text-brand-blue"
                            />
                            {card.title}
                          </h3>
                          {card.description ? (
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {card.description}
                            </p>
                          ) : null}
                          {card.items.length > 0 ? (
                            <ul className="mt-2 list-disc space-y-1.5 ps-4 text-sm leading-6 text-muted-foreground">
                              {card.items.map((item) => (
                                <li key={item.id}>{item.text}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                {section.disclosure ? (
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="flex items-start gap-2 text-sm font-semibold text-brand-navy">
                      <Paperclip
                        aria-hidden="true"
                        className="size-4 shrink-0 text-brand-gold"
                      />
                      {section.disclosure.title}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-muted-foreground">
                      {section.disclosure.text}
                    </p>
                  </div>
                ) : null}
                {section.items.length > 0 ? (
                  <ul
                    className={cn(
                      section.itemsStyle === "bullets"
                        ? "list-disc space-y-3 ps-4"
                        : "space-y-2",
                    )}
                  >
                    {section.items.map((item) => (
                      <li
                        key={item.id}
                        className={cn(
                          "text-base leading-7 text-muted-foreground",
                          section.itemsStyle === "rows" &&
                            "flex gap-2 rounded-lg bg-muted p-2",
                        )}
                      >
                        {section.itemsStyle === "rows" ? (
                          <CircleCheck
                            aria-hidden="true"
                            className="size-4 shrink-0 mt-1 text-link"
                          />
                        ) : null}
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {item.title}
                          </h3>
                          <p>{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.footnote ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    {section.footnote.title ? (
                      <strong className="text-foreground">
                        {section.footnote.title}{" "}
                      </strong>
                    ) : null}
                    {section.footnote.text}
                  </p>
                ) : null}
                {section.note ? (
                  <div
                    className={cn(
                      "flex items-start gap-2 rounded-lg p-4 text-sm leading-6",
                      section.note.tone === "blue"
                        ? "bg-surface-blue text-brand-navy"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <NoteIcon
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-link"
                    />
                    <p>
                      <strong>{section.note.title} </strong>
                      {section.note.text}
                    </p>
                  </div>
                ) : null}
                {section.showContact ? (
                  <PrivacyContact contact={content.contact} />
                ) : null}
                {section.showPublication ? (
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <BadgeCheck
                        aria-hidden="true"
                        className="size-4 shrink-0 mt-1 text-link"
                      />
                      {content.publication.label}
                    </p>
                    <p
                      dir="ltr"
                      className="text-xs font-medium text-brand-navy"
                    >
                      {content.publication.reference}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </section>
        );
      })}
    </article>
  );
}

function PrivacyContact({
  contact,
}: {
  contact: PrivacyPageContent["contact"];
}) {
  const rows = [
    {
      key: "email",
      icon: Mail,
      label: contact.emailLabel,
      value: contact.email,
      href: getMailtoHref(contact.email),
      ltr: true,
    },
    {
      key: "phone",
      icon: Phone,
      label: contact.phoneLabel,
      value: contact.phone,
      href: getTelHref(contact.phone),
      ltr: true,
    },
    {
      key: "address",
      icon: MapPin,
      label: contact.addressLabel,
      value: contact.address,
    },
    {
      key: "hours",
      icon: Clock3,
      label: contact.hoursLabel,
      value: contact.hours,
    },
  ] as const;
  return (
    <div className="rounded-xl bg-muted p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-link">
          <UserRound aria-hidden="true" className="shrink-0 size-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-brand-navy sm:text-xl">
            {contact.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {contact.subtitle}
          </p>
        </div>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.key} className="flex min-w-0 items-start gap-2 text-sm">
            <row.icon
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-brand-blue"
            />
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="mt-1 break-words font-medium text-brand-navy">
                {"href" in row ? (
                  <a
                    href={row.href}
                    dir="ltr"
                    className="inline-block max-w-full break-all rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
