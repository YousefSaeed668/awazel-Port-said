import { defineQuery } from "next-sanity";

export const PRIVACY_PAGE_QUERY = defineQuery(`
  *[_type == "privacyPage" && _id == "privacyPage"][0]{
    intro{context, eyebrow, title, description, updatedLabel, updatedOn, versionLabel, version, compliance},
    scope{title, description},
    sections[]{_key, title, tocLabel, paragraphs[]{_key, text},
      cards[]{_key, title, description, icon, items[]{_key, text}},
      items[]{_key, title, description}, itemsStyle, disclosure{title, text}, footnote{title, text},
      note{title, text, tone}, showContact, showPublication},
    contact{title, subtitle, emailLabel, email, phoneLabel, phone, addressLabel, address, hoursLabel, hours},
    publication{label, reference},
    sidebar{tocTitle, countLabel, projectTitle, projectDescription, contactTitle, emailLabel, location,
      action{enabled, label, destination{kind, href, openInNewTab}}},
    whatsapp{enabled, label, number}, seo{title, description}
  }
`);
