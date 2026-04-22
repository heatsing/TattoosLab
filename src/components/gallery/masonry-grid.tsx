"use client";

import Image from "next/image";
import Link from "next/link";
import { Tattoo } from "@/lib/gallery/types";
import { Heart, Eye, Wand2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface MasonryGridProps {
  tattoos: Tattoo[];
}

export function MasonryGrid({ tattoos }: MasonryGridProps) {
  if (tattoos.length === 0) {
    return (
      <div className="text-center py-20">
        <Wand2 className="h-12 w-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/60 text-lg">No designs found</p>
        <p className="text-white/40 text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  // Split into 3 columns for masonry effect
  const columns: Tattoo[][] = [[], [], []];
  tattoos.forEach((tattoo, i) => {
    columns[i % 3].push(tattoo);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-4">
          {column.map((tattoo) => (
            <TattooCard key={tattoo.id} tattoo={tattoo} />
          ))}
        </div>
      ))}
    </div>
  );
}

function TattooCard({ tattoo }: { tattoo: Tattoo }) {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-brand-500/30 transition-all">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={tattoo.imageUrl}
          alt={tattoo.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs font-medium text-white/90 capitalize">
            {tattoo.style}
          </span>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-brand-400 transition-colors">
            {tattoo.title}
          </h3>
          <p className="text-xs text-white/50 mt-1 capitalize">
            {tattoo.placement ? `${tattoo.placement} ` : ""}
            {tattoo.category}
          </p>
          <div className="flex items-center gap-3 mt-2 text-white/40 text-xs">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {tattoo.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {tattoo.viewCount}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Action */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <Link
          href={`/dashboard/generate?prompt=${encodeURIComponent(tattoo.title)}`}
          className="pointer-events-auto px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          Generate Similar
        </Link>
      </div>
    </div>
  );
}
