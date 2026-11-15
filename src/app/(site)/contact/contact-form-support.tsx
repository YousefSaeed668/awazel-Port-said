import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Info,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { cn } from "cn";

const ROADMAP = [
  {
    number: "1",
    title: "راجع الرسالة وأرسلها",
    description:
      "تجهيز النموذج ينشئ رابطًا فقط؛ راجع الرسالة داخل واتساب وأرسلها إلى الشركة عندما تكون القناة مفعلة.",
    icon: PhoneCall,
  },
  {
    number: "2",
    title: "مناقشة متطلبات المشروع",
    description:
      "عند وصول الطلب، يمكن استكمال المعلومات المتعلقة بالموقع والحالة ونطاق العمل المطلوب.",
    icon: CheckCircle2,
  },
  {
    number: "3",
    title: "تحديد الخطوة التالية",
    description:
      "تُناقش الحاجة إلى معاينة أو معلومات إضافية ثم متطلبات التسعير والتنفيذ، دون وعد بمدة استجابة ثابتة.",
    icon: FileSpreadsheet,
  },
] as const;

export function FormNotice({
  tone,
  message,
}: {
  tone: "error" | "notice";
  message: string;
}) {
  const isError = tone === "error";
  const Icon = isError ? AlertCircle : ShieldCheck;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-lg border p-3 text-sm leading-6",
        isError
          ? "border-destructive/30 bg-destructive/5 text-destructive"
          : "border-link/20 bg-surface-blue text-brand-navy",
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

export function ContactRoadmap() {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-muted p-6">
      <div className="flex items-center gap-2">
        <Info aria-hidden="true" className="size-5 text-brand-blue" />
        <h3 className="text-base font-semibold text-brand-navy">
          ماذا يحدث بعد تجهيز الطلب؟
        </h3>
      </div>
      <ol className="grid gap-4 sm:grid-cols-3">
        {ROADMAP.map((step) => {
          const Icon = step.icon;
          return (
            <li
              key={step.number}
              className="flex flex-col gap-2 rounded-lg bg-card p-4 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-primary-foreground">
                  {step.number}
                </span>
                <Icon aria-hidden="true" className="size-4 text-brand-blue" />
                <span className="text-base font-medium text-brand-navy">
                  {step.title}
                </span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
