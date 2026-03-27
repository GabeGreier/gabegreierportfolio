export function shouldBypassImageOptimization(src: string): boolean {
  const normalized = src.split("?")[0].toLowerCase();
  return normalized.endsWith(".svg") || normalized.endsWith(".gif");
}
