import { Tattoo } from "@/lib/gallery/types";

interface SchemaMarkupProps {
  tattoos: Tattoo[];
  title: string;
  description: string;
  url: string;
}

export function SchemaMarkup({ tattoos, title, description, url }: SchemaMarkupProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description,
    url: url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tattoos.map((tattoo, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "ImageObject",
          name: tattoo.title,
          description: tattoo.description || `${tattoo.title} tattoo design`,
          contentUrl: tattoo.imageUrl,
          thumbnailUrl: tattoo.thumbnailUrl || tattoo.imageUrl,
          url: `${url}#${tattoo.slug}`,
          author: tattoo.artistName
            ? {
                "@type": "Person",
                name: tattoo.artistName,
              }
            : undefined,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  segments,
  baseUrl,
}: {
  segments: { label: string; url: string }[];
  baseUrl: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Gallery",
        item: `${baseUrl}/gallery`,
      },
      ...segments.map((seg, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: seg.label,
        item: `${baseUrl}${seg.url}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
