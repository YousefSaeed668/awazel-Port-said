import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    _id,
    brand{
      companyName,
      tagline,
      logo{
        ...,
        alt,
        asset{_ref, _type},
        "dimensions": asset->metadata.dimensions{width, height, aspectRatio}
      }
    },
    header{
      navigation[]{
        _key,
        label,
        enabled,
        destination{kind, href, openInNewTab}
      },
      primaryAction{
        enabled,
        label,
        destination{kind, href, openInNewTab}
      }
    },
    footer{
      companyDescription,
      footerLogo{
        ...,
        alt,
        asset{_ref, _type},
        "dimensions": asset->metadata.dimensions{width, height, aspectRatio}
      },
      badges[]{_key, label, enabled},
      quickLinks{
        heading,
        links[]{
          _key,
          label,
          enabled,
          destination{kind, href, openInNewTab}
        }
      },
      serviceLinks{
        heading,
        links[]{
          _key,
          label,
          enabled,
          destination{kind, href, openInNewTab}
        }
      },
      contactColumn{
        heading,
        phoneLabel,
        emailLabel,
        addressLabel,
        hoursLabel,
        action{
          enabled,
          label,
          destination{kind, href, openInNewTab}
        }
      },
      cta{
        enabled,
        eyebrow,
        title,
        description,
        primaryLabel,
        primaryDestination{kind, href, openInNewTab},
        whatsappLabel,
        contactLabel,
        supportingText
      },
      legal{
        links[]{
          _key,
          label,
          enabled,
          destination{kind, href, openInNewTab}
        },
        copyright
      }
    },
    contact{
      phone,
      whatsapp,
      email,
      address,
      workingHours
    },
    defaultSeo{
      title,
      description,
      siteName,
      image{
        ...,
        alt,
        asset{_ref, _type},
        "dimensions": asset->metadata.dimensions{width, height, aspectRatio}
      }
    }
  }
`);
