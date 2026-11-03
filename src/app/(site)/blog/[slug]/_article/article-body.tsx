import Image from "next/image";
import { CircleCheck, Info, TriangleAlert, Wrench } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { articleSectionId } from "@/lib/blog";
import type { ArticleBodyValue, ArticleCalloutTone } from "@/lib/blog";

import { cn } from "cn";

import { articleBodyObjects } from "./article-body-blocks";

const calloutStyles: Record<
  ArticleCalloutTone,
  { label: string; className: string; icon: typeof Info }
> = {
  info: {
    label: "معلومة",
    className: "border-brand-blue bg-surface-blue",
    icon: Info,
  },
  warning: {
    label: "تحذير",
    className: "border-destructive bg-destructive/5",
    icon: TriangleAlert,
  },
  technical: {
    label: "ملاحظة فنية",
    className: "border-brand-navy bg-surface-blue",
    icon: Wrench,
  },
};

const bodyComponents: PortableTextComponents<ArticleBodyValue[number]> = {
  block: {
    normal: ({ children }) => (
      <p className="my-4 text-base leading-loose text-foreground sm:text-lg">
        {children}
      </p>
    ),
    h2: ({ value, children }) => (
      <h2
        id={articleSectionId(value._key)}
        className="mt-10 mb-3 scroll-mt-8 text-[1.75rem] leading-[1.55] font-semibold text-brand-navy sm:text-[2rem] sm:leading-normal print:break-after-avoid"
      >
        <span aria-hidden="true" className="mb-3 block h-1 w-8 bg-brand-gold" />
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 text-xl leading-relaxed font-semibold text-brand-navy sm:text-[1.375rem] print:break-after-avoid">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-5 mb-2 text-lg leading-relaxed font-medium text-brand-navy">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 rounded-lg border-s-4 border-brand-gold bg-surface-blue px-5 py-3 text-base leading-8 text-foreground print:break-inside-avoid">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-none space-y-2 ps-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-2 ps-6 marker:font-medium marker:text-brand-navy">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-base leading-loose text-foreground sm:text-lg">
        <div className="flex items-start gap-2">
          <CircleCheck
            aria-hidden="true"
            className="mt-2 size-4 shrink-0 text-link"
          />
          <div className="min-w-0">{children}</div>
        </div>
      </li>
    ),
    number: ({ children }) => (
      <li className="ps-1 text-base leading-loose text-foreground sm:text-lg">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-brand-navy">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <span className="underline decoration-brand-gold/70 underline-offset-4">
        {children}
      </span>
    ),
    articleLink: ({ value, children }) => {
      if (!value?.href) return <>{children}</>;
      return (
        <a
          href={value.href}
          target={value.external && value.openInNewTab ? "_blank" : undefined}
          rel={
            value.external && value.openInNewTab
              ? "noopener noreferrer"
              : undefined
          }
          className="rounded-sm font-medium text-link underline decoration-link/40 underline-offset-4 hover:decoration-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring print:text-inherit"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    ...articleBodyObjects,
    articleBodyImage: ({ value }) => (
      <figure className="my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm print:break-inside-avoid print:overflow-visible">
        <Image
          src={value.image.src}
          alt={value.image.alt}
          width={value.image.width ?? 1200}
          height={value.image.height ?? 800}
          sizes="(min-width: 1344px) 760px, (min-width: 1024px) 62vw, 100vw"
          className="h-auto w-full"
          style={
            value.image.objectPosition
              ? { objectPosition: value.image.objectPosition }
              : undefined
          }
        />
        {value.caption ? (
          <figcaption className="border-t border-border bg-muted px-3 py-2 text-sm leading-6 text-muted-foreground">
            {value.caption}
          </figcaption>
        ) : null}
      </figure>
    ),
    articleCallout: ({ value }) => {
      const style = calloutStyles[value.tone];
      const Icon = style.icon;
      return (
        <aside
          aria-label={value.title ?? style.label}
          className={cn("my-6 rounded-lg border-s-4 p-4", style.className)}
        >
          <p className="flex items-center gap-2 text-base font-medium text-brand-navy">
            <Icon aria-hidden="true" className="size-5 shrink-0" />
            {value.title ?? style.label}
          </p>
          <div className="mt-1 [&>p]:text-base [&>p]:leading-7 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
            <PortableText value={value.body} components={bodyComponents} />
          </div>
        </aside>
      );
    },
  },
};

export function ArticleBody({ value }: { value: ArticleBodyValue }) {
  return (
    <div className="article-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <PortableText value={value} components={bodyComponents} />
    </div>
  );
}
