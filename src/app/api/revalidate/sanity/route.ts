import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";

import { SITE_SETTINGS_TAG } from "@/sanity/lib/cache-tags";

type SanityWebhookPayload = {
  _id?: string;
  _type?: string;
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

 
    if (body._id !== "siteSettings" || body._type !== "siteSettings") {
      return Response.json({ revalidated: false });
    }

    revalidateTag(SITE_SETTINGS_TAG, { expire: 0 });

    return Response.json({
      revalidated: true,
      tag: SITE_SETTINGS_TAG,
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
