import type { ResolvedDestination } from "./links";

export const PRIVACY_PATH = "/privacy";
export const PRIVACY_CARD_ICONS = [
  "contact",
  "building",
  "server",
  "key",
  "lock",
] as const;
export type PrivacyCardIcon = (typeof PRIVACY_CARD_ICONS)[number];
type TextItem = { id: string; text: string };
type PrivacyAction = ResolvedDestination & { label: string };

export interface PrivacySection {
  id: string;
  title: string;
  tocLabel: string;
  paragraphs: readonly TextItem[];
  cards: readonly {
    id: string;
    title: string;
    description?: string;
    icon: PrivacyCardIcon;
    items: readonly TextItem[];
  }[];
  items: readonly { id: string; title: string; description: string }[];
  itemsStyle: "rows" | "bullets";
  disclosure?: { title: string; text: string };
  footnote?: { title?: string; text: string };
  note?: { title: string; text: string; tone: "muted" | "blue" };
  showContact: boolean;
  showPublication: boolean;
}

export interface PrivacyPageContent {
  intro: {
    context: string;
    eyebrow: string;
    title: string;
    description: string;
    updatedLabel: string;
    updatedOn: string;
    versionLabel: string;
    version: string;
    compliance: string;
  };
  scope: { title: string; description: string };
  sections: readonly PrivacySection[];
  contact: {
    title: string;
    subtitle: string;
    emailLabel: string;
    email: string;
    phoneLabel: string;
    phone: string;
    addressLabel: string;
    address: string;
    hoursLabel: string;
    hours: string;
  };
  publication: { label: string; reference: string };
  sidebar: {
    tocTitle: string;
    countLabel: string;
    projectTitle: string;
    projectDescription: string;
    action: PrivacyAction | null;
    contactTitle: string;
    emailLabel: string;
    location: string;
  };
  whatsapp: { label: string; href: string } | null;
  seo: { title: string; description: string };
}
