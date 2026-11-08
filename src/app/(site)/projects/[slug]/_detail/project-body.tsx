import Image from "next/image";
import { Info, TriangleAlert, Wrench } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import type {
  ProjectBodyCalloutBlock,
  ProjectBodyValue,
} from "@/lib/project-detail";
import { cn } from "cn";

const calloutStyles: Record<
  ProjectBodyCalloutBlock["tone"],
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

const bodyComponents: PortableTextComponents<ProjectBodyValue[number]> = {
  block: {
    normal: ({ children }) => (
      <p className="my-4 text-base leading-[26px] text-muted-foreground">
        {children}
      </p>
    ),
    h2: ({ value, children }) => (
      <h2 className="mt-10 mb-4 flex items-center gap-2 text-2xl font-semibold leading-[37px] text-brand-navy first:mt-0">
        <span
          aria-hidden="true"
          className={cn(
            "h-5 w-1.5 shrink-0 rounded-full",
            value.accent === "blue" ? "bg-brand-blue" : "bg-brand-gold",
          )}
        />
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-[22px] font-semibold leading-[34px] text-brand-navy">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-base font-semibold leading-6 text-brand-navy">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 rounded-lg border-s-4 border-brand-gold bg-surface-blue px-5 py-3 text-base leading-8 text-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-5 flex list-none flex-col gap-3 p-0">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 flex list-none flex-col gap-3 p-0">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ index, children }) => (
      <li className="group flex items-start gap-4 rounded-xl border border-border bg-secondary p-4">
        <PhaseNumber index={index} />
        <div className="min-w-0 flex-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
          {children}
        </div>
      </li>
    ),
    number: ({ index, children }) => (
      <li className="group flex items-start gap-4 rounded-xl border border-border bg-secondary p-4">
        <PhaseNumber index={index} />
        <div className="min-w-0 flex-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
          {children}
        </div>
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
    projectLink: ({ value, children }) => {
      if (!value?.href) return <>{children}</>;
      return (
        <a
          href={value.href}
          target={value.openInNewTab ? "_blank" : undefined}
          rel={value.openInNewTab ? "noopener noreferrer" : undefined}
          className="rounded-sm font-medium text-link underline decoration-link/40 underline-offset-4 hover:decoration-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    projectBodyImage: ({ value }) => (
      <figure className="my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Image
          src={value.image.src}
          alt={value.image.alt}
          width={value.image.width}
          height={value.image.height}
          sizes="(min-width: 1344px) 720px, (min-width: 1024px) 58vw, 100vw"
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
    projectCallout: ({ value }) => {
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

function PhaseNumber({ index }: { index: number }) {
  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold leading-[18px] text-primary-foreground group-last:bg-success">
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

export function ProjectBody({ value }: { value: ProjectBodyValue }) {
  return (
    <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <PortableText value={value} components={bodyComponents} />
    </div>
  );
}
