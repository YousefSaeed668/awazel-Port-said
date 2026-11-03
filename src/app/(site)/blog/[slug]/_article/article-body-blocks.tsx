import Image from "next/image";
import { Droplet, House, Layers, Thermometer } from "lucide-react";
import type { PortableTextComponents } from "@portabletext/react";

import { buttonVariants } from "@/components/ui/button-variants";
import type { ArticleBodyValue, ArticleCard } from "@/lib/blog";
import { cn } from "cn";

const cardIcons = {
  water: { icon: Droplet, className: "bg-surface-blue text-link" },
  thermal: { icon: Thermometer, className: "bg-brand-gold/15 text-brand-navy" },
  layers: { icon: Layers, className: "bg-muted text-brand-navy" },
};

function CardIcon({ icon }: { icon: ArticleCard["icon"] }) {
  if (!icon) return null;
  const style = cardIcons[icon];
  const Icon = style.icon;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mb-2 flex size-8 items-center justify-center rounded-sm",
        style.className,
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}

const numberLabel = (index: number) => (index + 1).toLocaleString("ar-EG");
const numberClass =
  "flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-navy text-lg text-white";

export const articleBodyObjects: PortableTextComponents<
  ArticleBodyValue[number]
>["types"] = {
  articleTable: ({ value }) => (
    <figure className="my-6 print:break-inside-avoid">
      <div
        role="region"
        aria-label={value.caption ?? "جدول المقارنة"}
        tabIndex={0}
        className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring print:overflow-visible"
      >
        <table className="w-full min-w-140 border-collapse text-start text-sm print:min-w-0">
          {value.headers ? (
            <thead className="bg-brand-navy text-white print:bg-white print:text-black">
              <tr>
                {value.headers.map((header, index) => (
                  <th
                    key={`${value._key}-header-${index}`}
                    scope="col"
                    className="border-s border-white/15 p-4 text-start text-base leading-7 font-semibold first:border-s-0 print:border print:border-border print:p-2"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {value.rows.map((row) => (
              <tr
                key={row.key}
                className="border-b border-border last:border-0 hover:bg-muted/50"
              >
                {row.cells.map((cell, index) => (
                  <td
                    key={`${row.key}-${index}`}
                    className="border-s border-border p-4 align-middle leading-7 text-foreground first:border-s-0 first:font-medium first:text-brand-navy print:border print:p-2"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {value.caption ? (
        <figcaption className="mt-2 text-center text-xs leading-6 text-muted-foreground">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  ),
  articleCardGroup: ({ value }) => (
    <section className="my-6">
      {value.title ? (
        <h3 className="mb-3 text-xl leading-relaxed font-semibold text-brand-navy">
          {value.title}
        </h3>
      ) : null}
      {value.description ? (
        <p className="mb-4 text-base leading-7 text-muted-foreground">
          {value.description}
        </p>
      ) : null}
      <div
        className={cn(
          "grid gap-2",
          value.cards.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {value.cards.map((card) => (
          <div
            key={card.key}
            className="rounded-lg border border-border bg-card p-4"
          >
            <CardIcon icon={card.icon} />
            <p className="text-base font-medium text-brand-navy">
              {card.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  ),
  articleExplanation: ({ value }) => (
    <section className="my-6 flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
      {value.image ? (
        <figure
          className={cn(
            "w-full shrink-0 sm:w-1/3",
            value.imageSide === "end" && "sm:order-2",
          )}
        >
          <Image
            src={value.image.src}
            alt={value.image.alt}
            width={value.image.width ?? 1000}
            height={value.image.height ?? 750}
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 100vw"
            className="h-auto w-full rounded-lg bg-muted"
            style={
              value.image.objectPosition
                ? { objectPosition: value.image.objectPosition }
                : undefined
            }
          />
          {value.imageCaption ? (
            <figcaption className="mt-2 text-center text-xs leading-6 text-muted-foreground">
              {value.imageCaption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
      <div className="min-w-0">
        {value.image ? (
          <p className="mb-1 text-xs font-medium text-link">
            الرسم الهندسي التوضيحي
          </p>
        ) : null}
        <h3 className="text-base leading-relaxed font-medium text-brand-navy">
          {value.title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {value.text}
        </p>
        {value.points ? (
          <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm leading-7 text-muted-foreground marker:text-brand-gold">
            {value.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  ),
  articleQaGroup: ({ value }) => (
    <section className="my-6">
      {value.title ? (
        <h3 className="mb-4 text-xl leading-relaxed font-semibold text-brand-navy">
          {value.title}
        </h3>
      ) : null}
      <dl className="space-y-4">
        {value.items.map((item, index) => (
          <div
            key={item.key}
            className="relative rounded-xl border border-border bg-card p-4 ps-20 shadow-sm"
          >
            <dt className="text-base leading-7 font-medium text-brand-navy">
              <span
                aria-hidden="true"
                className={cn(numberClass, "absolute start-4 top-4")}
              >
                {numberLabel(index)}
              </span>
              {item.question}
            </dt>
            <dd className="mt-1 text-base leading-7 text-muted-foreground">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  ),
  articleNumberedSteps: ({ value }) => (
    <section className="my-6">
      {value.title ? (
        <h3 className="mb-4 text-xl leading-relaxed font-semibold text-brand-navy">
          {value.title}
        </h3>
      ) : null}
      <ol className="list-none space-y-4">
        {value.items.map((item, index) => (
          <li
            key={item.key}
            className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <span aria-hidden="true" className={numberClass}>
              {numberLabel(index)}
            </span>
            <div className="min-w-0">
              <p className="text-base leading-7 font-medium text-brand-navy">
                {item.title}
              </p>
              {item.description ? (
                <p className="mt-1 text-base leading-7 text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  ),
  articleServicePromo: ({ value }) => (
    <aside className="my-8 flex flex-col gap-4 rounded-xl border border-link/20 bg-surface-blue p-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <div className="flex min-w-0 items-start gap-4">
        <span
          aria-hidden="true"
          className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-lg bg-link text-white"
        >
          <House className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-link">
            الخدمة الهندسية ذات الصلة
          </p>
          <h3 className="mt-1 text-xl leading-relaxed font-semibold text-brand-navy">
            {value.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {value.description}
          </p>
        </div>
      </div>
      {value.action ? (
        <a
          href={value.action.href}
          target={
            value.action.external && value.action.openInNewTab
              ? "_blank"
              : undefined
          }
          rel={
            value.action.external && value.action.openInNewTab
              ? "noopener noreferrer"
              : undefined
          }
          className={cn(buttonVariants(), "w-full sm:w-auto")}
        >
          {value.action.label}
        </a>
      ) : null}
    </aside>
  ),
};
