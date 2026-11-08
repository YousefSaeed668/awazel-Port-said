import "server-only";

import { isSafeExternalUrl } from "@/lib/links";
import type {
  ProjectBodyCalloutBlock,
  ProjectBodyImageBlock,
  ProjectBodyLinkMark,
  ProjectBodySpan,
  ProjectBodyTextBlock,
  ProjectBodyValue,
  ProjectTextBlockStyle,
} from "@/lib/project-detail";

import type { PROJECT_DETAIL_QUERY_RESULT } from "../sanity.types";
import {
  mapProjectSizedImage,
  optionalText,
  ProjectContentError,
  type ProjectQueryImage,
} from "./project-mapping";

type QueryProject = NonNullable<PROJECT_DETAIL_QUERY_RESULT>;
export type QueryProjectBody = NonNullable<QueryProject["body"]>;

type QuerySpan = {
  _type?: string | null;
  _key?: string | null;
  text?: string | null;
  marks?: ReadonlyArray<string | null> | null;
};

type QueryMark = {
  _key?: string | null;
  _type?: string | null;
  href?: string | null;
  openInNewTab?: boolean | null;
};

type TextBlockInput = {
  _type: "block";
  _key?: string | null;
  style?: string | null;
  listItem?: string | null;
  level?: number | null;
  children?: ReadonlyArray<QuerySpan | null> | null;
  markDefs?: ReadonlyArray<QueryMark | null> | null;
};

type BodyBlockInput =
  | TextBlockInput
  | {
      _type: "projectBodyImage";
      _key?: string | null;
      caption?: string | null;
      image?: ProjectQueryImage | null;
    }
  | {
      _type: "projectCallout";
      _key?: string | null;
      tone?: string | null;
      title?: string | null;
      body?: ReadonlyArray<TextBlockInput | null> | null;
    };

const TEXT_STYLES: readonly ProjectTextBlockStyle[] = [
  "normal",
  "h2",
  "h3",
  "h4",
  "blockquote",
];

const CALLOUT_TONES = ["info", "warning", "technical"] as const;

function blockKey(value: { _key?: string | null }, field: string) {
  const key = optionalText(value._key);
  if (!key) {
    throw new ProjectContentError(`"${field}" block is missing its _key.`);
  }
  return key;
}

function textStyle(value: string | null | undefined): ProjectTextBlockStyle {
  return (
    TEXT_STYLES.find((style) => style === optionalText(value)) ?? "normal"
  );
}

function mapSpans(
  spans: ReadonlyArray<QuerySpan | null> | null | undefined,
  marks: readonly ProjectBodyLinkMark[],
  field: string,
): ProjectBodySpan[] {
  const allowed = new Set<string>([
    "strong",
    "em",
    "underline",
    ...marks.map((mark) => mark._key),
  ]);

  return (spans ?? []).flatMap((span, index) => {
    if (!span) return [];
    const text = span.text ?? "";
    if (!text) return [];

    return [
      {
        _type: "span" as const,
        _key: optionalText(span._key) ?? `${field}-span-${index}`,
        text,
        marks: (span.marks ?? []).filter(
          (mark): mark is string => typeof mark === "string" && allowed.has(mark),
        ),
      },
    ];
  });
}

function mapMarkDefs(
  defs: ReadonlyArray<QueryMark | null> | null | undefined,
): ProjectBodyLinkMark[] {
  const seen = new Set<string>();

  return (defs ?? []).flatMap((def) => {
    if (!def || def._type !== "projectLink") return [];

    const key = optionalText(def._key);
    const href = def.href?.trim();

    if (!key || !href || !isSafeExternalUrl(href) || seen.has(key)) return [];
    seen.add(key);

    return [
      {
        _key: key,
        _type: "projectLink" as const,
        href,
        openInNewTab: def.openInNewTab !== false,
      },
    ];
  });
}

function mapTextBlock(
  block: TextBlockInput,
  field: string,
): ProjectBodyTextBlock | null {
  const markDefs = mapMarkDefs(block.markDefs);
  const children = mapSpans(block.children, markDefs, field);
  if (!children.length) return null;

  const listItem =
    block.listItem === "number" || block.listItem === "bullet"
      ? block.listItem
      : undefined;

  return {
    _type: "block",
    _key: blockKey(block, field),
    style: textStyle(block.style),
    ...(listItem ? { listItem } : {}),
    ...(typeof block.level === "number" && block.level > 1
      ? { level: block.level }
      : {}),
    children,
    markDefs,
  };
}

function mapCallout(
  block: Extract<BodyBlockInput, { _type: "projectCallout" }>,
  field: string,
): ProjectBodyCalloutBlock {
  const key = blockKey(block, field);
  const body = (block.body ?? []).flatMap((item, index) => {
    if (!item) return [];
    const mapped = mapTextBlock(item, `${field}.body[${index}]`);
    return mapped ? [mapped] : [];
  });

  if (!body.length) {
    throw new ProjectContentError(`"${field}" callout body is required.`);
  }

  return {
    _type: "projectCallout",
    _key: key,
    tone:
      CALLOUT_TONES.find((tone) => tone === optionalText(block.tone)) ??
      "technical",
    ...(optionalText(block.title) ? { title: optionalText(block.title) } : {}),
    body,
  };
}

function mapImageBlock(
  block: Extract<BodyBlockInput, { _type: "projectBodyImage" }>,
  field: string,
): ProjectBodyImageBlock {
  return {
    _type: "projectBodyImage",
    _key: blockKey(block, field),
    image: mapProjectSizedImage(block.image, `${field}.image`, 1200),
    ...(optionalText(block.caption)
      ? { caption: optionalText(block.caption) }
      : {}),
  };
}

export function mapProjectBody(
  value: QueryProjectBody | null | undefined,
): ProjectBodyValue {
  const blocks = value as ReadonlyArray<BodyBlockInput> | null | undefined;
  const seen = new Set<string>();
  let headingIndex = 0;

  return (blocks ?? []).flatMap((block, index) => {
    if (!block) return [];

    const field = `body[${index}]`;
    let mapped: ProjectBodyTextBlock | ProjectBodyImageBlock | ProjectBodyCalloutBlock | null =
      null;

    if (block._type === "block") {
      mapped = mapTextBlock(block, field);
    } else if (block._type === "projectBodyImage") {
      mapped = mapImageBlock(block, field);
    } else if (block._type === "projectCallout") {
      mapped = mapCallout(block, field);
    }

    if (!mapped) return [];
    if (seen.has(mapped._key)) {
      throw new ProjectContentError(`"${field}" repeats the key ${mapped._key}.`);
    }
    seen.add(mapped._key);

    if (mapped._type === "block" && mapped.style === "h2") {
      mapped = {
        ...mapped,
        accent: headingIndex % 2 === 0 ? "gold" : "blue",
      };
      headingIndex += 1;
    }

    return [mapped];
  });
}
