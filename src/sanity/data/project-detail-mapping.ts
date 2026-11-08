import "server-only";

import {
  formatProjectDate,
  PROJECT_FACT_ICONS,
  PROJECT_VERIFICATION_ICONS,
  PROJECT_VERIFICATION_TONES,
  type ProjectApproval,
  type ProjectDetailContent,
  type ProjectDetailFact,
  type ProjectDetailSidebar,
  type ProjectGalleryImage,
  type ProjectVerificationItem,
} from "@/lib/project-detail";
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUS_TONES,
  projectPath,
} from "@/lib/projects";

import type {
  PROJECT_DETAIL_QUERY_RESULT,
  PROJECT_SITEMAP_QUERY_RESULT,
} from "../sanity.types";
import { mapProjectBody } from "./project-body-mapping";
import {
  mapProjectSizedImage,
  optionalText,
  ProjectContentError,
  requiredText,
} from "./project-mapping";

type QueryProject = NonNullable<PROJECT_DETAIL_QUERY_RESULT>;

function assertUniqueKeys(
  items: ReadonlyArray<{ _key?: string | null }>,
  field: string,
) {
  const seen = new Set<string>();

  for (const item of items) {
    const key = optionalText(item._key);
    if (!key) {
      throw new ProjectContentError(`"${field}" item is missing its _key.`);
    }
    if (seen.has(key)) {
      throw new ProjectContentError(
        `"${field}" repeats the key ${key}.`,
      );
    }
    seen.add(key);
  }
}

function mapFacts(document: QueryProject): ProjectDetailFact[] {
  const facts: ProjectDetailFact[] = [];
  const warranty = optionalText(document.detail?.warranty);
  const scope = optionalText(document.detail?.scope);

  if (warranty) {
    facts.push({
      id: "warranty",
      label: "الضمان والفحص",
      value: warranty,
      icon: "warranty",
    });
  }

  facts.push({
    id: "date",
    label: "تاريخ الإنجاز",
    value: formatProjectDate(requiredText(document.completedAt, "completedAt")),
    icon: "date",
  });

  facts.push({
    id: "measurement",
    label: requiredText(document.measurement?.label, "measurement.label"),
    value: requiredText(document.measurement?.value, "measurement.value"),
    icon: "measurement",
  });

  facts.push({
    id: "system",
    label: requiredText(document.system?.label, "system.label"),
    value: requiredText(document.system?.value, "system.value"),
    icon: "system",
  });

  if (scope) {
    facts.push({
      id: "scope",
      label: "نطاق العمل",
      value: scope,
      icon: "scope",
    });
  }

  facts.push({
    id: "location",
    label: "الموقع الجغرافي",
    value: requiredText(document.location, "location"),
    icon: "location",
  });

  return facts.filter((fact) =>
    (PROJECT_FACT_ICONS as readonly string[]).includes(fact.icon),
  );
}

function mapGallery(document: QueryProject): ProjectGalleryImage[] {
  const gallery = document.gallery ?? [];
  if (!gallery.length) {
    throw new ProjectContentError('"gallery" needs at least one image.');
  }

  const seen = new Set<string>();

  return gallery.map((image, index) => {
    const mapped = mapProjectSizedImage(image, `gallery[${index}]`, 1600);
    const id =
      optionalText(image?._key) ??
      optionalText(image?.asset?._ref) ??
      `gallery-${index}`;

    if (seen.has(id)) {
      throw new ProjectContentError(
        `"gallery" repeats the identity ${id}.`,
      );
    }
    seen.add(id);

    return {
      id,
      src: mapped.src,
      alt: mapped.alt,
      width: mapped.width,
      height: mapped.height,
    };
  });
}

function mapSidebar(document: QueryProject): ProjectDetailSidebar {
  const detail = document.detail;
  const sidebar: ProjectDetailSidebar = {};

  const roleDescription = optionalText(detail?.engineeringRole?.description);
  if (roleDescription) {
    sidebar.engineeringRole = {
      description: roleDescription,
      tags: (detail?.engineeringRole?.tags ?? []).flatMap((tag) => {
        const normalized = optionalText(tag);
        return normalized ? [normalized] : [];
      }),
    };
  }

  const rows = detail?.technicalSpecs?.rows ?? [];
  if (rows.length) {
    assertUniqueKeys(rows, "technicalSpecs.rows");
    sidebar.technicalSpecs = {
      ...(optionalText(detail?.technicalSpecs?.note)
        ? { note: optionalText(detail?.technicalSpecs?.note) }
        : {}),
      rows: rows.map((row, index) => ({
        id: optionalText(row?._key) as string,
        label: requiredText(row?.label, `technicalSpecs.rows[${index}].label`),
        value: requiredText(row?.value, `technicalSpecs.rows[${index}].value`),
        emphasis: row?.emphasis === true,
      })),
    };
  }

  const approvalItems = detail?.approvals?.items ?? [];
  if (approvalItems.length) {
    assertUniqueKeys(approvalItems, "approvals.items");
    const approvals: ProjectApproval[] = approvalItems.map((item, index) => ({
      id: optionalText(item?._key) as string,
      name: requiredText(item?.name, `approvals.items[${index}].name`),
      description: requiredText(
        item?.description,
        `approvals.items[${index}].description`,
      ),
    }));
    sidebar.approvals = approvals;
  }

  return sidebar;
}

function mapVerification(
  document: QueryProject,
): ProjectVerificationItem[] | undefined {
  const items = document.detail?.verification?.items ?? [];
  if (!items.length) return undefined;

  assertUniqueKeys(items, "verification.items");

  return items.map((item, index) => {
    const field = `verification.items[${index}]`;
    const icon = PROJECT_VERIFICATION_ICONS.find(
      (candidate) => candidate === optionalText(item?.icon),
    );
    if (!icon) {
      throw new ProjectContentError(`"${field}.icon" is not supported.`);
    }

    const tone =
      PROJECT_VERIFICATION_TONES.find(
        (candidate) => candidate === optionalText(item?.tone),
      ) ?? "neutral";

    return {
      id: optionalText(item?._key) as string,
      title: requiredText(item?.title, `${field}.title`),
      description: requiredText(item?.description, `${field}.description`),
      icon,
      footer: requiredText(item?.footer, `${field}.footer`),
      tone,
    };
  });
}

export function mapProjectDetail(
  document: PROJECT_DETAIL_QUERY_RESULT,
): ProjectDetailContent {
  if (!document) {
    throw new ProjectContentError("The project document is missing.");
  }

  const id = requiredText(document._id, "_id");
  const title = requiredText(document.title, "title");
  const slug = requiredText(document.slug, "slug");
  const summary = requiredText(document.summary, "summary");
  const location = requiredText(document.location, "location");
  const completedAt = requiredText(document.completedAt, "completedAt");

  if (!Number.isFinite(Date.parse(completedAt))) {
    throw new ProjectContentError('"completedAt" is not a valid date.');
  }

  const category = PROJECT_CATEGORIES.find(
    (candidate) => candidate === optionalText(document.category),
  );
  if (!category) {
    throw new ProjectContentError('"category" is not supported.');
  }

  const tone = PROJECT_STATUS_TONES.find(
    (candidate) => candidate === optionalText(document.status?.tone),
  );
  if (!tone) {
    throw new ProjectContentError('"status.tone" is not supported.');
  }

  const body = mapProjectBody(document.body);
  if (!body.length) {
    throw new ProjectContentError('"body" needs at least one block.');
  }

  const cover = mapProjectSizedImage(document.cover, "cover", 1600);

  return {
    id,
    title,
    slug,
    href: projectPath(slug),
    summary,
    category,
    status: {
      label: requiredText(document.status?.label, "status.label"),
      tone,
    },
    location,
    completedAt,
    ...(optionalText(document.detail?.approvalNumber)
      ? { approvalNumber: optionalText(document.detail?.approvalNumber) }
      : {}),
    facts: mapFacts(document),
    cover,
    ...(optionalText(document.detail?.coverNote)
      ? { coverNote: optionalText(document.detail?.coverNote) }
      : {}),
    ...(optionalText(document.detail?.coverStandard)
      ? { coverStandard: optionalText(document.detail?.coverStandard) }
      : {}),
    body,
    gallery: mapGallery(document),
    sidebar: mapSidebar(document),
    verification: mapVerification(document),
    seo: {
      title: optionalText(document.seo?.title) ?? title,
      description: optionalText(document.seo?.description) ?? summary,
    },
  };
}

export type ProjectSitemapEntry = {
  slug: string;
  lastModified?: string;
};

export function mapProjectSitemapEntries(
  documents: PROJECT_SITEMAP_QUERY_RESULT,
): ProjectSitemapEntry[] {
  return documents.flatMap((document) => {
    const slug = optionalText(document.slug);
    if (!slug) return [];

    const updated = document._updatedAt?.trim();
    const completed = document.completedAt?.trim();
    const updatedValid =
      updated && Number.isFinite(new Date(updated).getTime());
    const completedValid =
      completed && Number.isFinite(new Date(completed).getTime());

    return [
      {
        slug,
        lastModified: updatedValid ? updated : completedValid ? completed : undefined,
      },
    ];
  });
}
