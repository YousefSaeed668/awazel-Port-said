import "server-only";

import { articlePath } from "@/lib/blog";
import type {
  ArticleBodyValue,
  ArticleCalloutTone,
  ArticleImage,
  ArticleLinkMarkDef,
  ArticlePromoAction,
  ArticleTextBlock,
  ArticleTextBlockStyle,
} from "@/lib/blog";

import { isSafeExternalUrl, resolveDestination } from "@/lib/links";

import { imageUrl } from "../lib/image";
import type {
  ARTICLE_BY_ID_QUERY_RESULT,
  SanityImageCrop,
  SanityImageHotspot,
} from "../sanity.types";

export class ArticleContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArticleContentError";
  }
}

type QueryArticle = NonNullable<ARTICLE_BY_ID_QUERY_RESULT>;
export type QueryArticleBody = NonNullable<QueryArticle["body"]>;
type QueryBodyBlock = QueryArticleBody[number];
type QueryTextBlock = Extract<QueryBodyBlock, { _type: "block" }>;

type QueryImage = {
  alt?: string | null;
  asset?: { _ref?: string | null } | null;
  crop?: SanityImageCrop | null;
  hotspot?: SanityImageHotspot | null;
  dimensions?: {
    width?: number | null;
    height?: number | null;
  } | null;
};

const TEXT_STYLES: readonly ArticleTextBlockStyle[] = [
  "normal",
  "h2",
  "h3",
  "h4",
  "blockquote",
];

const CALLOUT_TONES: readonly ArticleCalloutTone[] = [
  "info",
  "warning",
  "technical",
];

function requiredText(value: string | null | undefined, field: string) {
  const normalized = value?.trim();
  if (normalized) return normalized;
  throw new ArticleContentError(
    `Sanity article content is incomplete: "${field}" is required.`,
  );
}

function optionalText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function mapArticleImage(
  image: QueryImage | null | undefined,
  field: string,
  width: number,
): ArticleImage {
  if (!image?.asset?._ref) {
    throw new ArticleContentError(
      `Sanity article content is missing an image at "${field}".`,
    );
  }

  const imageWidth = image.dimensions?.width;
  const imageHeight = image.dimensions?.height;

  if (!imageWidth || !imageHeight) {
    throw new ArticleContentError(
      `Sanity image metadata is missing for "${field}". Re-upload the image asset.`,
    );
  }

  const hotspot = image.hotspot;
  const objectPosition =
    hotspot && typeof hotspot.x === "number" && typeof hotspot.y === "number"
      ? `${(hotspot.x * 100).toFixed(2)}% ${(hotspot.y * 100).toFixed(2)}%`
      : undefined;

  return {
    src: imageUrl(
      {
        _type: "image",
        asset: image.asset as { _ref: string; _type: "reference" },
        crop: image.crop ?? undefined,
        hotspot: hotspot ?? undefined,
      },
      width,
    ),
    alt: requiredText(image.alt, `${field}.alt`),
    width: imageWidth,
    height: imageHeight,
    ...(objectPosition ? { objectPosition } : {}),
  };
}

function mapOptionalImage(
  image: QueryImage | null | undefined,
  field: string,
  width: number,
) {
  if (!image?.asset?._ref) return undefined;
  return mapArticleImage(image, field, width);
}

function mapMarkDef(
  markDef: QueryTextBlock["markDefs"] extends
    ReadonlyArray<infer Definition> | null | undefined
    ? Definition
    : never,
): ArticleLinkMarkDef | null {
  if (markDef._type === "articleLink") {
    const href = markDef.href?.trim();
    if (!href || !isSafeExternalUrl(href)) return null;

    return {
      _key: markDef._key,
      _type: "articleLink",
      href,
      external: true,
      openInNewTab: markDef.openInNewTab !== false,
    };
  }

  if (markDef._type === "articleReference") {
    const slug = markDef.referenceSlug?.trim();
    if (!slug) return null;

    return {
      _key: markDef._key,
      _type: "articleLink",
      href: articlePath(slug),
      external: false,
      openInNewTab: false,
    };
  }

  return null;
}

function mapTextBlock(block: QueryTextBlock, field: string): ArticleTextBlock {
  const style = block.style ?? "normal";
  if (!TEXT_STYLES.includes(style)) {
    throw new ArticleContentError(
      `Sanity article content has an unsupported text style at "${field}.style".`,
    );
  }

  return {
    _type: "block",
    _key: block._key,
    style,
    ...(block.listItem ? { listItem: block.listItem } : {}),
    ...(block.level ? { level: block.level } : {}),
    children: (block.children ?? []).map((span) => ({
      _type: "span",
      _key: span._key,
      text: span.text ?? "",
      marks: span.marks ?? [],
    })),
    markDefs: (block.markDefs ?? []).flatMap((markDef) => {
      const mapped = mapMarkDef(markDef);
      return mapped ? [mapped] : [];
    }),
  };
}

function mapPromoAction(
  action: {
    label: string | null;
    destination: {
      kind: "external" | "internal" | null;
      href: string | null;
      openInNewTab: boolean | null;
    } | null;
  } | null,
  field: string,
): ArticlePromoAction | null {
  if (!action) return null;

  const label = requiredText(action.label, `${field}.label`);
  const destination = resolveDestination(action.destination);
  if (!destination) return null;

  return { label, ...destination };
}

function mapBodyBlock(
  block: QueryBodyBlock,
  index: number,
): ArticleBodyValue[number] {
  const field = `body[${index}]`;

  switch (block._type) {
    case "block":
      return mapTextBlock(block, field);
    case "articleBodyImage":
      return {
        _type: "articleBodyImage",
        _key: block._key,
        image: mapArticleImage(block.image, `${field}.image`, 1200),
        ...(optionalText(block.caption)
          ? { caption: optionalText(block.caption) }
          : {}),
      };
    case "articleCallout": {
      const tone = block.tone ?? "info";
      if (!CALLOUT_TONES.includes(tone)) {
        throw new ArticleContentError(
          `Sanity article content has an unsupported callout tone at "${field}.tone".`,
        );
      }

      const body = block.body ?? [];
      if (body.length === 0) {
        throw new ArticleContentError(
          `Sanity article content is incomplete: "${field}.body" is required.`,
        );
      }

      return {
        _type: "articleCallout",
        _key: block._key,
        tone,
        ...(optionalText(block.title)
          ? { title: optionalText(block.title) }
          : {}),
        body: body.map((textBlock, textIndex) =>
          mapTextBlock(textBlock, `${field}.body[${textIndex}]`),
        ),
      };
    }
    case "articleTable": {
      const rows = block.rows ?? [];
      if (rows.length === 0) {
        throw new ArticleContentError(
          `Sanity article content is incomplete: "${field}.rows" is required.`,
        );
      }

      const headers = (block.headers ?? [])
        .map((header) => header.trim())
        .filter(Boolean);

      if (headers.length > 0 && headers.length > 6) {
        throw new ArticleContentError(
          `Sanity article content has too many columns at "${field}.headers".`,
        );
      }

      return {
        _type: "articleTable",
        _key: block._key,
        ...(optionalText(block.caption)
          ? { caption: optionalText(block.caption) }
          : {}),
        ...(headers.length ? { headers } : {}),
        rows: rows.map((row, rowIndex) => {
          const cells = row.cells ?? [];
          if (headers.length > 0 && cells.length !== headers.length) {
            throw new ArticleContentError(
              `Sanity article content has a mismatched table row at "${field}.rows[${rowIndex}]".`,
            );
          }
          if (cells.length === 0) {
            throw new ArticleContentError(
              `Sanity article content has an empty table row at "${field}.rows[${rowIndex}]".`,
            );
          }

          return {
            key: row._key,
            cells: cells.map((cell, cellIndex) =>
              requiredText(
                cell,
                `${field}.rows[${rowIndex}].cells[${cellIndex}]`,
              ),
            ),
          };
        }),
      };
    }
    case "articleCardGroup": {
      const cards = block.cards ?? [];
      if (cards.length === 0) {
        throw new ArticleContentError(
          `Sanity article content is incomplete: "${field}.cards" is required.`,
        );
      }

      return {
        _type: "articleCardGroup",
        _key: block._key,
        ...(optionalText(block.title)
          ? { title: optionalText(block.title) }
          : {}),
        ...(optionalText(block.description)
          ? { description: optionalText(block.description) }
          : {}),
        cards: cards.map((card, cardIndex) => ({
          key: card._key,
          ...(card.icon === "water" ||
          card.icon === "thermal" ||
          card.icon === "layers"
            ? { icon: card.icon }
            : {}),
          title: requiredText(card.title, `${field}.cards[${cardIndex}].title`),
          description: requiredText(
            card.description,
            `${field}.cards[${cardIndex}].description`,
          ),
        })),
      };
    }
    case "articleExplanation": {
      const points = (block.points ?? [])
        .map((point) => point.trim())
        .filter(Boolean);
      const image = mapOptionalImage(block.image, `${field}.image`, 1000);

      return {
        _type: "articleExplanation",
        _key: block._key,
        title: requiredText(block.title, `${field}.title`),
        text: requiredText(block.text, `${field}.text`),
        ...(image ? { image } : {}),
        ...(optionalText(block.imageCaption)
          ? { imageCaption: optionalText(block.imageCaption) }
          : {}),
        ...(points.length ? { points } : {}),
        imageSide: block.imageSide === "end" ? "end" : "start",
      };
    }
    case "articleQaGroup": {
      const items = block.items ?? [];
      if (items.length === 0) {
        throw new ArticleContentError(
          `Sanity article content is incomplete: "${field}.items" is required.`,
        );
      }

      return {
        _type: "articleQaGroup",
        _key: block._key,
        ...(optionalText(block.title)
          ? { title: optionalText(block.title) }
          : {}),
        items: items.map((item, itemIndex) => ({
          key: item._key,
          question: requiredText(
            item.question,
            `${field}.items[${itemIndex}].question`,
          ),
          answer: requiredText(
            item.answer,
            `${field}.items[${itemIndex}].answer`,
          ),
        })),
      };
    }
    case "articleNumberedSteps": {
      const items = block.items ?? [];
      if (items.length === 0) {
        throw new ArticleContentError(
          `Sanity article content is incomplete: "${field}.items" is required.`,
        );
      }

      return {
        _type: "articleNumberedSteps",
        _key: block._key,
        ...(optionalText(block.title)
          ? { title: optionalText(block.title) }
          : {}),
        items: items.map((item, itemIndex) => ({
          key: item._key,
          title: requiredText(item.title, `${field}.items[${itemIndex}].title`),
          ...(optionalText(item.description)
            ? { description: optionalText(item.description) }
            : {}),
        })),
      };
    }
    case "articleServicePromo":
      return {
        _type: "articleServicePromo",
        _key: block._key,
        title: requiredText(block.title, `${field}.title`),
        description: requiredText(block.description, `${field}.description`),
        action: mapPromoAction(block.action, `${field}.action`),
      };
    default:
      throw new ArticleContentError(
        `Sanity article content has an unsupported body type at "${field}".`,
      );
  }
}

export function mapArticleBody(
  blocks: QueryArticleBody | null | undefined,
): ArticleBodyValue {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    throw new ArticleContentError(
      'Sanity article content is incomplete: "body" is required.',
    );
  }

  return blocks.map((block, index) => mapBodyBlock(block, index));
}
