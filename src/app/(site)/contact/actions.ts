"use server";

import { getSiteShell } from "@/sanity/data/site-settings";

import {
  createContactSchema,
  isContactFieldName,
  type ContactFieldErrors,
  type ContactFieldName,
  type ContactFormState,
} from "./schema/contact";

const INVALID_MESSAGE = "تحقق من الحقول المطلوبة ثم أعد المحاولة.";
const VALIDATED_MESSAGE =
  "تم التحقق من البيانات فقط؛ الإرسال غير مفعّل حاليًا.";
const UNAVAILABLE_MESSAGE =
  "قائمة الخدمات غير مضبوطة في إعدادات الموقع، لذا لا يمكن التحقق من الطلب حاليًا.";
const ERROR_MESSAGE = "تعذر التحقق من بيانات الطلب حاليًا. حاول مرة أخرى.";

function readText(formData: FormData, name: ContactFieldName) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function validateContactRequest(
  formData: FormData,
): Promise<ContactFormState> {
  try {
    const { footer } = await getSiteShell();
    const serviceOptions = footer.services.links.map((link) => link.label);

    if (serviceOptions.length === 0) {
      return { status: "unavailable", message: UNAVAILABLE_MESSAGE };
    }

    const raw = {
      fullName: readText(formData, "fullName"),
      phone: readText(formData, "phone"),
      city: readText(formData, "city"),
      service: readText(formData, "service"),
      email: readText(formData, "email"),
      area: readText(formData, "area"),
      details: readText(formData, "details"),
    };

    const result = createContactSchema(serviceOptions).safeParse(raw);

    if (!result.success) {
      const fieldErrors: ContactFieldErrors = {};

      for (const issue of result.error.issues) {
        const [field] = issue.path;
        if (typeof field !== "string" || !isContactFieldName(field)) continue;

        fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
      }

      return {
        status: "invalid",
        message: INVALID_MESSAGE,
        fieldErrors,
      };
    }

    return { status: "validated", message: VALIDATED_MESSAGE };
  } catch {
    return { status: "error", message: ERROR_MESSAGE };
  }
}
