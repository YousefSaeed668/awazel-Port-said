import { cn } from "cn";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type {
  ContactRowViewModel,
  FooterViewModel,
  SiteActionViewModel,
  SiteLinkViewModel,
} from "@/lib/site-view-models";

import { MaxWidth } from "./MaxWidth";
import { buttonVariants } from "./ui/button-variants";

type FooterProps = FooterViewModel & {
  showCallToAction?: boolean;
};

const footerLinkClass =
  "inline-flex min-h-9 items-center rounded-sm text-sm leading-relaxed text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-on-dark";

const contactIcons = {
  phone: Phone,
  email: Mail,
  address: MapPin,
  hours: Clock3,
} satisfies Record<ContactRowViewModel["key"], typeof Phone>;

function externalLinkProps(action: SiteActionViewModel) {
  return action.external && action.openInNewTab
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}

function FooterLinkList({
  links,
  className,
}: {
  links: SiteLinkViewModel[];
  className: string;
}) {
  return (
    <ul className={className}>
      {links.map(({ key, href, label, openInNewTab }) => (
        <li key={key}>
          <Link
            href={href}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            className={footerLinkClass}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Footer({
  description,
  logo,
  badges,
  quickLinks,
  services,
  contact,
  cta: ctaContent,
  legal,
  showCallToAction = true,
}: FooterProps) {
  const year = new Date().getUTCFullYear();
  const cta = showCallToAction ? ctaContent : null;

  return (
    <footer className="bg-brand-navy text-white">
      <MaxWidth>
        {cta && (
          <section
            aria-labelledby="footer-cta-title"
            className="py-16 text-center sm:py-20"
          >
            <div className="mx-auto max-w-3xl">
              <p className="mb-4 flex items-center justify-center gap-3 text-sm text-white/80">
                <span className="h-px w-8 bg-brand-gold" aria-hidden="true" />
                {cta.eyebrow}
                <span className="h-px w-8 bg-brand-gold" aria-hidden="true" />
              </p>
              <h2
                id="footer-cta-title"
                className="text-3xl leading-relaxed font-semibold sm:text-4xl"
              >
                {cta.title}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-loose text-white/80">
                {cta.description}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={cta.primary.href}
                  className={buttonVariants({ variant: "inverse" })}
                  {...externalLinkProps(cta.primary)}
                >
                  {cta.primary.label}
                  <ArrowUpRight
                    className="size-4 rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                </Link>
                <a
                  href={cta.secondary.href}
                  className={buttonVariants({ variant: "whatsapp" })}
                  {...externalLinkProps(cta.secondary)}
                >
                  <MessageSquare className="size-4" aria-hidden="true" />
                  {cta.secondary.label}
                </a>
              </div>
              {cta.supporting && (
                <div className="mt-5 text-sm text-white/80">
                  {cta.supporting.href ? (
                    <a
                      href={cta.supporting.href}
                      className={footerLinkClass}
                      {...(cta.supporting.external &&
                      cta.supporting.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <span
                        dir={
                          cta.supporting.href.startsWith("tel:")
                            ? "ltr"
                            : undefined
                        }
                      >
                        {cta.supporting.label}
                      </span>
                    </a>
                  ) : (
                    <span className="inline-flex min-h-9 items-center">
                      {cta.supporting.label}
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        <div
          className={cn(
            "grid gap-10 pb-12 sm:grid-cols-2 xl:grid-cols-[1.25fr_0.8fr_1fr_1fr] xl:gap-12",
            !cta && "pt-14",
          )}
        >
          <div className="min-w-0">
            <Link
              href="/"
              className="inline-block rounded-md bg-white p-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-on-dark"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                sizes="176px"
                className="h-auto w-44"
              />
            </Link>
            <p className="mt-5 text-sm leading-loose text-white/80">
              {description}
            </p>
            {badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/90">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-sm bg-white/10 px-2 py-1"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          <nav aria-label={quickLinks.heading} className="min-w-0">
            <h2 className="mb-4 text-lg font-semibold">
              {quickLinks.heading}
            </h2>
            {quickLinks.links.length > 0 && (
              <FooterLinkList links={quickLinks.links} className="space-y-1" />
            )}
          </nav>

          <nav aria-label={services.heading} className="min-w-0">
            <h2 className="mb-4 text-lg font-semibold">{services.heading}</h2>
            {services.links.length > 0 && (
              <FooterLinkList links={services.links} className="space-y-1" />
            )}
          </nav>

          <div className="min-w-0">
            <h2 className="mb-5 text-lg font-semibold">{contact.heading}</h2>
            <address className="not-italic">
              <ul className="space-y-5">
                {contact.rows.map(({ key, label, value, href, ltr }) => {
                  const Icon = contactIcons[key];
                  return (
                    <li key={key} className="flex items-start gap-3">
                      <Icon
                        className="mt-1 size-5 shrink-0 text-focus-on-dark"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-xs text-white/70">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            className={cn(footerLinkClass, "break-all")}
                          >
                            <span dir={ltr ? "ltr" : undefined}>{value}</span>
                          </a>
                        ) : (
                          <p className="mt-1 text-sm leading-relaxed text-white/90">
                            {value}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
                {contact.action && (
                  <li>
                    <Link
                      href={contact.action.href}
                      className={footerLinkClass}
                      {...externalLinkProps(contact.action)}
                    >
                      {contact.action.label}
                    </Link>
                  </li>
                )}
              </ul>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 py-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {legal.copyright}
          </p>
          {legal.links.length > 0 && (
            <nav aria-label="الروابط القانونية">
              <FooterLinkList
                links={legal.links}
                className="flex flex-wrap items-center gap-x-6 gap-y-2"
              />
            </nav>
          )}
        </div>
      </MaxWidth>
    </footer>
  );
}

export { Footer };
