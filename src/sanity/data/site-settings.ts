import "server-only";

import { cache } from "react";

import {
  getMailtoHref,
  getTelHref,
  getWhatsAppHref,
  resolveDestination,
  type ResolvedDestination,
} from "@/lib/links";
import type {
  ContactRowViewModel,
  DefaultSeoViewModel,
  FooterViewModel,
  HeaderViewModel,
  SiteActionViewModel,
  SiteImageViewModel,
  SiteLinkViewModel,
  SiteShellViewModel,
} from "@/lib/site-view-models";

import { sanityClient } from "../lib/client";
import { SITE_SETTINGS_TAG } from "../lib/cache-tags";
import { imageUrl } from "../lib/image";
import { SITE_SETTINGS_QUERY } from "../queries/site-settings";
import type { SITE_SETTINGS_QUERY_RESULT } from "../sanity.types";

type SiteSettingsDocument = NonNullable<SITE_SETTINGS_QUERY_RESULT>;
type QueryHeader = NonNullable<SiteSettingsDocument["header"]>;
type QueryLink = NonNullable<QueryHeader["navigation"]>[number];
type QueryDestination = QueryLink["destination"];
type QueryImage = NonNullable<
  NonNullable<SiteSettingsDocument["brand"]>["logo"]
>;
type QueryAction = QueryHeader["primaryAction"];

class SiteSettingsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SiteSettingsError";
  }
}

function requiredText(
  value: string | null | undefined,
  field: string,
): string {
  const normalized = value?.trim();
  if (!normalized) {
    throw new SiteSettingsError(
      `Sanity site settings are incomplete: "${field}" is required.`,
    );
  }
  return normalized;
}

function optionalText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function requireImage(
  image: QueryImage | null,
  field: string,
  width: number,
): SiteImageViewModel {
  const mapped = mapImage(image, field, width);
  if (!mapped) {
    throw new SiteSettingsError(
      `Sanity site settings are incomplete: "${field}" image is required.`,
    );
  }
  return mapped;
}

function mapDestination(
  destination: QueryDestination,
  field: string,
): ResolvedDestination {
  const resolved = resolveDestination(destination);
  if (!resolved) {
    throw new SiteSettingsError(
      `Sanity site settings contain an unsafe or missing destination at "${field}".`,
    );
  }
  return resolved;
}

function mapImage(
  image: QueryImage | null,
  field: string,
  width: number,
): SiteImageViewModel | null {
  if (!image?.asset?._ref) return null;

  const intrinsicWidth = image.dimensions?.width;
  const intrinsicHeight = image.dimensions?.height;

  if (!intrinsicWidth || !intrinsicHeight) {
    throw new SiteSettingsError(
      `Sanity image metadata is missing for "${field}". Re-upload the image asset.`,
    );
  }

  return {
    src: imageUrl(
      {
        _type: "image",
        asset: image.asset,
        crop: image.crop,
        hotspot: image.hotspot,
      },
      width,
    ),
    alt: requiredText(image.alt, `${field}.alt`),
    width: intrinsicWidth,
    height: intrinsicHeight,
  };
}

function mapLinks(
  links: ReadonlyArray<QueryLink> | null,
  field: string,
): SiteLinkViewModel[] {
  const mapped: SiteLinkViewModel[] = [];

  for (const [index, link] of (links ?? []).entries()) {
    if (!link || link.enabled === false) continue;

    const destination = mapDestination(
      link.destination,
      `${field}[${index}].destination`,
    );

    mapped.push({
      key: link._key,
      label: requiredText(link.label, `${field}[${index}].label`),
      ...destination,
    });
  }

  return mapped;
}

function mapAction(
  action: QueryAction | null,
  field: string,
  required: boolean,
): SiteActionViewModel | null {
  if (!action) {
    if (required) {
      throw new SiteSettingsError(
        `Sanity site settings are incomplete: "${field}" is required.`,
      );
    }
    return null;
  }

  if (action.enabled === false) return null;

  return {
    label: requiredText(action.label, `${field}.label`),
    ...mapDestination(action.destination, `${field}.destination`),
  };
}

function mapHeader(document: SiteSettingsDocument): HeaderViewModel {
  if (!document.brand) {
    throw new SiteSettingsError(
      'Sanity site settings are incomplete: "brand" is required.',
    );
  }
  if (!document.header) {
    throw new SiteSettingsError(
      'Sanity site settings are incomplete: "header" is required.',
    );
  }

  return {
    companyName: requiredText(document.brand.companyName, "brand.companyName"),
    logo: requireImage(document.brand.logo, "brand.logo", 640),
    navigation: mapLinks(document.header.navigation, "header.navigation"),
    primaryAction: mapAction(
      document.header.primaryAction,
      "header.primaryAction",
      true,
    ),
  };
}

function mapFooter(
  document: SiteSettingsDocument,
  header: HeaderViewModel,
): FooterViewModel {
  if (!document.footer) {
    throw new SiteSettingsError(
      'Sanity site settings are incomplete: "footer" is required.',
    );
  }

  const footer = document.footer;
  const contact = document.contact;
  const contactColumn = footer.contactColumn;

  if (!contactColumn) {
    throw new SiteSettingsError(
      'Sanity site settings are incomplete: "footer.contactColumn" is required.',
    );
  }

  const contactRows: ContactRowViewModel[] = [];
  const phone = optionalText(contact?.phone);
  const email = optionalText(contact?.email);
  const address = requiredText(contact?.address, "contact.address");
  const workingHours = optionalText(contact?.workingHours);

  if (phone) {
    contactRows.push({
      key: "phone",
      label: requiredText(contactColumn.phoneLabel, "footer.contactColumn.phoneLabel"),
      value: phone,
      href: getTelHref(phone),
      ltr: true,
    });
  }

  if (email) {
    contactRows.push({
      key: "email",
      label: requiredText(contactColumn.emailLabel, "footer.contactColumn.emailLabel"),
      value: email,
      href: getMailtoHref(email),
      ltr: true,
    });
  }

  contactRows.push({
    key: "address",
    label: requiredText(contactColumn.addressLabel, "footer.contactColumn.addressLabel"),
    value: address,
    ltr: false,
  });

  if (workingHours) {
    contactRows.push({
      key: "hours",
      label: requiredText(contactColumn.hoursLabel, "footer.contactColumn.hoursLabel"),
      value: workingHours,
      ltr: false,
    });
  }

  const quickLinks = footer.quickLinks;
  const services = footer.serviceLinks;

  if (!quickLinks) {
    throw new SiteSettingsError(
      'Sanity site settings are incomplete: "footer.quickLinks" is required.',
    );
  }
  if (!services) {
    throw new SiteSettingsError(
      'Sanity site settings are incomplete: "footer.serviceLinks" is required.',
    );
  }

  let cta: FooterViewModel["cta"] = null;

  if (footer.cta && footer.cta.enabled !== false) {
    if (!footer.cta.primaryDestination) {
      throw new SiteSettingsError(
        'Sanity site settings are incomplete: "footer.cta.primary" is required.',
      );
    }

    const resolvedPrimary: SiteActionViewModel = {
      label: requiredText(footer.cta.primaryLabel, "footer.cta.primaryLabel"),
      ...mapDestination(
        footer.cta.primaryDestination,
        "footer.cta.primary.destination",
      ),
    };

    const whatsappHref = getWhatsAppHref(contact?.whatsapp);
    const supportingText = optionalText(footer.cta.supportingText);
    const telHref = getTelHref(phone);

    cta = {
      eyebrow: requiredText(footer.cta.eyebrow, "footer.cta.eyebrow"),
      title: requiredText(footer.cta.title, "footer.cta.title"),
      description: requiredText(footer.cta.description, "footer.cta.description"),
      primary: resolvedPrimary,
      secondary: whatsappHref
        ? {
            label: requiredText(
              footer.cta.whatsappLabel,
              "footer.cta.whatsappLabel",
            ),
            href: whatsappHref,
            external: true,
            openInNewTab: true,
          }
        : {
            ...resolvedPrimary,
            label: requiredText(
              footer.cta.contactLabel,
              "footer.cta.contactLabel",
            ),
          },
      supporting: phone
        ? { label: phone, href: telHref, external: false }
        : supportingText
          ? {
              label: supportingText,
              href: resolvedPrimary.href,
              external: resolvedPrimary.external,
            }
          : null,
    };
  }

  const legal = footer.legal;

  if (!legal) {
    throw new SiteSettingsError(
      'Sanity site settings are incomplete: "footer.legal" is required.',
    );
  }

  return {
    description: requiredText(
      footer.companyDescription,
      "footer.companyDescription",
    ),
    logo:
      mapImage(footer.footerLogo, "footer.footerLogo", 640) ?? header.logo,
    badges: (footer.badges ?? []).flatMap((badge) => {
      if (!badge || badge.enabled === false) return [];
      const label = optionalText(badge.label);
      return label ? [label] : [];
    }),
    quickLinks: {
      heading: requiredText(quickLinks.heading, "footer.quickLinks.heading"),
      links: mapLinks(quickLinks.links, "footer.quickLinks.links"),
    },
    services: {
      heading: requiredText(services.heading, "footer.serviceLinks.heading"),
      links: mapLinks(services.links, "footer.serviceLinks.links"),
    },
    contact: {
      heading: requiredText(
        contactColumn.heading,
        "footer.contactColumn.heading",
      ),
      rows: contactRows,
      action: mapAction(
        contactColumn.action,
        "footer.contactColumn.action",
        false,
      ),
    },
    cta,
    legal: {
      links: mapLinks(legal.links, "footer.legal.links"),
      copyright: requiredText(legal.copyright, "footer.legal.copyright"),
    },
  };
}

function mapDefaultSeo(document: SiteSettingsDocument): DefaultSeoViewModel {
  if (!document.defaultSeo) {
    throw new SiteSettingsError(
      'Sanity site settings are incomplete: "defaultSeo" is required.',
    );
  }

  return {
    title: requiredText(document.defaultSeo.title, "defaultSeo.title"),
    description: requiredText(
      document.defaultSeo.description,
      "defaultSeo.description",
    ),
    siteName: requiredText(document.defaultSeo.siteName, "defaultSeo.siteName"),
    image: mapImage(document.defaultSeo.image, "defaultSeo.image", 1200),
  };
}

function mapSiteSettings(
  document: SiteSettingsDocument,
): SiteShellViewModel {
  const header = mapHeader(document);

  return {
    header,
    footer: mapFooter(document, header),
    defaultSeo: mapDefaultSeo(document),
  };
}

export const getSiteShell = cache(async (): Promise<SiteShellViewModel> => {
  const document = await sanityClient.fetch<SiteSettingsDocument | null>(
    SITE_SETTINGS_QUERY,
    {},
    {
      cache: "force-cache",
      next: {
        revalidate: false,
        tags: [SITE_SETTINGS_TAG],
      },
      perspective: "published",
      stega: false,
      useCdn: false,
    },
  );

  if (!document) {
    throw new SiteSettingsError(
      'Sanity site settings document "siteSettings" was not found. Create and publish it in Studio at /studio (or run npm run seed:site-settings) before building the public site.',
    );
  }

  return mapSiteSettings(document);
});
