import { defineQuery } from "next-sanity";

const imageProjection = `
  ...,
  alt,
  asset{_ref, _type},
  "dimensions": asset->metadata.dimensions{width, height, aspectRatio}
`;

const destinationProjection = `
  kind,
  href,
  openInNewTab
`;

const textBlockProjection = `
  _type,
  _key,
  _type == "block" => {
    style,
    listItem,
    level,
    children[]{
      _type,
      _key,
      text,
      marks
    },
    markDefs[]{
      _key,
      _type,
      href,
      openInNewTab,
      "referenceId": reference->_id,
      "referenceSlug": reference->slug.current
    }
  }
`;

const bodyProjection = `
  body[]{
    _type,
    _key,
    _type == "block" => {
      style,
      listItem,
      level,
      children[]{
        _type,
        _key,
        text,
        marks
      },
      markDefs[]{
        _key,
        _type,
        href,
        openInNewTab,
        "referenceId": reference->_id,
        "referenceSlug": reference->slug.current
      }
    },
    _type == "articleBodyImage" => {
      image{${imageProjection}},
      caption
    },
    _type == "articleCallout" => {
      tone,
      title,
      body[]{${textBlockProjection}}
    },
    _type == "articleTable" => {
      caption,
      headers,
      rows[]{
        _key,
        cells
      }
    },
    _type == "articleCardGroup" => {
      title,
      description,
      cards[]{
        _key,
        title,
        description,
        icon
      }
    },
    _type == "articleExplanation" => {
      title,
      text,
      image{${imageProjection}},
      imageCaption,
      points,
      imageSide
    },
    _type == "articleQaGroup" => {
      title,
      items[]{
        _key,
        question,
        answer
      }
    },
    _type == "articleNumberedSteps" => {
      title,
      items[]{
        _key,
        title,
        description
      }
    },
    _type == "articleServicePromo" => {
      title,
      description,
      action{
        label,
        destination{${destinationProjection}}
      }
    }
  }
`;

const authorProjection = `
  _id,
  name,
  role,
  bio,
  image{${imageProjection}}
`;

const tagsProjection = `
  _id,
  title
`;

export const ARTICLE_SLUG_QUERY = defineQuery(`
  *[
    _type == "article" &&
    defined(slug.current) &&
    (slug.current == $slug || $slug in previousSlugs)
  ][0]{
    _id,
    "slug": slug.current
  }
`);

export const ARTICLE_BY_ID_QUERY = defineQuery(`
  *[_type == "article" && _id == $id][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    cover{${imageProjection}},
    coverCaption,
    author->{${authorProjection}},
    tags[]->{${tagsProjection}},
    publishedAt,
    updatedAt,
    seo{title, description},
    ${bodyProjection}
  }
`);

export const RELATED_ARTICLES_QUERY = defineQuery(`
  *[
    _type == "article" &&
    _id != $articleId &&
    defined(slug.current) &&
    count(tags[_ref in $tagIds]) > 0
  ] | order(count(tags[_ref in $tagIds]) desc, publishedAt desc, _id asc) [0...12]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    cover{${imageProjection}},
    tags[]->{${tagsProjection}},
    publishedAt,
    ${bodyProjection}
  }
`);

export const ARTICLE_SITEMAP_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc){
    "slug": slug.current,
    publishedAt,
    updatedAt
  }
`);

const wordSourceProjection = `
  "bodyText": body[]{
    _type,
    caption,
    title,
    text,
    description,
    headers,
    points,
    imageCaption,
    children[]{ text },
    rows[]{ cells },
    cards[]{ title, description },
    items[]{ question, answer, title, description },
    body[]{ children[]{ text } },
    action{ label }
  }
`;

export const ARTICLE_INDEX_QUERY = defineQuery(`
  *[
    _type == "article" &&
    defined(slug.current) &&
    defined(title) &&
    defined(excerpt) &&
    defined(publishedAt)
  ] | order(publishedAt desc, _id asc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    cover{${imageProjection}},
    author->{
      name,
      role,
      image{${imageProjection}}
    },
    tags[]->{${tagsProjection}},
    publishedAt,
    ${wordSourceProjection}
  }
`);

export const BLOG_SETTINGS_QUERY = defineQuery(`
  *[_type == "blogSettings" && _id == "blogSettings"][0]{
    whatsappNumber,
    sidebarDestination{${destinationProjection}}
  }
`);
