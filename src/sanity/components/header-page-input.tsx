"use client";

import { useFormValue, type StringInputProps } from "sanity";

import { getAvailableHeaderPages } from "@/lib/header-navigation";

export function HeaderPageInput(props: StringInputProps) {
  const navigation = useFormValue(["header", "navigation"]);
  const itemSegment = props.path[2];
  const currentKey =
    typeof itemSegment === "object" && "_key" in itemSegment
      ? itemSegment._key
      : undefined;
  const list: { title: string; value: string }[] = getAvailableHeaderPages(
    navigation,
    currentKey,
  ).map((page) => ({ ...page }));

  // Keep an invalid or non-canonical stored value visible until the editor fixes it.
  if (props.value && !list.some((page) => page.value === props.value)) {
    list.unshift({ title: `قيمة محفوظة: ${props.value}`, value: props.value });
  }

  return props.renderDefault({
    ...props,
    schemaType: {
      ...props.schemaType,
      options: { ...props.schemaType.options, list },
    },
  });
}
