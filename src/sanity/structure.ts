import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("إعدادات الموقع")
    .items([
      S.listItem()
        .title("إعدادات الموقع")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("إعدادات الموقع"),
        ),
    ]);
