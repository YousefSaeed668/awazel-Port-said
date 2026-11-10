import { defineQuery } from "next-sanity";

const imageProjection = `
  ...,
  alt,
  asset{_ref, _type},
  "dimensions": asset->metadata.dimensions{width, height, aspectRatio}
`;

const headingProjection = `{eyebrow, title, description}`;

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "aboutPage" && _id == "aboutPage"][0]{
    _id,
    intro{
      eyebrow,
      title,
      description
    },
    company{
      eyebrow,
      title,
      paragraphs[]{_key, text},
      facts[]{_key, label, value, icon},
      image{${imageProjection}},
      panel{
        title,
        description,
        metric{value, label}
      }
    },
    capabilities{
      heading${headingProjection}
    },
    methodology{
      heading${headingProjection},
      label,
      items[]{
        _key,
        title,
        description,
        phase{text, tone},
        note{text, tone}
      }
    },
    values{
      heading${headingProjection},
      items[]{
        _key,
        title,
        description,
        icon,
        checks[]{_key, label}
      }
    },
    profile{
      badge,
      version,
      title,
      description,
      downloadLabel,
      file{
        asset->{
          _id,
          url,
          originalFilename,
          mimeType,
          size
        }
      },
      unavailableLabel,
      unavailableHint
    },
    seo{title, description}
  }
`);
