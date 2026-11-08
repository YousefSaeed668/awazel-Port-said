import type {
  ProjectCategory,
  ProjectImage,
  ProjectStatusTone,
} from "./projects";

export const PROJECT_VERIFICATION_ICONS = [
  "shield",
  "energy",
  "test",
  "document",
] as const;

export type ProjectVerificationIcon =
  (typeof PROJECT_VERIFICATION_ICONS)[number];

export const PROJECT_VERIFICATION_TONES = [
  "neutral",
  "info",
  "success",
] as const;

export type ProjectVerificationTone =
  (typeof PROJECT_VERIFICATION_TONES)[number];

export const PROJECT_FACT_ICONS = [
  "warranty",
  "date",
  "measurement",
  "system",
  "scope",
  "location",
] as const;

export type ProjectFactIcon = (typeof PROJECT_FACT_ICONS)[number];

export type ProjectDetailImage = ProjectImage & {
  width: number;
  height: number;
};

export type ProjectGalleryImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectDetailFact = {
  id: string;
  label: string;
  value: string;
  icon: ProjectFactIcon;
};

export type ProjectTextBlockStyle =
  | "normal"
  | "h2"
  | "h3"
  | "h4"
  | "blockquote";

export type ProjectBodySpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

export type ProjectBodyLinkMark = {
  _key: string;
  _type: "projectLink";
  href: string;
  openInNewTab: boolean;
};

export type ProjectBodyTextBlock = {
  _type: "block";
  _key: string;
  style: ProjectTextBlockStyle;
  listItem?: "bullet" | "number";
  level?: number;
  children: ProjectBodySpan[];
  markDefs: ProjectBodyLinkMark[];
  accent?: "gold" | "blue";
};

export type ProjectBodyImageBlock = {
  _type: "projectBodyImage";
  _key: string;
  image: ProjectDetailImage;
  caption?: string;
};

export type ProjectBodyCalloutBlock = {
  _type: "projectCallout";
  _key: string;
  tone: "info" | "warning" | "technical";
  title?: string;
  body: ProjectBodyTextBlock[];
};

export type ProjectBodyValue = Array<
  ProjectBodyTextBlock | ProjectBodyImageBlock | ProjectBodyCalloutBlock
>;

export type ProjectEngineeringRole = {
  description: string;
  tags: string[];
};

export type ProjectTechnicalSpec = {
  id: string;
  label: string;
  value: string;
  emphasis: boolean;
};

export type ProjectTechnicalSpecs = {
  note?: string;
  rows: ProjectTechnicalSpec[];
};

export type ProjectApproval = {
  id: string;
  name: string;
  description: string;
};

export type ProjectVerificationItem = {
  id: string;
  title: string;
  description: string;
  icon: ProjectVerificationIcon;
  footer: string;
  tone: ProjectVerificationTone;
};

export type ProjectDetailSidebar = {
  engineeringRole?: ProjectEngineeringRole;
  technicalSpecs?: ProjectTechnicalSpecs;
  approvals?: ProjectApproval[];
};

export type ProjectDetailContent = {
  id: string;
  title: string;
  slug: string;
  href: string;
  summary: string;
  category: ProjectCategory;
  status: {
    label: string;
    tone: ProjectStatusTone;
  };
  location: string;
  completedAt: string;
  approvalNumber?: string;
  facts: ProjectDetailFact[];
  cover: ProjectDetailImage;
  coverNote?: string;
  coverStandard?: string;
  body: ProjectBodyValue;
  gallery: ProjectGalleryImage[];
  sidebar: ProjectDetailSidebar;
  verification?: ProjectVerificationItem[];
  seo: {
    title: string;
    description: string;
  };
};

const projectDateFormatter = new Intl.DateTimeFormat("ar-EG-u-ca-gregory", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatProjectDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return projectDateFormatter.format(date);
}

export function normalizeProjectSlug(value: string) {
  const trimmed = value.trim();
  try {
    return decodeURIComponent(trimmed).trim();
  } catch {
    return trimmed;
  }
}
