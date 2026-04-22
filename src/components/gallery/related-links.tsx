"use client";

import Link from "next/link";
import { GalleryFilter } from "@/lib/gallery/types";
import { buildGalleryPath } from "@/lib/gallery/path-parser";
import { ArrowRight } from "lucide-react";

interface RelatedLinksProps {
  filters: Record<string, string>;
  relatedFilters: GalleryFilter[];
}

export function RelatedLinks({ filters, relatedFilters }: RelatedLinksProps) {
  if (relatedFilters.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold text-white mb-4">Related Searches</h3>
      <div className="flex flex-wrap gap-2">
        {relatedFilters.map((filter) => {
          const newFilters = { ...filters, [filter.type]: filter.slug };
          return (
            <Link
              key={`${filter.type}-${filter.slug}`}
              href={buildGalleryPath(newFilters)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 hover:text-white hover:border-brand-500/30 transition-all"
            >
              {filter.label}
              <span className="text-xs text-white/40">({filter.count})</span>
              <ArrowRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
