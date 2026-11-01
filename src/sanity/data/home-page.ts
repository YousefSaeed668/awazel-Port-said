import "server-only";

import { cache } from "react";

import type { HomePageContent } from "@/lib/data";

import { sanityClient } from "../lib/client";
import { HOME_PAGE_TAG } from "../lib/cache-tags";
import { HOME_PAGE_QUERY } from "../queries/home-page";
import type { HOME_PAGE_QUERY_RESULT } from "../sanity.types";
import {
  HomePageError,
  mapAction,
  mapHeading,
  mapImage,
  optionalText,
  requiredIcon,
  requiredList,
  requiredText,
  type QueryCompany,
  type QueryFaq,
  type QueryHero,
  type QueryQuality,
  type QueryWorkStages,
} from "./home-page-mapping";

type QueryDocument = NonNullable<HOME_PAGE_QUERY_RESULT>;
type HighlightValue = HomePageContent["hero"]["highlights"][number];
type FeatureValue = HomePageContent["company"]["features"][number];
type StageValue = HomePageContent["workStages"]["items"][number];
type QualityCheckValue = HomePageContent["quality"]["checks"][number];
type FaqValue = HomePageContent["faq"]["items"][number];

const HIGHLIGHT_ICONS = ["compliance", "quality", "supervision"] as const;
const FEATURE_ICONS = ["target", "badge", "shield"] as const;
const STAGE_ICONS = [
  "headset",
  "target",
  "file",
  "settings",
  "check",
  "badge",
] as const;
const QUALITY_ICONS = ["water", "ruler", "document"] as const;

function mapHero(hero: QueryHero): HomePageContent["hero"] {
  if (!hero?.panel) {
    throw new HomePageError(
      'Sanity homepage content is incomplete: "hero.panel" is required.',
    );
  }

  return {
    eyebrow: requiredText(hero.eyebrow, "hero.eyebrow"),
    title: requiredText(hero.title, "hero.title"),
    highlight: requiredText(hero.highlight, "hero.highlight"),
    description: requiredText(hero.description, "hero.description"),
    primaryAction: mapAction(hero.primaryAction, "hero.primaryAction", true),
    secondaryAction: mapAction(
      hero.secondaryAction,
      "hero.secondaryAction",
      true,
    ),
    highlights: requiredList(hero.highlights, "hero.highlights").map(
      (item, index): HighlightValue => ({
        id: requiredText(item._key, `hero.highlights[${index}]._key`),
        label: requiredText(item.label, `hero.highlights[${index}].label`),
        icon: requiredIcon(
          item.icon,
          HIGHLIGHT_ICONS,
          `hero.highlights[${index}].icon`,
        ),
      }),
    ),
    image: mapImage(hero.image, "hero.image", 1600),
    panel: {
      status: requiredText(hero.panel.status, "hero.panel.status"),
      location: requiredText(hero.panel.location, "hero.panel.location"),
      title: requiredText(hero.panel.title, "hero.panel.title"),
    },
  };
}

function mapCompany(company: QueryCompany): HomePageContent["company"] {
  if (!company?.panel) {
    throw new HomePageError(
      'Sanity homepage content is incomplete: "company.panel" is required.',
    );
  }

  return {
    eyebrow: requiredText(company.eyebrow, "company.eyebrow"),
    title: requiredText(company.title, "company.title"),
    description: requiredText(company.description, "company.description"),
    image: mapImage(company.image, "company.image", 1600),
    panel: {
      title: requiredText(company.panel.title, "company.panel.title"),
      description: requiredText(
        company.panel.description,
        "company.panel.description",
      ),
    },
    features: requiredList(company.features, "company.features").map(
      (item, index): FeatureValue => ({
        id: requiredText(item._key, `company.features[${index}]._key`),
        title: requiredText(item.title, `company.features[${index}].title`),
        description: requiredText(
          item.description,
          `company.features[${index}].description`,
        ),
        icon: requiredIcon(
          item.icon,
          FEATURE_ICONS,
          `company.features[${index}].icon`,
        ),
      }),
    ),
    primaryAction: mapAction(
      company.primaryAction,
      "company.primaryAction",
      true,
    ),
    secondaryAction: mapAction(
      company.secondaryAction,
      "company.secondaryAction",
      true,
    ),
  };
}

function mapWorkStages(
  workStages: QueryWorkStages,
): HomePageContent["workStages"] {
  return {
    heading: mapHeading(workStages.heading, "workStages.heading"),
    label: requiredText(workStages.label, "workStages.label"),
    items: requiredList(workStages.items, "workStages.items").map(
      (item, index): StageValue => ({
        id: requiredText(item._key, `workStages.items[${index}]._key`),
        title: requiredText(item.title, `workStages.items[${index}].title`),
        description: requiredText(
          item.description,
          `workStages.items[${index}].description`,
        ),
        icon: requiredIcon(
          item.icon,
          STAGE_ICONS,
          `workStages.items[${index}].icon`,
        ),
        ...(item.note
          ? {
              note: {
                text: requiredText(
                  item.note.text,
                  `workStages.items[${index}].note.text`,
                ),
                tone: item.note.tone === "success" ? "success" : "default",
              },
            }
          : {}),
      }),
    ),
  };
}

function mapQuality(quality: QueryQuality): HomePageContent["quality"] {
  if (!quality?.warranty) {
    throw new HomePageError(
      'Sanity homepage content is incomplete: "quality.warranty" is required.',
    );
  }

  const warranty = quality.warranty;

  return {
    eyebrow: requiredText(quality.eyebrow, "quality.eyebrow"),
    title: requiredText(quality.title, "quality.title"),
    description: requiredText(quality.description, "quality.description"),
    checks: requiredList(quality.checks, "quality.checks").map(
      (item, index): QualityCheckValue => ({
        id: requiredText(item._key, `quality.checks[${index}]._key`),
        title: requiredText(item.title, `quality.checks[${index}].title`),
        description: requiredText(
          item.description,
          `quality.checks[${index}].description`,
        ),
        icon: requiredIcon(
          item.icon,
          QUALITY_ICONS,
          `quality.checks[${index}].icon`,
        ),
      }),
    ),
    warranty: {
      badge: optionalText(warranty.badge),
      title: requiredText(warranty.title, "quality.warranty.title"),
      description: requiredText(
        warranty.description,
        "quality.warranty.description",
      ),
      items: (warranty.items ?? []).flatMap((item) => {
        const value = optionalText(item);
        return value ? [value] : [];
      }),
      action: mapAction(warranty.action, "quality.warranty.action", true),
    },
  };
}

function mapFaq(faq: QueryFaq): HomePageContent["faq"] {
  return {
    heading: mapHeading(faq.heading, "faq.heading"),
    items: requiredList(faq.items, "faq.items").map(
      (item, index): FaqValue => ({
        id: requiredText(item._key, `faq.items[${index}]._key`),
        question: requiredText(item.question, `faq.items[${index}].question`),
        answer: requiredText(item.answer, `faq.items[${index}].answer`),
      }),
    ),
  };
}

export const getHomePageContent = cache(async (): Promise<HomePageContent> => {
  const document = await sanityClient.fetch<QueryDocument | null>(
    HOME_PAGE_QUERY,
    {},
    {
      cache: "force-cache",
      next: {
        revalidate: false,
        tags: [HOME_PAGE_TAG],
      },
      perspective: "published",
      stega: false,
      useCdn: false,
    },
  );

  if (!document) {
    throw new HomePageError(
      'Sanity homepage document "homePage" was not found. Create and publish it in Studio at /studio (or run npm run seed:home-page) before building the public site.',
    );
  }

  if (!document.hero || !document.company || !document.workStages) {
    throw new HomePageError(
      'Sanity homepage content is incomplete: "hero", "company", and "workStages" are required.',
    );
  }

  if (!document.quality || !document.faq) {
    throw new HomePageError(
      'Sanity homepage content is incomplete: "quality" and "faq" are required.',
    );
  }

  return {
    hero: mapHero(document.hero),
    company: mapCompany(document.company),
    workStages: mapWorkStages(document.workStages),
    quality: mapQuality(document.quality),
    faq: mapFaq(document.faq),
  };
});
