import { defineQuery } from "next-sanity";

const imageProjection = `
  alt, crop, hotspot, asset{_ref, _type},
  "dimensions": asset->metadata.dimensions{width, height}
`;

const destinationProjection = `
  kind,
  href,
  openInNewTab
`;

const listingProjection = `
  _id,
  title,
  "slug": slug.current,
  summary,
  cover{${imageProjection}},
  category,
  status{label, tone},
  location,
  completedAt,
  measurement{label, value},
  system{label, value},
  highlight
`;

const textBlockProjection = `
  _type,
  _key,
  _type == "block" => {
    style,
    listItem,
    level,
    children[]{_type, _key, text, marks},
    markDefs[]{_key, _type, href, openInNewTab}
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
      children[]{_type, _key, text, marks},
      markDefs[]{_key, _type, href, openInNewTab}
    },
    _type == "projectBodyImage" => {
      _key,
      caption,
      image{${imageProjection}}
    },
    _type == "projectCallout" => {
      _key,
      tone,
      title,
      body[]{${textBlockProjection}}
    }
  }
`;

const detailProjection = `
  detail{
    approvalNumber,
    warranty,
    scope,
    coverStandard,
    coverNote,
    engineeringRole{
      description,
      tags
    },
    technicalSpecs{
      note,
      rows[]{_key, label, value, emphasis}
    },
    approvals{
      items[]{_key, name, description}
    },
    verification{
      items[]{_key, title, description, icon, footer, tone}
    }
  }
`;

const relatedProjection = `
  _id,
  title,
  "slug": slug.current,
  summary,
  cover{${imageProjection}},
  category,
  status{label, tone},
  location,
  completedAt,
  measurement{label, value},
  system{label, value},
  highlight
`;

export const PROJECTS_PAGE_QUERY = defineQuery(`
  *[_type == "projectsPage" && _id == "projectsPage"][0]{
    intro{
      eyebrow,
      title,
      description,
      context,
      breadcrumbs[]{_key, label, destination{${destinationProjection}}}
    },
    assurance{
      items[]{_key, title, description, icon}
    },
    closing{
      eyebrow,
      title,
      description,
      whatsappAction{
        enabled,
        label,
        destination{${destinationProjection}}
      }
    },
    seo{title, description}
  }
`);

export const PROJECT_INDEX_QUERY = defineQuery(`
  *[
    _type == "project" &&
    defined(slug.current) &&
    defined(title) &&
    defined(summary) &&
    defined(cover.asset) &&
    defined(category) &&
    defined(status.label) &&
    defined(status.tone) &&
    defined(location) &&
    defined(completedAt) &&
    defined(measurement.label) &&
    defined(measurement.value) &&
    defined(system.label) &&
    defined(system.value)
  ] | order(completedAt desc, _id asc) {${listingProjection}}
`);

export const PROJECT_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]._id
`);

export const PROJECT_DETAIL_QUERY = defineQuery(`
  *[_type == "project" && _id == $id && defined(slug.current)][0]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    summary,
    category,
    status{label, tone},
    location,
    completedAt,
    measurement{label, value},
    system{label, value},
    highlight,
    cover{${imageProjection}},
    gallery[]{_key, ${imageProjection}},
    ${bodyProjection},
    ${detailProjection},
    seo{title, description}
  }
`);

export const RELATED_PROJECTS_QUERY = defineQuery(`
  *[
    _type == "project" &&
    _id != $id &&
    category == $category &&
    defined(slug.current) &&
    defined(title) &&
    defined(summary) &&
    defined(cover.asset) &&
    defined(status.label) &&
    defined(status.tone) &&
    defined(location) &&
    defined(completedAt) &&
    defined(measurement.label) &&
    defined(measurement.value) &&
    defined(system.label) &&
    defined(system.value)
  ] | order(completedAt desc, _id asc)[0...2] {${relatedProjection}}
`);

export const PROJECT_SITEMAP_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(completedAt desc, _id asc) {
    "slug": slug.current,
    _updatedAt,
    completedAt
  }
`);
