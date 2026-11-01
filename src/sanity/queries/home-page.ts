import { defineQuery } from "next-sanity";

const imageProjection = `
  ...,
  alt,
  asset{_ref, _type},
  "dimensions": asset->metadata.dimensions{width, height, aspectRatio}
`;

const destinationProjection = `{kind, href, openInNewTab}`;

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0]{
    _id,
    hero{
      eyebrow,
      title,
      highlight,
      description,
      primaryAction{
        enabled,
        label,
        destination${destinationProjection}
      },
      secondaryAction{
        enabled,
        label,
        destination${destinationProjection}
      },
      highlights[]{_key, label, icon},
      image{${imageProjection}},
      panel{title, status, location}
    },
    company{
      eyebrow,
      title,
      description,
      image{${imageProjection}},
      panel{title, description},
      features[]{_key, title, description, icon},
      primaryAction{
        enabled,
        label,
        destination${destinationProjection}
      },
      secondaryAction{
        enabled,
        label,
        destination${destinationProjection}
      }
    },
    workStages{
      heading{eyebrow, title, description},
      label,
      items[]{
        _key,
        title,
        description,
        icon,
        note{text, tone}
      }
    },
    quality{
      eyebrow,
      title,
      description,
      checks[]{_key, title, description, icon},
      warranty{
        badge,
        title,
        description,
        items,
        action{
          enabled,
          label,
          destination${destinationProjection}
        }
      }
    },
    faq{
      heading{eyebrow, title, description},
      items[]{_key, question, answer}
    }
  }
`);
