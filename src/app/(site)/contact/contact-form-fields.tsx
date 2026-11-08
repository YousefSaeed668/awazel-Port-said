"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { ContactFormValues } from "./schema/contact";

const FIELD_LABEL_CLASS =
  "flex-wrap gap-1 text-base leading-6 font-medium text-brand-navy";
const FIELD_CONTROL_CLASS =
  "h-[52px] rounded-lg border-input bg-card px-4 text-base text-foreground shadow-sm md:text-base";

type ContactFormFieldsProps = {
  form: UseFormReturn<ContactFormValues>;
  serviceOptions: readonly string[];
  onInteraction: () => void;
};

export function ContactFormFields({
  form,
  serviceOptions,
  onInteraction,
}: ContactFormFieldsProps) {
  return (
    <FieldGroup className="gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="fullName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel
                htmlFor="contact-full-name"
                className={FIELD_LABEL_CLASS}
              >
                الاسم الكامل
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="contact-full-name"
                autoComplete="name"
                aria-required="true"
                placeholder="مثال: م. فهد العتيبي / شركة..."
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "contact-full-name-error" : undefined
                }
                className={FIELD_CONTROL_CLASS}
              />
              {fieldState.invalid ? (
                <FieldError
                  id="contact-full-name-error"
                  className="leading-6"
                  errors={[fieldState.error]}
                />
              ) : null}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="contact-phone" className={FIELD_LABEL_CLASS}>
                رقم الجوال
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="contact-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-required="true"
                  dir="ltr"
                  placeholder="05X XXX XXXX"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? "contact-phone-error" : undefined
                  }
                  className="h-[52px] rounded-lg border-input bg-card pl-16 pr-4 text-left text-base text-foreground shadow-sm md:text-base"
                />
                <span
                  aria-hidden="true"
                  dir="ltr"
                  className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
                >
                  +966
                </span>
              </div>
              {fieldState.invalid ? (
                <FieldError
                  id="contact-phone-error"
                  className="leading-6"
                  errors={[fieldState.error]}
                />
              ) : null}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="city"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="contact-city" className={FIELD_LABEL_CLASS}>
                المدينة أو موقع المشروع
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="contact-city"
                autoComplete="address-level2"
                aria-required="true"
                placeholder="مثال: الرياض - حي الملقا"
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "contact-city-error" : undefined
                }
                className={FIELD_CONTROL_CLASS}
              />
              {fieldState.invalid ? (
                <FieldError
                  id="contact-city-error"
                  className="leading-6"
                  errors={[fieldState.error]}
                />
              ) : null}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="service"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel
                htmlFor="contact-service"
                className={FIELD_LABEL_CLASS}
              >
                الخدمة المطلوبة
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value === "" ? null : field.value}
                onValueChange={(value) => {
                  field.onChange(value ?? "");
                  onInteraction();
                }}
                disabled={serviceOptions.length === 0}
              >
                <SelectTrigger
                  ref={field.ref}
                  id="contact-service"
                  aria-required="true"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? "contact-service-error" : undefined
                  }
                  onBlur={field.onBlur}
                  className="w-full rounded-lg border-input bg-card px-4 text-base text-foreground shadow-sm data-[size=default]:h-13 md:text-base"
                >
                  <SelectValue placeholder="اختر نوع الخدمة..." />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid ? (
                <FieldError
                  id="contact-service-error"
                  className="leading-6"
                  errors={[fieldState.error]}
                />
              ) : null}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="contact-email" className={FIELD_LABEL_CLASS}>
                البريد الإلكتروني
                <span className="text-sm font-normal text-muted-foreground">
                  (اختياري)
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="contact-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                placeholder="name@example.com"
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "contact-email-error" : undefined
                }
                className="h-[52px] rounded-lg border-input bg-card px-4 text-left text-base text-foreground shadow-sm md:text-base"
              />
              {fieldState.invalid ? (
                <FieldError
                  id="contact-email-error"
                  className="leading-6"
                  errors={[fieldState.error]}
                />
              ) : null}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="area"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="contact-area" className={FIELD_LABEL_CLASS}>
                المساحة التقريبية للمشروع
                <span className="text-sm font-normal text-muted-foreground">
                  (اختياري)
                </span>
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="contact-area"
                  inputMode="decimal"
                  placeholder="مثال: 450"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? "contact-area-error" : undefined
                  }
                  className="h-13 rounded-lg border-input bg-card pl-14 pr-4 text-right text-base text-foreground shadow-sm md:text-base"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none  absolute top-1/2 -translate-y-1/2 left-3 flex items-center rounded-lg bg-muted p-2 text-sm text-muted-foreground"
                >
                  م²
                </span>
              </div>
              {fieldState.invalid ? (
                <FieldError
                  id="contact-area-error"
                  className="leading-6"
                  errors={[fieldState.error]}
                />
              ) : null}
            </Field>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="details"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-1.5">
            <FieldLabel htmlFor="contact-details" className={FIELD_LABEL_CLASS}>
              تفاصيل المشروع أو الملاحظات الفنية
              <span className="text-sm font-normal text-muted-foreground">
                (اختياري)
              </span>
            </FieldLabel>
            <Textarea
              {...field}
              id="contact-details"
              rows={5}
              placeholder="وضح حالة السطح أو المنشأة، وجود تسربات سابقة، أو أي اشتراطات هندسية خاصة بالمخطط..."
              aria-invalid={fieldState.invalid}
              aria-describedby={
                fieldState.invalid ? "contact-details-error" : undefined
              }
              className="min-h-[140px] rounded-lg border-input bg-card px-4 py-3 text-base text-foreground shadow-sm md:text-base"
            />
            {fieldState.invalid ? (
              <FieldError
                id="contact-details-error"
                className="leading-6"
                errors={[fieldState.error]}
              />
            ) : null}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
