export function formatFileSize(size: number | null | undefined) {
  if (typeof size !== "number" || !Number.isFinite(size)) return undefined;
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} ميجابايت`;
  if (size >= 1024) return `${Math.max(1, Math.round(size / 1024))} كيلوبايت`;
  return `${Math.max(0, Math.round(size))} بايت`;
}


export function downloadHref(url: string, fileName: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}dl=${encodeURIComponent(fileName)}`;
}
