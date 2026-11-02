import "server-only";

import type { CertificateStatus } from "@/components/company-cards";
import type {
  CertificatesPageContent,
  CompanyProfileFile,
} from "@/lib/certificates-data";

import { imageUrl } from "../lib/image";
import type {
  CERTIFICATES_PAGE_QUERY_RESULT,
  COMPANY_PROFILE_FILE_QUERY_RESULT,
} from "../sanity.types";
import { downloadHref, formatFileSize } from "./pdf-file";

type QueryDocument = NonNullable<CERTIFICATES_PAGE_QUERY_RESULT>;
type QueryCertificates = NonNullable<QueryDocument["certificates"]>;
type QueryCertificate = NonNullable<QueryCertificates["items"]>[number];
type QueryHeading = QueryCertificates["heading"];
type QueryLogo = QueryCertificate["issuerLogo"];
type QueryScope = QueryCertificate["scope"];
type QueryDocumentFile = QueryCertificate["document"];

export type ProfileQueryDocument =
  NonNullable<COMPANY_PROFILE_FILE_QUERY_RESULT>;
type ProfileQueryFile = NonNullable<
  NonNullable<ProfileQueryDocument["profile"]>["file"]
>;

type CertificateItem = CertificatesPageContent["certificates"]["items"][number];
type CertificateScope = NonNullable<CertificateItem["scope"]>;

const STATUS_TONES = ["valid", "pending", "expired", "neutral"] as const;
type StatusTone = (typeof STATUS_TONES)[number];

export class CertificatesPageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CertificatesPageError";
  }
}

export function requiredText(
  value: string | null | undefined,
  field: string,
) {
  const normalized = value?.trim();
  if (normalized) return normalized;
  throw new CertificatesPageError(
    `Sanity certificates content is incomplete: "${field}" is required.`,
  );
}

export function optionalText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function mapHeading(
  heading: QueryHeading,
  field: string,
): CertificatesPageContent["certificates"]["heading"] {
  if (!heading) {
    throw new CertificatesPageError(
      `Sanity certificates content is incomplete: "${field}" is required.`,
    );
  }

  return {
    eyebrow: requiredText(heading.eyebrow, `${field}.eyebrow`),
    title: requiredText(heading.title, `${field}.title`),
    description: requiredText(heading.description, `${field}.description`),
  };
}

function mapLogo(logo: QueryLogo, field: string) {
  if (!logo) return undefined;
  if (!logo.asset?._ref || !logo.dimensions?.width) {
    throw new CertificatesPageError(
      `Sanity certificates content has a missing logo asset at "${field}". Re-upload the image.`,
    );
  }

  return {
    src: imageUrl(
      {
        _type: "image",
        asset: logo.asset,
        crop: logo.crop,
        hotspot: logo.hotspot,
      },
      96,
    ),
    alt: requiredText(logo.alt, `${field}.alt`),
  };
}

function mapStatus(
  status: QueryCertificate["status"],
  field: string,
): CertificateStatus | undefined {
  if (!status) return undefined;

  const tone = status.tone;
  if (!tone || !STATUS_TONES.includes(tone as StatusTone)) {
    throw new CertificatesPageError(
      `Sanity certificates content has an unsupported status tone at "${field}.tone".`,
    );
  }

  return {
    label: requiredText(status.label, `${field}.label`),
    tone: tone as StatusTone,
  };
}

function formatDate(value: string, field: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new CertificatesPageError(
      `Sanity certificates content has an invalid date at "${field}".`,
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new CertificatesPageError(
      `Sanity certificates content has an invalid date at "${field}".`,
    );
  }

  return new Intl.DateTimeFormat("ar-EG-u-ca-gregory", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function mapScope(scope: QueryScope): CertificateScope | undefined {
  if (!scope) return undefined;

  const title = optionalText(scope.title);
  const description = optionalText(scope.description);
  const items = (scope.items ?? [])
    .map((item) => optionalText(item))
    .filter((item): item is string => Boolean(item));

  if (!title && !description && !items.length) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(items.length ? { items } : {}),
  };
}

function mapDocument(file: QueryDocumentFile, field: string) {
  if (!file?.asset) {
    throw new CertificatesPageError(
      `Sanity certificates content is incomplete: "${field}" PDF is required.`,
    );
  }

  const url = requiredText(file.asset.url, `${field}.asset.url`);
  const fileName = requiredText(
    file.asset.originalFilename,
    `${field}.asset.originalFilename`,
  );
  const mimeType = requiredText(
    file.asset.mimeType,
    `${field}.asset.mimeType`,
  );

  if (mimeType !== "application/pdf") {
    throw new CertificatesPageError(
      `Sanity certificates content has an unsupported file at "${field}". Upload a PDF.`,
    );
  }

  return {
    previewUrl: url,
    downloadHref: downloadHref(url, fileName),
    fileName,
  };
}

function mapCertificate(
  item: QueryCertificate,
  index: number,
): CertificateItem {
  const field = `certificates.items[${index}]`;
  const issuerSecondaryName = optionalText(item.issuerSecondaryName);
  const subtitle = optionalText(item.certificateSubtitle);
  const reference = optionalText(item.reference);
  const description = optionalText(item.authorizationDescription);
  const status = mapStatus(item.status, `${field}.status`);
  const logo = mapLogo(item.issuerLogo, `${field}.issuerLogo`);
  const scope = mapScope(item.scope);

  if (item.issuedOn && item.validUntil && item.validUntil < item.issuedOn) {
    throw new CertificatesPageError(
      `Sanity certificates content has an invalid date range at "${field}": "validUntil" precedes "issuedOn".`,
    );
  }

  const issueDate = item.issuedOn
    ? formatDate(item.issuedOn, `${field}.issuedOn`)
    : undefined;
  const validityParts = [
    item.validUntil
      ? `تاريخ الانتهاء: ${formatDate(item.validUntil, `${field}.validUntil`)}`
      : undefined,
    optionalText(item.validityNote),
  ].filter((part): part is string => Boolean(part));

  return {
    id: requiredText(item._key, `${field}._key`),
    issuer: requiredText(item.issuerName, `${field}.issuerName`),
    ...(issuerSecondaryName ? { issuerSecondaryName } : {}),
    ...(logo ? { issuerLogo: logo } : {}),
    title: requiredText(item.certificateTitle, `${field}.certificateTitle`),
    ...(subtitle ? { subtitle } : {}),
    ...(reference ? { reference } : {}),
    ...(status ? { status } : {}),
    ...(description ? { description } : {}),
    ...(issueDate ? { issueDate } : {}),
    ...(validityParts.length
      ? { validity: validityParts.join(" · ") }
      : {}),
    ...(scope ? { scope } : {}),
    document: mapDocument(item.document, `${field}.document`),
  };
}

export function mapCertificates(
  certificates: QueryCertificates,
): CertificatesPageContent["certificates"] {
  if (!Array.isArray(certificates.items)) {
    throw new CertificatesPageError(
      'Sanity certificates content is incomplete: "certificates.items" is required. Publish an empty list instead of omitting it.',
    );
  }

  return {
    heading: mapHeading(certificates.heading, "certificates.heading"),
    items: certificates.items.map(mapCertificate),
  };
}

function mapProfileFile(file: ProfileQueryFile) {
  if (!file) return null;

  if (!file.asset) {
    throw new CertificatesPageError(
      'Sanity about content is incomplete: "profile.file" has no asset. Re-upload the PDF or clear the field.',
    );
  }

  const mimeType = requiredText(
    file.asset.mimeType,
    "profile.file.asset.mimeType",
  );

  if (mimeType !== "application/pdf") {
    throw new CertificatesPageError(
      'Sanity about content has an unsupported file at "profile.file". Upload a PDF.',
    );
  }

  const url = requiredText(file.asset.url, "profile.file.asset.url");
  const fileName = requiredText(
    file.asset.originalFilename,
    "profile.file.asset.originalFilename",
  );
  const sizeLabel = formatFileSize(file.asset.size);

  return {
    href: downloadHref(url, fileName),
    fileName,
    ...(sizeLabel ? { sizeLabel } : {}),
  } satisfies CompanyProfileFile;
}

export function mapCompanyProfile(
  document: ProfileQueryDocument | null,
): CompanyProfileFile | null {
  if (!document?.profile?.file) return null;
  return mapProfileFile(document.profile.file);
}
