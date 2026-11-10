"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";

import { prepareContactRequest } from "./actions";
import { ContactFormFields } from "./contact-form-fields";
import { ContactRoadmap, FormNotice } from "./contact-form-support";
import {
  CONTACT_FIELD_NAMES,
  createContactSchema,
  isContactFieldName,
  type ContactFormState,
  type ContactFormValues,
} from "./schema/contact";

const DEFAULT_VALUES: ContactFormValues = {
  fullName: "",
  phone: "",
  city: "",
  service: "",
  email: "",
  area: "",
  details: "",
};

type ContactFormProps = {
  serviceOptions: readonly string[];
};

export function ContactForm({ serviceOptions }: ContactFormProps) {
  const [serverState, setServerState] = useState<ContactFormState>({
    status: "idle",
  });
  const [clientMessage, setClientMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const requestPending = useRef(false);
  const formRevision = useRef(0);
  const resolver = useMemo(
    () => zodResolver(createContactSchema(serviceOptions)),
    [serviceOptions],
  );
  const form = useForm({
    resolver,
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  function clearFeedback() {
    formRevision.current += 1;
    setClientMessage(null);
    setServerState({ status: "idle" });
  }

  function onValid(values: ContactFormValues) {
    if (isPending || requestPending.current) return;

    requestPending.current = true;
    const submittedRevision = formRevision.current;
    setClientMessage(null);
    setServerState({ status: "idle" });

    const formData = new FormData();
    for (const name of CONTACT_FIELD_NAMES) {
      formData.set(name, values[name]);
    }

    startTransition(async () => {
      try {
        const result = await prepareContactRequest(formData);
        if (submittedRevision !== formRevision.current) return;

        setServerState(result);

        if (result.status === "invalid") {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (!isContactFieldName(field)) continue;
            const message = messages?.[0];
            if (message) {
              form.setError(field, { type: "server", message });
            }
          }
        }
      } catch {
        if (submittedRevision === formRevision.current) {
          setServerState({
            status: "error",
            message: "تعذر تجهيز الطلب حاليًا. حاول مرة أخرى.",
          });
        }
      } finally {
        requestPending.current = false;
      }
    });
  }

  function onInvalid() {
    setServerState({ status: "idle" });
    setClientMessage("تحقق من الحقول المطلوبة ثم أعد المحاولة.");
  }

  const errorMessage =
    serverState.status === "invalid" ? serverState.message : clientMessage;

  return (
    <div className="flex flex-col gap-8 rounded-xl bg-card p-5 shadow-xs sm:p-8 lg:p-10">
      <div className="flex flex-col gap-3 border-b border-border pb-4">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="rounded bg-surface-blue px-2.5 py-1 text-xs font-medium text-link">
            نسخة هندسية رقمية
          </span>
          <div className="flex flex-col items-start sm:items-end">
            <h2 className="text-xl font-semibold leading-snug text-brand-navy sm:text-[22px]">
              نموذج طلب عرض السعر والمعاينة الميدانية
            </h2>
            <span
              aria-hidden="true"
              className="mt-2 block h-0.5 w-8 rounded-full bg-brand-gold"
            />
          </div>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          الحقول المعلمة بعلامة{" "}
          <span className="font-bold text-destructive">*</span> مطلوبة لتمكين
          المهندس المختص من إعداد المقايسة بصورة أولية دقيقة.
        </p>
      </div>

      {serviceOptions.length === 0 ? (
        <FormNotice
          tone="error"
          message="قائمة الخدمات غير مضبوطة في إعدادات الموقع، لذا لا يمكن إرسال الطلب أو التحقق منه حاليًا."
        />
      ) : null}

      {errorMessage ? <FormNotice tone="error" message={errorMessage} /> : null}

      <form
        noValidate
        aria-busy={isPending}
        onChange={clearFeedback}
        onSubmit={(event) => {
          void form.handleSubmit(onValid, onInvalid)(event);
        }}
        className="flex flex-col gap-6"
      >
        <ContactFormFields
          form={form}
          serviceOptions={serviceOptions}
          onInteraction={clearFeedback}
        />

        <div className="flex gap-3 rounded-lg bg-muted p-4">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-brand-blue"
          />
          <p className="text-sm leading-6 text-muted-foreground">
            نجهّز بيانات النموذج في رسالة لطلب عرض السعر. عند فتح واتساب،
            ستنتقل إلى محادثة الشركة بالرسالة المُعبأة؛ راجعها ثم اضغط إرسال
            داخل واتساب لإتمام الطلب.
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isPending || serviceOptions.length === 0}
          className="h-13 min-h-13 w-full gap-2 rounded-lg bg-brand-navy text-base font-medium hover:bg-brand-navy-hover"
        >
          {isPending ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Send aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          )}
          {isPending ? "جارٍ تجهيز الطلب..." : "تجهيز الطلب لواتساب"}
        </Button>

        {serverState.status === "unavailable" || serverState.status === "error" ? (
          <FormNotice tone="error" message={serverState.message} />
        ) : null}

        {serverState.status === "ready" ? (
          <div className="flex flex-col gap-3">
            <FormNotice tone="notice" message={serverState.message} />
            <a
              href={serverState.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "whatsapp", size: "lg" })}
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              فتح الطلب في واتساب
            </a>
          </div>
        ) : null}
      </form>

      <ContactRoadmap />
    </div>
  );
}
