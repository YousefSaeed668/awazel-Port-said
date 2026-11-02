import { defineQuery } from "next-sanity";

const imageProjection = `
  ...,
  alt,
  asset{_ref, _type},
  "dimensions": asset->metadata.dimensions{width, height, aspectRatio}
`;

const fileProjection = `
  asset->{
    _id,
    url,
    originalFilename,
    mimeType,
    size
  }
`;

export const CERTIFICATES_PAGE_QUERY = defineQuery(`
  *[_type == "certificatesPage" && _id == "certificatesPage"][0]{
    _id,
    intro{
      eyebrow,
      title,
      description
    },
    certificates{
      heading{eyebrow, title, description},
      items[]{
        _key,
        issuerName,
        issuerSecondaryName,
        issuerLogo{${imageProjection}},
        certificateTitle,
        certificateSubtitle,
        reference,
        status{label, tone},
        authorizationDescription,
        issuedOn,
        validUntil,
        validityNote,
        scope{title, description, items},
        document{${fileProjection}}
      }
    },
    seo{title, description}
  }
`);

/**
 * The certificates page reuses the company profile PDF that About owns.
 * Only the fields needed by the download action are requested.
 */
export const COMPANY_PROFILE_FILE_QUERY = defineQuery(`
  *[_type == "aboutPage" && _id == "aboutPage"][0]{
    profile{
      file{${fileProjection}}
    }
  }
`);
