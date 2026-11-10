import "server-only";

import type { AboutPageContent } from "@/lib/about-data";

import { imageUrl } from "../lib/image";
import type { ABOUT_PAGE_QUERY_RESULT } from "../sanity.types";
import { downloadHref, formatFileSize } from "./pdf-file";

type QueryDocument = NonNullable<ABOUT_PAGE_QUERY_RESULT>;
type QueryCompany = NonNullable<QueryDocument["company"]>;
type QueryCapabilities = NonNullable<QueryDocument["capabilities"]>;
type QueryMethodology = NonNullable<QueryDocument["methodology"]>;
type QueryValues = NonNullable<QueryDocument["values"]>;
type QueryProfile = NonNullable<QueryDocument["profile"]>;
type QueryImage = QueryCompany["image"];
type QueryHeading = QueryCapabilities["heading"];
type QueryStage = NonNullable<QueryMethodology["items"]>[number];
type StageNoteValue = NonNullable<
  AboutPageContent["methodology"]["items"][number]["phase"]
>;

const FACT_ICONS = ["verified", "distance", "security", "engineering"] as const;
const VALUE_ICONS = ["quality", "safety", "environment"] as const;

export class AboutPageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AboutPageError";
  }
}

export function requiredText(
  value: string | null | undefined,
  field: string,
): string {
  const normalized = value?.trim();
  if (normalized) return normalized;
  throw new AboutPageError(
    `Sanity about content is incomplete: "${field}" is required.`,
  );
}

export function optionalText(value: string | null | undefined) {
  return value?.trim() || undefined;
}

export function requiredList<T>(
  value: readonly T[] | null | undefined,
  field: string,
) {
  if (value?.length) return value;
  throw new AboutPageError(
    `Sanity about content is incomplete: "${field}" must contain at least one entry.`,
  );
}

export function requiredIcon<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
  field: string,
): T {
  if (value && allowed.includes(value as T)) return value as T;
  throw new AboutPageError(
    `Sanity about content has an unsupported icon at "${field}".`,
  );
}

export function mapImage(
  image: QueryImage,
  field: string,
  width: number,
): AboutPageContent["company"]["image"] {
  if (!image?.asset?._ref) throw new AboutPageError(`Sanity about content is incomplete: "${field}" image is required.`);
  if (!image.dimensions?.width || !image.dimensions?.height) throw new AboutPageError(`Sanity image metadata is missing for "${field}". Re-upload the image asset.`);
  return {
    src: imageUrl(
      { _type: "image", asset: image.asset, crop: image.crop, hotspot: image.hotspot },
      width,
    ),
    alt: requiredText(image.alt, `${field}.alt`),
  };
}

export function mapHeading(
  heading: QueryHeading,
  field: string,
): AboutPageContent["capabilities"]["heading"] {
  if (!heading) throw new AboutPageError(`Sanity about content is incomplete: "${field}" is required.`);
  return {
    eyebrow: requiredText(heading.eyebrow, `${field}.eyebrow`),
    title: requiredText(heading.title, `${field}.title`),
    description: requiredText(heading.description, `${field}.description`),
  };
}

function mapStageNote(
  note: QueryStage["phase"],
  field: string,
): StageNoteValue | undefined {
  if (!note) return undefined;
  return {
    text: requiredText(note.text, `${field}.text`),
    tone: note.tone === "success" ? "success" : "default",
  };
}

export function mapCompany(company: QueryCompany): AboutPageContent["company"] {
  if (!company?.panel?.metric) throw new AboutPageError('Sanity about content is incomplete: "company.panel.metric" is required.');
  return {
    eyebrow: requiredText(company.eyebrow, "company.eyebrow"),
    title: requiredText(company.title, "company.title"),
    paragraphs: requiredList(company.paragraphs, "company.paragraphs").map((item, index) => ({
      id: requiredText(item._key, `company.paragraphs[${index}]._key`),
      text: requiredText(item.text, `company.paragraphs[${index}].text`),
    })),
    facts: requiredList(company.facts, "company.facts").map((item, index) => ({
      id: requiredText(item._key, `company.facts[${index}]._key`),
      label: requiredText(item.label, `company.facts[${index}].label`),
      value: requiredText(item.value, `company.facts[${index}].value`),
      icon: requiredIcon(item.icon, FACT_ICONS, `company.facts[${index}].icon`),
    })),
    image: mapImage(company.image, "company.image", 1600),
    panel: {
      title: requiredText(company.panel.title, "company.panel.title"),
      description: requiredText(company.panel.description, "company.panel.description"),
      metric: {
        value: requiredText(company.panel.metric.value, "company.panel.metric.value"),
        label: requiredText(company.panel.metric.label, "company.panel.metric.label"),
      },
    },
  };
}

export function mapMethodology(
  methodology: QueryMethodology,
): AboutPageContent["methodology"] {
  return {
    heading: mapHeading(methodology.heading, "methodology.heading"),
    label: requiredText(methodology.label, "methodology.label"),
    items: requiredList(methodology.items, "methodology.items").map((item, index) => {
      const field = `methodology.items[${index}]`;
      const phase = mapStageNote(item.phase, `${field}.phase`);
      const note = mapStageNote(item.note, `${field}.note`);
      return {
        id: requiredText(item._key, `${field}._key`),
        title: requiredText(item.title, `${field}.title`),
        description: requiredText(item.description, `${field}.description`),
        ...(phase ? { phase } : {}),
        ...(note ? { note } : {}),
      };
    }),
  };
}

export function mapValues(values: QueryValues): AboutPageContent["values"] {
  return {
    heading: mapHeading(values.heading, "values.heading"),
    items: requiredList(values.items, "values.items").map((item, index) => {
      const field = `values.items[${index}]`;
      return {
        id: requiredText(item._key, `${field}._key`),
        title: requiredText(item.title, `${field}.title`),
        description: requiredText(item.description, `${field}.description`),
        icon: requiredIcon(item.icon, VALUE_ICONS, `${field}.icon`),
        checks: requiredList(item.checks, `${field}.checks`).map((check, checkIndex) => ({
          id: requiredText(check._key, `${field}.checks[${checkIndex}]._key`),
          label: requiredText(check.label, `${field}.checks[${checkIndex}].label`),
        })),
      };
    }),
  };
}

export function mapProfile(profile: QueryProfile): AboutPageContent["profile"] {
  const asset = profile.file?.asset;
  let file: AboutPageContent["profile"]["file"] = null;

  if (profile.file && !asset) {
    throw new AboutPageError(
      'Sanity about content is incomplete: "profile.file" has no asset. Re-upload the PDF or clear the field.',
    );
  }

  if (asset) {
    const url = requiredText(asset.url, "profile.file.url");
    const fileName = requiredText(
      asset.originalFilename,
      "profile.file.originalFilename",
    );
    const mimeType = optionalText(asset.mimeType);
    const sizeLabel = formatFileSize(asset.size);

    if (mimeType && mimeType !== "application/pdf") {
      throw new AboutPageError(
        'Sanity about content has an unsupported file at "profile.file". Upload a PDF.',
      );
    }

    file = {
      href: downloadHref(url, fileName),
      fileName,
      ...(sizeLabel ? { sizeLabel } : {}),
    };
  }

  return {
    badge: requiredText(profile.badge, "profile.badge"),
    version: requiredText(profile.version, "profile.version"),
    title: requiredText(profile.title, "profile.title"),
    description: requiredText(profile.description, "profile.description"),
    downloadLabel: requiredText(profile.downloadLabel, "profile.downloadLabel"),
    file,
    unavailableLabel: requiredText(profile.unavailableLabel, "profile.unavailableLabel"),
    unavailableHint: requiredText(profile.unavailableHint, "profile.unavailableHint"),
  };
}
