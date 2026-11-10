import { getWhatsAppHref } from "@/lib/links";

import {
  CONTACT_FIELD_LABELS,
  CONTACT_FIELD_NAMES,
  normalizeContactDigits,
  type ContactFormValues,
} from "./schema/contact";

function singleLine(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function formatContactRequest(values: ContactFormValues) {
  const normalized: ContactFormValues = {
    fullName: singleLine(values.fullName),
    phone: normalizeContactDigits(values.phone).replace(/[\s\-()]/g, ""),
    city: singleLine(values.city),
    service: singleLine(values.service),
    email: singleLine(values.email),
    area: `${normalizeContactDigits(values.area).replace(/[٫,]/g, ".")} م²`,
    details: values.details.trim().replace(/\r\n?/g, "\n"),
  };

  return [
    "نموذج طلب عرض السعر والمعاينة الميدانية",
    "",
    ...CONTACT_FIELD_NAMES.map((name) => {
      const value = normalized[name] || "لم يُذكر";
      const separator = name === "details" ? "\n" : " ";
      return `${CONTACT_FIELD_LABELS[name]}:${separator}${value}`;
    }),
  ].join("\n");
}

export function prepareContactWhatsAppHref(
  values: ContactFormValues,
  configuredNumber: string | null | undefined,
) {
  const number = normalizeContactDigits(configuredNumber?.trim() ?? "");
  if (!/^\+?[\d\s-]{7,24}$/.test(number)) return null;

  const compact = number.replace(/[\s-]/g, "");
  if (!/^\+?[1-9]\d{7,14}$/.test(compact)) return null;

  const href = getWhatsAppHref(compact);
  if (!href) return null;

  const url = new URL(href);
  url.searchParams.set("text", formatContactRequest(values));
  return url.toString();
}
