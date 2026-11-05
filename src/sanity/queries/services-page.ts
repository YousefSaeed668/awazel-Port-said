import { defineQuery } from "next-sanity";

const imageProjection = `
  alt, crop, hotspot, asset{_ref, _type},
  "dimensions": asset->metadata.dimensions{width, height}
`;

export const SERVICES_PAGE_QUERY = defineQuery(`
  *[_type == "servicesPage" && _id == "servicesPage"][0]{
    intro{
      eyebrow, title, description,
      breadcrumbs[]{_key, label, destination{kind, href, openInNewTab}}
    },
    applications{
      heading{eyebrow, title, description},
      items[]{
        _key, title, description, tags[]{_key, label},
        image{${imageProjection}}, imageBadge, systemsLabel,
        systems[]{_key, label}, metrics[]{_key, label, value, unit}
      }
    },
    technologies{
      heading{eyebrow, title, description}, note,
      items[]{_key, title, englishTitle, description, icon, noteLabel, note}
    },
    assessment{
      heading{eyebrow, title, description},
      factors[]{_key, title, description},
      project{badge, location, image{${imageProjection}}, imageLabel, title, description, durationLabel, duration}
    },
    faq{heading{eyebrow, title, description}, items[]{_key, question, answer}},
    consultation{
      eyebrow, title, description,
      primaryAction{enabled, label, destination{kind, href, openInNewTab}},
      secondaryAction{enabled, label, destination{kind, href, openInNewTab}}
    },
    seo{title, description}
  }
`);
