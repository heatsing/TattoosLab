import { tattoos } from "./data";
import type { CommunityGalleryItem } from "./community-gallery";

const colorStyles = new Set([
  "abstract",
  "illustrative",
  "japanese",
  "neo-traditional",
  "traditional",
  "watercolor",
]);

function formatLabel(value?: string): string {
  if (!value) return "Custom";

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function initials(name?: string): string {
  if (!name) return "TL";

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export const communityGalleryItems: CommunityGalleryItem[] = tattoos.map(
  (tattoo, index) => ({
    id: Number(tattoo.id) || index + 1,
    style: formatLabel(tattoo.style),
    prompt: tattoo.title,
    image: tattoo.imageUrl,
    artist: tattoo.artistName ?? "Tattoos Lab",
    avatar: initials(tattoo.artistName),
    likes: tattoo.likeCount,
    views: tattoo.viewCount,
    placement: formatLabel(tattoo.placement),
    colorMode: colorStyles.has(tattoo.style) ? "Full Color" : "Black & Grey",
    resolution: tattoo.imageUrl.startsWith("data:image/svg+xml")
      ? "2048x2048"
      : "1024x1024",
    generationTime: `${8 + (index % 22)}s`,
    isHot: tattoo.isFeatured || tattoo.likeCount >= 600,
    isNew: index >= 30,
    createdAt: tattoo.createdAt,
  })
);

export const communityGalleryCategories = [
  "All",
  ...Array.from(new Set(communityGalleryItems.map((item) => item.style))),
];
