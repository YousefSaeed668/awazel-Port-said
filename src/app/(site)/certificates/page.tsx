import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";

import { CertificateCard } from "@/components/company-cards";
import { MaxWidth } from "@/components/MaxWidth";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buttonVariants } from "@/components/ui/button-variants";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireNavigationPage } from "@/sanity/data/page-availability";
import type {
  CertificatesPageContent,
  CompanyProfileFile,
} from "@/lib/certificates-data";
import { cn } from "cn";

import {
  getCertificatesPageContent,
  getCompanyProfileFile,
} from "@/sanity/data/certificates-page";

const PROFILE_DOWNLOAD_LABEL = "تحميل الملف التعريفي الكامل PDF";

const breadcrumbs = [
  { id: "home", label: "الرئيسية", href: "/" },
  { id: "certificates", label: "الاعتمادات والشهادات" },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  await requireNavigationPage("/certificates");
  const { seo } = await getCertificatesPageContent();

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: "/certificates",
    },
  };
}

export default async function CertificatesPage() {
  await requireNavigationPage("/certificates");
  const [content, profileFile] = await Promise.all([
    getCertificatesPageContent(),
    getCompanyProfileFile(),
  ]);

  return (
    <>
      <CertificatesIntroduction
        intro={content.intro}
        profileFile={profileFile}
      />
      <CertificatesList content={content.certificates} />
    </>
  );
}

function CertificatesIntroduction({
  intro,
  profileFile,
}: {
  intro: CertificatesPageContent["intro"];
  profileFile: CompanyProfileFile | null;
}) {
  return (
    <section aria-labelledby="certificates-page-title" className="bg-background">
      <MaxWidth className="py-8 sm:py-10 lg:py-12">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="certificates-page-title"
            headingLevel={1}
            eyebrow={intro.eyebrow}
            title={intro.title}
            description={intro.description}
            className="lg:col-span-8"
            titleClassName="text-brand-navy text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.4]"
          />

          <div className="w-full lg:col-span-4 lg:justify-self-end">
            <ProfileDownloadAction file={profileFile} />
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}

function ProfileDownloadAction({ file }: { file: CompanyProfileFile | null }) {
  if (!file) {
    return (
      <div className="rounded-lg bg-card/70 p-3 text-center ring-1 ring-border/60">
        <span
          aria-disabled="true"
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-full cursor-not-allowed bg-muted text-muted-foreground",
          )}
        >
          <FileText aria-hidden="true" className="size-5" />
          الملف التعريفي غير متوفر حالياً
        </span>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          لم يُرفع ملف الشركة التعريفي بعد. يمكن إضافته من صفحة «من نحن» في
          لوحة التحكم.
        </p>
      </div>
    );
  }

  return (
    <a
      href={file.href}
      download={file.fileName}
      title={file.fileName}
      className={cn(
        buttonVariants({ size: "lg" }),
        "w-full sm:w-auto lg:w-full",
      )}
    >
      <Download aria-hidden="true" className="size-5" />
      <span>{PROFILE_DOWNLOAD_LABEL}</span>
      {file.sizeLabel ? (
        <span className="text-xs font-normal opacity-80">
          ({file.sizeLabel})
        </span>
      ) : null}
    </a>
  );
}

function CertificatesList({
  content,
}: {
  content: CertificatesPageContent["certificates"];
}) {
  return (
    <section
      aria-labelledby="certificates-list-title"
      className="bg-card py-12 sm:py-16"
    >
      <MaxWidth>
        <SectionHeading
          {...content.heading}
          id="certificates-list-title"
          titleClassName="text-brand-navy"
        />

        {content.items.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {content.items.map(({ id, ...item }) => (
              <CertificateCard key={id} {...item} allowPreview />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-card text-link shadow-sm">
              <FileText aria-hidden="true" className="size-7" />
            </span>
            <p className="mt-4 text-base font-bold leading-7 text-brand-navy">
              لم تُنشر أي شهادات بعد
            </p>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              ستظهر شهادات الاعتماد هنا بعد إضافتها ونشرها من لوحة التحكم.
            </p>
          </div>
        )}
      </MaxWidth>
    </section>
  );
}
