"use client";

import { useEffect, useRef, useState } from "react";
import {
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
  type DuplicateActionProps,
  type DuplicateDocumentActionComponent,
} from "sanity";

import {
  isArticlePublishPlanApplied,
  planArticlePublish,
  resetArticleDuplicate,
  type ArticlePublishPlan,
} from "./article-plan";

const PREPARING_LABEL = "جارٍ تجهيز بيانات النشر…";
const FAILED_LABEL = "تعذّر تجهيز النشر، أعد المحاولة";
const FAILED_TITLE =
  "لم يتم تحديث تاريخ النشر أو بيانات المسارات السابقة. أعد المحاولة بعد التأكد من الاتصال.";
const PREPARATION_TIMEOUT_MS = 10_000;

/**
 * Wraps Sanity's native publish action. The wrapper only patches the managed
 * publication fields, then hands control back to the native action once the
 * draft reflects those fields. Validation, permissions, loading state and
 * error reporting stay inside the native action.
 */
export function createArticlePublishAction(
  Native: DocumentActionComponent,
): DocumentActionComponent {
  const ArticlePublishAction: DocumentActionComponent = (
    props: DocumentActionProps,
  ) => {
    const native = Native(props);
    const { patch } = useDocumentOperation(props.id, props.type);
    const [pending, setPending] = useState<ArticlePublishPlan | null>(null);
    const [failed, setFailed] = useState(false);
    const hasHandled = useRef(false);

    useEffect(() => {
      if (!pending || hasHandled.current) return;
      if (!isArticlePublishPlanApplied(props.draft, pending)) return;

      hasHandled.current = true;
      setPending(null);
      native?.onHandle?.();
    }, [pending, props.draft, native]);

    useEffect(() => {
      if (!pending) return;

      const timer = setTimeout(() => {
        if (hasHandled.current) return;
        hasHandled.current = true;
        setPending(null);
        setFailed(true);
      }, PREPARATION_TIMEOUT_MS);

      return () => clearTimeout(timer);
    }, [pending]);

    if (!native) return null;

    const handle = () => {
      const plan = planArticlePublish(props.draft, props.published);
      setFailed(false);

      if (plan.patches.length === 0) {
        native.onHandle?.();
        return;
      }

      hasHandled.current = false;
      setPending(plan);
      patch.execute(plan.patches);
    };

    const waiting = pending !== null;

    return {
      ...native,
      label: waiting ? PREPARING_LABEL : failed ? FAILED_LABEL : native.label,
      title: failed ? FAILED_TITLE : native.title,
      disabled: native.disabled || waiting,
      tone: failed ? "critical" : native.tone,
      onHandle: handle,
    };
  };

  ArticlePublishAction.action = "publish";
  ArticlePublishAction.displayName = "ArticlePublishAction";

  return ArticlePublishAction;
}

/**
 * Wraps Sanity's native duplicate action so a duplicate starts as an
 * unpublished article without inherited dates or historical slugs.
 */
export function createArticleDuplicateAction(
  Native: DocumentActionComponent,
): DocumentActionComponent {
  const ArticleDuplicateAction: DocumentActionComponent = (props) => {
    const duplicateNative = Native as DuplicateDocumentActionComponent;
    const duplicateProps: DuplicateActionProps = {
      ...props,
      mapDocument: (document) => resetArticleDuplicate(document),
    };

    return duplicateNative(duplicateProps);
  };

  ArticleDuplicateAction.action = "duplicate";
  ArticleDuplicateAction.displayName = "ArticleDuplicateAction";

  return ArticleDuplicateAction;
}
