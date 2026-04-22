"use client";

import Link from "next/link";
import { useState } from "react";
import { FilterConfig, FilterType, GalleryFilter } from "@/lib/gallery/types";
import { filterConfigs, getFilterLabel } from "@/lib/gallery/data";
import { buildGalleryPath } from "@/lib/gallery/path-parser";
import { cn } from "@/utils/cn";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

interface FilterBarProps {
  activeFilters: Record<string, string>;
}

export function FilterBar({ activeFilters }: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    style: true,
    category: true,
  });

  const toggleSection = (type: string) => {
    setExpandedSections((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const activeEntries = Object.entries(activeFilters);

  return (
    <div>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm mb-4"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeEntries.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-brand-500 text-xs">
            {activeEntries.length}
          </span>
        )}
      </button>

      {/* Active Filters Chips */}
      {activeEntries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeEntries.map(([type, slug]) => (
            <Link
              key={type}
              href={buildGalleryPath(
                Object.fromEntries(activeEntries.filter(([t]) => t !== type))
              )}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-sm hover:bg-brand-500/30 transition-colors"
            >
              {getFilterLabel(type as FilterType, slug)}
              <X className="h-3 w-3" />
            </Link>
          ))}
          <Link
            href="/gallery"
            className="inline-flex items-center px-3 py-1 rounded-full text-white/50 text-sm hover:text-white transition-colors"
          >
            Clear all
          </Link>
        </div>
      )}

      {/* Filter Sections */}
      <div
        className={cn(
          "space-y-4",
          mobileOpen ? "block" : "hidden lg:block"
        )}
      >
        {filterConfigs.map((config) => (
          <FilterSection
            key={config.type}
            config={config}
            activeValue={activeFilters[config.type]}
            activeFilters={activeFilters}
            isExpanded={expandedSections[config.type] ?? false}
            onToggle={() => toggleSection(config.type)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterSection({
  config,
  activeValue,
  activeFilters,
  isExpanded,
  onToggle,
}: {
  config: FilterConfig;
  activeValue?: string;
  activeFilters: Record<string, string>;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-semibold text-white">{config.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-white/50 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
          {config.options.map((option) => {
            const isActive = activeValue === option.value;
            const newFilters = isActive
              ? Object.fromEntries(
                  Object.entries(activeFilters).filter(([k]) => k !== config.type)
                )
              : { ...activeFilters, [config.type]: option.value };

            return (
              <Link
                key={option.value}
                href={buildGalleryPath(newFilters)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-brand-500/20 text-brand-400"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <span>{option.label}</span>
                <span className="text-xs text-white/30">{option.count}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
