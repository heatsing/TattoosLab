import { MetadataRoute } from "next";
import {
  getPopularFilterCombinations,
  filterConfigs,
} from "@/lib/gallery/data";
import { buildGalleryPath } from "@/lib/gallery/path-parser";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  // Static pages
  const staticPages = [
    "/",
    "/gallery",
    "/pricing",
    "/about",
    "/blog",
    "/careers",
    "/press",
    "/help",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
    "/dashboard/generate",
    "/dashboard/try-on",
    "/sign-in",
    "/sign-up",
  ];

  const staticEntries = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1.0 : 0.8,
  }));

  // Popular filter combinations for static generation
  const popularCombos = getPopularFilterCombinations();
  const galleryEntries = popularCombos.map((filters) => ({
    url: `${baseUrl}${buildGalleryPath(filters)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Individual filter pages (style, category, placement, meaning, audience)
  const singleFilterEntries = filterConfigs.flatMap((config) =>
    config.options.map((opt) => ({
      url: `${baseUrl}/gallery/${config.type}/${opt.value}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }))
  );

  return [...staticEntries, ...galleryEntries, ...singleFilterEntries];
}
