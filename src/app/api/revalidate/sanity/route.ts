import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";

import {
  ABOUT_PAGE_TAG,
  CERTIFICATES_PAGE_TAG,
  HOME_PAGE_TAG,
  SITE_SETTINGS_TAG,
} from "@/sanity/lib/cache-tags";

type SanityWebhookPayload = {
  _id?: string;
  _type?: string;
};

const PUBLISHED_SINGLETON_TAGS: Record<string, string> = {
  siteSettings: SITE_SETTINGS_TAG,
  homePage: HOME_PAGE_TAG,
  aboutPage: ABOUT_PAGE_TAG,
  certificatesPage: CERTIFICATES_PAGE_TAG,
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();

  if (!secret) {
    console.error(
      "Sanity revalidation is not configured: SANITY_REVALIDATE_SECRET is missing.",
    );
    return Response.json(
      { error: "Revalidation is not configured." },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } =
      await parseBody<SanityWebhookPayload>(request, secret, true);

    if (isValidSignature !== true) {
      return Response.json(
        { error: "Invalid webhook signature." },
        { status: 401 },
      );
    }

    if (
      !body ||
      typeof body._id !== "string" ||
      typeof body._type !== "string"
    ) {
      return Response.json(
        { error: "Malformed webhook payload." },
        { status: 400 },
      );
    }

    const tag = PUBLISHED_SINGLETON_TAGS[body._type];

    // Singleton documents use their published id as the document id. This
    // also ignores draft, version, and unrelated documents.
    if (!tag || body._id !== body._type) {
      return Response.json({ revalidated: false });
    }

    revalidateTag(tag, { expire: 0 });

    return Response.json({
      revalidated: true,
      tag,
    });
  } catch (error) {
    console.error(
      "Failed to process Sanity revalidation webhook.",
      error instanceof Error ? error.message : "Unknown error",
    );
    return Response.json(
      { error: "Invalid webhook request." },
      { status: 400 },
    );
  }
}
