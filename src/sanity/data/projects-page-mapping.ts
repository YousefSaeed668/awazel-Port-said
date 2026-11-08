import "server-only";

import { resolveDestination, type DestinationInput } from "@/lib/links";
import {
  PROJECT_ASSURANCE_ICONS,
  type ProjectsPageContent,
} from "@/lib/projects";

import type { PROJECTS_PAGE_QUERY_RESULT } from "../sanity.types";
import {
  ProjectContentError,
  requiredText,
} from "./project-mapping";

type QueryDocument = NonNullable<PROJECTS_PAGE_QUERY_RESULT>;
type QueryAction = NonNullable<
  NonNullable<QueryDocument["closing"]>["whatsappAction"]
>;

function required<T>(value: T | null | undefined, field: string): T {
  if (value === null || value === undefined) {
    throw new ProjectContentError(`"${field}" is required.`);
  }
  return value;
}

function keyed<T extends { _key: string }>(
  items: readonly T[] | null | undefined,
  field: string,
  min = 0,
): readonly T[] {
  const list = items ?? [];
  if (list.length < min) {
    throw new ProjectContentError(
      `"${field}" needs at least ${min} entries.`,
    );
  }
  const keys = new Set<string>();
  for (const item of list) {
    const key = requiredText(item._key, `${field}._key`);
    if (keys.has(key)) {
      throw new ProjectContentError(`"${field}" has duplicate keys.`);
    }
    keys.add(key);
  }
  return list;
}

function destination(value: DestinationInput, field: string) {
  const result = resolveDestination(value);
  if (!result) {
    throw new ProjectContentError(
      `"${field}" has a missing or unsafe destination.`,
    );
  }
  return result;
}

function action(value: QueryAction | null | undefined, field: string) {
  const source = required(value, field);
  if (source.enabled === false) {
    throw new ProjectContentError(`"${field}" must be enabled.`);
  }
  return {
    ...destination(source.destination, `${field}.destination`),
    label: requiredText(source.label, `${field}.label`),
  };
}

export function mapProjectsPage(
  document: QueryDocument | null,
): ProjectsPageContent {
  if (!document) {
    throw new ProjectContentError(
      '"projectsPage" was not found. Create and publish it at /studio.',
    );
  }

  const intro = required(document.intro, "intro");
  const assurance = required(document.assurance, "assurance");
  const closing = required(document.closing, "closing");
  const seo = required(document.seo, "seo");
  const breadcrumbs = keyed(intro.breadcrumbs, "intro.breadcrumbs", 2);

  return {
    breadcrumbs: breadcrumbs.map((item, index) => ({
      id: item._key,
      label: requiredText(item.label, "intro.breadcrumbs.label"),
      href:
        index < breadcrumbs.length - 1
          ? destination(
              item.destination,
              "intro.breadcrumbs.destination",
            ).href
          : undefined,
    })),
    intro: {
      eyebrow: requiredText(intro.eyebrow, "intro.eyebrow"),
      title: requiredText(intro.title, "intro.title"),
      description: requiredText(intro.description, "intro.description"),
      context: requiredText(intro.context, "intro.context"),
    },
    assurance: {
      items: keyed(assurance.items, "assurance.items", 2).map((item) => {
        const icon = PROJECT_ASSURANCE_ICONS.find(
          (value) => value === item.icon,
        );
        if (!icon) {
          throw new ProjectContentError(
            `"assurance.${item._key}.icon" is unsupported.`,
          );
        }
        return {
          id: item._key,
          icon,
          title: requiredText(item.title, "assurance.items.title"),
          description: requiredText(
            item.description,
            "assurance.items.description",
          ),
        };
      }),
    },
    closing: {
      eyebrow: requiredText(closing.eyebrow, "closing.eyebrow"),
      title: requiredText(closing.title, "closing.title"),
      description: requiredText(closing.description, "closing.description"),
      whatsappAction: action(
        closing.whatsappAction,
        "closing.whatsappAction",
      ),
    },
    seo: {
      title: requiredText(seo.title, "seo.title"),
      description: requiredText(seo.description, "seo.description"),
    },
  };
}
