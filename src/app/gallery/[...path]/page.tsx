import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { parseGalleryPath, buildFilterState, buildGalleryPath } from "@/lib/gallery/path-parser";
import {
  getTattoosByFilters,
  generateSEOTitle,
  generateSEODescription,
  getRelatedFilters,
  filterConfigs,
  getFilterLabel,
} from "@/lib/gallery/data";
import { FilterBar } from "@/components/gallery/filter-bar";
import { MasonryGrid } from "@/components/gallery/masonry-grid";
import { Pagination } from "@/components/gallery/pagination";
import { RelatedLinks } from "@/components/gallery/related-links";
import { SchemaMarkup, BreadcrumbSchema } from "@/components/gallery/schema-markup";
import { FilterType } from "@/lib/gallery/types";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

const ITEMS_PER_PAGE = 12;

interface Props {
  params: Promise<{ path: string[] }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const parsed = parseGalleryPath(path);

  if (!parsed.isValid) {
    return {
      title: "Gallery Not Found | Tattoos Lab",
    };
  }

  const filters = buildFilterState(parsed.segments);
  const filtered = getTattoosByFilters(filters);
  const title = generateSEOTitle(filters, filtered.length);
  const description = generateSEODescription(filters, filtered.length);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const { getPopularFilterCombinations } = await import("@/lib/gallery/data");
  const combos = getPopularFilterCombinations();

  return combos.map((filters) => {
    const parts: string[] = [];
    for (const [type, slug] of Object.entries(filters)) {
      parts.push(type, slug);
    }
    return { path: parts };
  });
}

export default async function GalleryFilterPage({ params, searchParams }: Props) {
  const { path } = await params;
  const { page } = await searchParams;

  const parsed = parseGalleryPath(path);
  if (!parsed.isValid) {
    notFound();
  }

  const filters = buildFilterState(parsed.segments);
  const filtered = getTattoosByFilters(filters);
  const totalCount = filtered.length;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTattoos = filtered.slice(start, start + ITEMS_PER_PAGE);

  const title = generateSEOTitle(filters, totalCount);
  const description = generateSEODescription(filters, totalCount);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  const currentPath = buildGalleryPath(filters);
  const canonicalUrl = `${baseUrl}${currentPath}`;

  // Related filters from the first unused filter type
  const usedTypes = Object.keys(filters) as FilterType[];
  const unusedTypes = ["style", "category", "placement", "meaning", "audience"].filter(
    (t) => !usedTypes.includes(t as FilterType)
  ) as FilterType[];

  const relatedFilters = unusedTypes.length > 0
    ? getRelatedFilters(filters, unusedTypes[0]).slice(0, 12)
    : [];

  // Breadcrumb segments
  const breadcrumbSegments = parsed.segments.map((seg) => ({
    label: getFilterLabel(seg.type, seg.slug),
    url: buildGalleryPath(Object.fromEntries(parsed.segments.slice(0, parsed.segments.indexOf(seg) + 1).map((s) => [s.type, s.slug]))),
  }));

  return (
    <>
      <SchemaMarkup
        tattoos={paginatedTattoos}
        title={title}
        description={description}
        url={canonicalUrl}
      />
      <BreadcrumbSchema segments={breadcrumbSegments} baseUrl={baseUrl} />

      <div className="min-h-screen bg-black">
        <Navbar />
        <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-white/40 mb-4">
              <a href="/gallery" className="hover:text-brand-400 transition-colors">Gallery</a>
              {parsed.segments.map((seg, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="text-white/20">/</span>
                  <span className="capitalize text-white/60">{getFilterLabel(seg.type, seg.slug)}</span>
                </span>
              ))}
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
            <p className="text-white/50 mt-2 max-w-2xl">{description}</p>
            <p className="text-sm text-white/30 mt-1">{totalCount} designs found</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <FilterBar activeFilters={filters} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <MasonryGrid tattoos={paginatedTattoos} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={currentPath}
              />
              <RelatedLinks filters={filters} relatedFilters={relatedFilters} />
            </div>
          </div>
        </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
