import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";

import {
  ABOUT_PAGE_TAG,
  articleTag,
  BLOG_ARTICLES_TAG,
  BLOG_AUTHORS_TAG,
  BLOG_SETTINGS_TAG,
  BLOG_TAGS_TAG,
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

const BLOG_COLLECTION_TAGS: Record<string, string> = {
  author: BLOG_AUTHORS_TAG,
  blogTag: BLOG_TAGS_TAG,
};

function isDraftOrVersion(id: string) {
  return id.startsWith("drafts.") || id.startsWith("versions.");
}

function tagsForDocument(id: string, type: string) {
  const singletonTag = PUBLISHED_SINGLETON_TAGS[type];

  // Singleton documents use their published id as the document id. This also
  // ignores draft, version, and unrelated documents.
  if (singletonTag) {
    return id === type ? [singletonTag] : null;
  }

  if (isDraftOrVersion(id)) return null;

  if (type === "article") {
    return [articleTag(id), BLOG_ARTICLES_TAG];
  }

  if (type === "blogSettings") {
    return [BLOG_SETTINGS_TAG];
  }

  const collectionTag = BLOG_COLLECTION_TAGS[type];
  if (collectionTag) {
    return [collectionTag, BLOG_ARTICLES_TAG];
  }

  return null;
}

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

    const tags = tagsForDocument(body._id, body._type);

    if (!tags) {
      return Response.json({ revalidated: false });
    }

    for (const tag of new Set(tags)) {
      revalidateTag(tag, { expire: 0 });
    }

    return Response.json({
      revalidated: true,
      tags,
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
