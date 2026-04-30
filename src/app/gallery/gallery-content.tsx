"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Eye,
  Clock,
  Palette,
  MapPin,
  Search,
  Zap,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  Grid3X3,
  LayoutList,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  communityGalleryCategories,
  communityGalleryItems,
} from "@/lib/gallery/community-gallery";

const sortOptions = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Most Liked", value: "liked" },
];

export function GalleryContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredItems = useMemo(() => {
    const items = communityGalleryItems.filter((item) => {
      if (activeCategory !== "All" && item.style !== activeCategory) {
        return false;
      }

      if (!searchQuery.trim()) {
        return true;
      }

      const query = searchQuery.toLowerCase();
      return (
        item.prompt.toLowerCase().includes(query) ||
        item.style.toLowerCase().includes(query) ||
        item.artist.toLowerCase().includes(query)
      );
    });

    switch (sortBy) {
      case "liked":
        return [...items].sort((a, b) => b.likes - a.likes);
      case "newest":
        return [...items].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "popular":
      default:
        return [...items].sort((a, b) => b.views - a.views);
    }
  }, [activeCategory, searchQuery, sortBy]);

  const toggleLike = (id: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Community{" "}
            <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/60">
            Browse tattoo flash created by our community. Explore styles, study
            the linework, and try the design on your own photo.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Search designs, styles, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white/60">
              <SlidersHorizontal className="h-4 w-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer border-none bg-transparent text-sm text-white/60 outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-black">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex overflow-hidden rounded-md border border-white/10">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid"
                    ? "bg-brand-500/20 text-brand-400"
                    : "bg-white/5 text-white/40 hover:text-white/60"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "list"
                    ? "bg-brand-500/20 text-brand-400"
                    : "bg-white/5 text-white/40 hover:text-white/60"
                )}
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {communityGalleryCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
                activeCategory === category
                  ? "bg-brand-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="mb-6 text-sm text-white/40">
          Showing {filteredItems.length} design
          {filteredItems.length !== 1 ? "s" : ""}
        </p>

        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid"
              ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          )}
        >
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "group cursor-pointer overflow-hidden border-white/10 bg-white/5 transition-all hover:border-brand-500/30",
                viewMode === "list" && "flex flex-row"
              )}
            >
              <div
                className={cn(
                  "relative overflow-hidden",
                  viewMode === "grid" ? "aspect-[4/5]" : "w-52 shrink-0"
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#42362c,transparent_56%),linear-gradient(160deg,#f6efdf_0%,#eadcc3_52%,#f8f3e8_100%)] opacity-95 transition-transform duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-3 rounded-[28px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.68),rgba(255,255,255,0.12))] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_18px_30px_rgba(0,0,0,0.12)]" />
                <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-10">
                  <img
                    src={item.image}
                    alt={`${item.style} tattoo - ${item.prompt}`}
                    className="h-full w-full object-contain drop-shadow-[0_16px_26px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="absolute left-3 top-3 flex gap-2">
                  <span className="rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                    {item.style}
                  </span>
                  {item.isHot && (
                    <Badge className="border-0 bg-red-500/80 text-xs text-white">
                      <Zap className="mr-1 h-3 w-3" />
                      Hot
                    </Badge>
                  )}
                  {item.isNew && (
                    <Badge className="border-0 bg-brand-500/80 text-xs text-white">
                      New
                    </Badge>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item.id);
                  }}
                  className="absolute right-3 top-3 rounded-full bg-black/40 p-2 backdrop-blur-sm transition-colors hover:bg-black/60"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 transition-colors",
                      likedItems.has(item.id)
                        ? "fill-red-500 text-red-500"
                        : "text-white/80"
                    )}
                  />
                </button>

                <div className="absolute bottom-3 left-3 rounded-full border border-black/10 bg-black/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-black/70 backdrop-blur-sm">
                  Tattoo Flash
                </div>
              </div>

              <div className="flex-1 p-4">
                <p className="mb-2 line-clamp-2 text-sm font-medium text-white">
                  {item.prompt}
                </p>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 text-xs text-white/50">
                    <MapPin className="h-3 w-3" />
                    {item.placement}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/50">
                    <Palette className="h-3 w-3" />
                    {item.colorMode}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/50">
                    <Clock className="h-3 w-3" />
                    {item.generationTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[10px] font-bold text-white">
                      {item.avatar}
                    </div>
                    <span className="text-xs text-white/60">{item.artist}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40">
                    <span className="flex items-center gap-1 text-xs">
                      <Heart className="h-3 w-3" />
                      {item.likes + (likedItems.has(item.id) ? 1 : 0)}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Eye className="h-3 w-3" />
                      {item.views}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-white/20" />
            <p className="text-lg text-white/60">No designs found</p>
            <p className="mt-1 text-sm text-white/40">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-12">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Create Your Own Design
            </h2>
            <p className="mx-auto mb-6 max-w-md text-white/60">
              Want something more personal? Use our AI generator to spin up a
              fresh tattoo concept in seconds.
            </p>
            <Link href="/dashboard/generate">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Start Creating
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
