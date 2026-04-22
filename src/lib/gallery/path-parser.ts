import { FilterType, ParsedPath } from "./types";
import { filterConfigs } from "./data";

const validFilterTypes: FilterType[] = ["style", "placement", "category", "meaning", "audience"];

export function parseGalleryPath(pathSegments: string[]): ParsedPath {
  const segments: { type: FilterType; slug: string }[] = [];

  for (let i = 0; i < pathSegments.length; i += 2) {
    const type = pathSegments[i] as FilterType;
    const slug = pathSegments[i + 1];

    if (!validFilterTypes.includes(type) || !slug) {
      return { segments, isValid: false };
    }

    // Validate slug exists in filter config
    const config = filterConfigs.find((c) => c.type === type);
    const option = config?.options.find((o) => o.value === slug);
    if (!option) {
      return { segments, isValid: false };
    }

    segments.push({ type, slug });
  }

  return { segments, isValid: segments.length > 0 };
}

export function buildFilterState(segments: { type: FilterType; slug: string }[]): Record<string, string> {
  const filters: Record<string, string> = {};
  for (const seg of segments) {
    filters[seg.type] = seg.slug;
  }
  return filters;
}

export function buildGalleryPath(filters: Record<string, string>): string {
  const parts: string[] = [];
  for (const [type, slug] of Object.entries(filters)) {
    parts.push(type, slug);
  }
  return `/gallery/${parts.join("/")}`;
}
