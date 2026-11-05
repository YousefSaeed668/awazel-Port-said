import "server-only";

import {
  getMailtoHref,
  getTelHref,
  getWhatsAppHref,
  resolveDestination,
} from "@/lib/links";
import {
  PRIVACY_CARD_ICONS,
  type PrivacyPageContent,
  type PrivacySection,
} from "@/lib/privacy-data";

import type { PRIVACY_PAGE_QUERY_RESULT } from "../sanity.types";

type Document = NonNullable<PRIVACY_PAGE_QUERY_RESULT>;
type QuerySection = NonNullable<Document["sections"]>[number];
type QueryAction = NonNullable<Document["sidebar"]>["action"];

export class PrivacyPageError extends Error {
  constructor(message: string) {
    super(`Sanity privacy content: ${message}`);
    this.name = "PrivacyPageError";
  }
}

function required<T>(value: T | null | undefined, field: string): T {
  if (value === null || value === undefined)
    throw new PrivacyPageError(`"${field}" is required.`);
  return value;
}

function text(value: string | null | undefined, field: string): string {
  const result = value?.trim();
  if (!result) throw new PrivacyPageError(`"${field}" must be non-empty.`);
  return result;
}

function keyed<T extends { _key: string }>(
  items: readonly T[] | null | undefined,
  field: string,
  min = 0,
): readonly T[] {
  const result = items ?? [];
  if (result.length < min)
    throw new PrivacyPageError(`"${field}" needs at least ${min} entries.`);
  const keys = new Set<string>();
  for (const item of result) {
    const key = text(item._key, `${field}._key`);
    if (keys.has(key))
      throw new PrivacyPageError(`"${field}" has duplicate keys.`);
    keys.add(key);
  }
  return result;
}

function paragraphs(items: QuerySection["paragraphs"], field: string, min = 0) {
  return keyed(items, field, min).map((item) => ({
    id: item._key,
    text: text(item.text, `${field}.text`),
  }));
}

function panel(value: QuerySection["disclosure"], field: string) {
  return value
    ? {
        title: text(value.title, `${field}.title`),
        text: text(value.text, `${field}.text`),
      }
    : undefined;
}

function action(value: QueryAction | null, field: string) {
  if (!value || value.enabled === false) return null;
  const destination = resolveDestination(value.destination);
  if (!destination)
    throw new PrivacyPageError(`"${field}" has an unsafe destination.`);
  return { label: text(value.label, `${field}.label`), ...destination };
}

function section(value: QuerySection): PrivacySection {
  const field = `sections.${value._key}`;
  const tone = value.note?.tone;
  if (value.note && tone !== "muted" && tone !== "blue")
    throw new PrivacyPageError(`"${field}.note.tone" is unsupported.`);
  if (
    value.itemsStyle &&
    value.itemsStyle !== "rows" &&
    value.itemsStyle !== "bullets"
  )
    throw new PrivacyPageError(`"${field}.itemsStyle" is unsupported.`);
  return {
    id: value._key,
    title: text(value.title, `${field}.title`),
    tocLabel: text(value.tocLabel, `${field}.tocLabel`),
    paragraphs: paragraphs(value.paragraphs, `${field}.paragraphs`, 1),
    cards: keyed(value.cards, `${field}.cards`).map((card) => {
      const icon = PRIVACY_CARD_ICONS.find((icon) => icon === card.icon);
      if (!icon)
        throw new PrivacyPageError(`"${field}.cards.icon" is unsupported.`);
      return {
        id: card._key,
        title: text(card.title, `${field}.cards.title`),
        description: card.description?.trim() || undefined,
        icon,
        items: paragraphs(card.items, `${field}.cards.items`),
      };
    }),
    items: keyed(value.items, `${field}.items`).map((item) => ({
      id: item._key,
      title: text(item.title, `${field}.items.title`),
      description: text(item.description, `${field}.items.description`),
    })),
    itemsStyle: value.itemsStyle === "bullets" ? "bullets" : "rows",
    disclosure: panel(value.disclosure, `${field}.disclosure`),
    footnote: value.footnote
      ? {
          title: value.footnote.title?.trim() || undefined,
          text: text(value.footnote.text, `${field}.footnote.text`),
        }
      : undefined,
    note: value.note
      ? {
          ...required(panel(value.note, `${field}.note`), `${field}.note`),
          tone: tone === "blue" ? "blue" : "muted",
        }
      : undefined,
    showContact: value.showContact === true,
    showPublication: value.showPublication === true,
  };
}

export function mapPrivacyPage(
  document: PRIVACY_PAGE_QUERY_RESULT,
): PrivacyPageContent {
  const source = required(
    document,
    'published document "privacyPage". Create and publish it in Studio or run npm run seed:privacy-page',
  );
  const intro = required(source.intro, "intro");
  const scope = required(source.scope, "scope");
  const contact = required(source.contact, "contact");
  const publication = required(source.publication, "publication");
  const sidebar = required(source.sidebar, "sidebar");
  const consultation = required(source.consultation, "consultation");
  const seo = required(source.seo, "seo");
  const updatedOn = text(intro.updatedOn, "intro.updatedOn");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(updatedOn) ||
    !Number.isFinite(Date.parse(updatedOn)) ||
    new Date(updatedOn).toISOString().slice(0, 10) !== updatedOn
  ) {
    throw new PrivacyPageError('"intro.updatedOn" must be a valid date.');
  }
  const email = text(contact.email, "contact.email");
  const phone = text(contact.phone, "contact.phone");
  if (
    !getMailtoHref(email) ||
    !/^\+?[\d\s().-]{7,24}$/.test(phone) ||
    !getTelHref(phone)
  )
    throw new PrivacyPageError("Privacy contact details are invalid.");
  let whatsapp: PrivacyPageContent["whatsapp"] = null;
  if (source.whatsapp?.enabled !== false && source.whatsapp) {
    const number = text(source.whatsapp.number, "whatsapp.number");
    if (!/^\+?\d{8,15}$/.test(number))
      throw new PrivacyPageError("The WhatsApp number is invalid.");
    whatsapp = {
      label: text(source.whatsapp.label, "whatsapp.label"),
      href: required(getWhatsAppHref(number), "whatsapp.href"),
    };
  }
  return {
    breadcrumbs: keyed(intro.breadcrumbs, "intro.breadcrumbs", 2).map(
      (item) => {
        const destination = item.destination
          ? resolveDestination(item.destination)
          : null;
        if (item.destination && (!destination || destination.external))
          throw new PrivacyPageError(
            "Breadcrumbs must use safe internal paths.",
          );
        return {
          id: item._key,
          label: text(item.label, "breadcrumbs.label"),
          href: destination?.href,
        };
      },
    ),
    intro: {
      context: text(intro.context, "intro.context"),
      eyebrow: text(intro.eyebrow, "intro.eyebrow"),
      title: text(intro.title, "intro.title"),
      description: text(intro.description, "intro.description"),
      updatedLabel: text(intro.updatedLabel, "intro.updatedLabel"),
      updatedOn,
      versionLabel: text(intro.versionLabel, "intro.versionLabel"),
      version: text(intro.version, "intro.version"),
      compliance: text(intro.compliance, "intro.compliance"),
    },
    scope: {
      title: text(scope.title, "scope.title"),
      description: text(scope.description, "scope.description"),
    },
    sections: keyed(source.sections, "sections", 1).map(section),
    contact: {
      title: text(contact.title, "contact.title"),
      subtitle: text(contact.subtitle, "contact.subtitle"),
      emailLabel: text(contact.emailLabel, "contact.emailLabel"),
      email,
      phoneLabel: text(contact.phoneLabel, "contact.phoneLabel"),
      phone,
      addressLabel: text(contact.addressLabel, "contact.addressLabel"),
      address: text(contact.address, "contact.address"),
      hoursLabel: text(contact.hoursLabel, "contact.hoursLabel"),
      hours: text(contact.hours, "contact.hours"),
    },
    publication: {
      label: text(publication.label, "publication.label"),
      reference: text(publication.reference, "publication.reference"),
    },
    sidebar: {
      tocTitle: text(sidebar.tocTitle, "sidebar.tocTitle"),
      countLabel: text(sidebar.countLabel, "sidebar.countLabel"),
      projectTitle: text(sidebar.projectTitle, "sidebar.projectTitle"),
      projectDescription: text(
        sidebar.projectDescription,
        "sidebar.projectDescription",
      ),
      action: action(sidebar.action, "sidebar.action"),
      contactTitle: text(sidebar.contactTitle, "sidebar.contactTitle"),
      emailLabel: text(sidebar.emailLabel, "sidebar.emailLabel"),
      location: text(sidebar.location, "sidebar.location"),
    },
    consultation: {
      eyebrow: text(consultation.eyebrow, "consultation.eyebrow"),
      title: text(consultation.title, "consultation.title"),
      description: text(consultation.description, "consultation.description"),
      primaryAction: action(
        consultation.primaryAction,
        "consultation.primaryAction",
      ),
      secondaryAction: action(
        consultation.secondaryAction,
        "consultation.secondaryAction",
      ),
    },
    whatsapp,
    seo: {
      title: text(seo.title, "seo.title"),
      description: text(seo.description, "seo.description"),
    },
  };
}
