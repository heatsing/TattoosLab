"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
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

const categories = [
  "All",
  "Geometric",
  "Watercolor",
  "Minimalist",
  "Traditional",
  "Japanese",
  "Blackwork",
  "Neo-Traditional",
  "Dotwork",
  "Tribal",
  "Realism",
];

const sortOptions = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Most Liked", value: "liked" },
];

const galleryItems = [
  {
    id: 1,
    style: "Geometric",
    prompt: "Sacred geometry mandala with golden ratios and hexagonal patterns",
    image: "https://images.unsplash.com/photo-1598371839696-5c5cda994e28?w=600&h=600&fit=crop&q=80",
    artist: "Alex Chen",
    avatar: "AC",
    likes: 234,
    views: 1205,
    placement: "Forearm",
    colorMode: "Black & Grey",
    resolution: "2048x2048",
    generationTime: "12s",
    isHot: true,
    isNew: false,
    createdAt: "2024-12-15",
  },
  {
    id: 2,
    style: "Watercolor",
    prompt: "Flowing abstract ocean waves with coral reef details",
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=600&h=600&fit=crop&q=80",
    artist: "Mia Torres",
    avatar: "MT",
    likes: 189,
    views: 892,
    placement: "Shoulder",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "18s",
    isHot: false,
    isNew: true,
    createdAt: "2025-01-20",
  },
  {
    id: 3,
    style: "Minimalist",
    prompt: "Single continuous line portrait silhouette of a woman",
    image: "https://images.unsplash.com/photo-1590246815117-1fe56c231f43?w=600&h=600&fit=crop&q=80",
    artist: "Jonas Weber",
    avatar: "JW",
    likes: 312,
    views: 1543,
    placement: "Wrist",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "8s",
    isHot: true,
    isNew: false,
    createdAt: "2024-11-08",
  },
  {
    id: 4,
    style: "Traditional",
    prompt: "Classic nautical anchor wrapped in rope with rose banner",
    image: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=600&h=600&fit=crop&q=80",
    artist: "Sarah Kim",
    avatar: "SK",
    likes: 156,
    views: 678,
    placement: "Chest",
    colorMode: "Full Color",
    resolution: "1024x1024",
    generationTime: "14s",
    isHot: false,
    isNew: false,
    createdAt: "2024-10-22",
  },
  {
    id: 5,
    style: "Japanese",
    prompt: "Koi fish swimming upstream through cherry blossom petals",
    image: "https://images.unsplash.com/photo-1542727365-19732a80dcfd?w=600&h=600&fit=crop&q=80",
    artist: "Kenji Sato",
    avatar: "KS",
    likes: 278,
    views: 1102,
    placement: "Back",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "22s",
    isHot: true,
    isNew: true,
    createdAt: "2025-01-18",
  },
  {
    id: 6,
    style: "Blackwork",
    prompt: "Intricate sacred dot pattern mandala with floral elements",
    image: "https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?w=600&h=600&fit=crop&q=80",
    artist: "Luna Reyes",
    avatar: "LR",
    likes: 198,
    views: 845,
    placement: "Thigh",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "16s",
    isHot: false,
    isNew: false,
    createdAt: "2024-09-15",
  },
  {
    id: 7,
    style: "Neo-Traditional",
    prompt: "Owl with moon phases and celestial flowers on branch",
    image: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&h=600&fit=crop&q=80",
    artist: "Derek Stone",
    avatar: "DS",
    likes: 421,
    views: 2103,
    placement: "Upper Arm",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "20s",
    isHot: true,
    isNew: true,
    createdAt: "2025-01-25",
  },
  {
    id: 8,
    style: "Dotwork",
    prompt: "Stippled mountain landscape with geometric sun rays",
    image: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=600&h=600&fit=crop&q=80",
    artist: "Emma Blake",
    avatar: "EB",
    likes: 267,
    views: 1342,
    placement: "Calf",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "25s",
    isHot: false,
    isNew: false,
    createdAt: "2024-12-01",
  },
  {
    id: 9,
    style: "Geometric",
    prompt: "Crystal formation with sacred geometry overlay and aurora colors",
    image: "https://images.unsplash.com/photo-1598371839696-5c5cda994e28?w=600&h=600&fit=crop&q=80",
    artist: "Ryan Park",
    avatar: "RP",
    likes: 356,
    views: 1876,
    placement: "Ribcage",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "15s",
    isHot: true,
    isNew: false,
    createdAt: "2024-11-30",
  },
  {
    id: 10,
    style: "Realism",
    prompt: "Hyper realistic lion portrait with dramatic lighting",
    image: "https://images.unsplash.com/photo-1590246815117-1fe56c231f43?w=600&h=600&fit=crop&q=80",
    artist: "Maria Lopez",
    avatar: "ML",
    likes: 512,
    views: 3201,
    placement: "Chest",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "28s",
    isHot: true,
    isNew: true,
    createdAt: "2025-01-28",
  },
  {
    id: 11,
    style: "Tribal",
    prompt: "Polynesian tribal sleeve pattern with ocean wave motifs",
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=600&h=600&fit=crop&q=80",
    artist: "Kai Mahalo",
    avatar: "KM",
    likes: 298,
    views: 1567,
    placement: "Full Sleeve",
    colorMode: "Black & Grey",
    resolution: "2048x2048",
    generationTime: "19s",
    isHot: true,
    isNew: false,
    createdAt: "2024-10-05",
  },
  {
    id: 12,
    style: "Minimalist",
    prompt: "Tiny constellation map with connected stars on wrist",
    image: "https://images.unsplash.com/photo-1542727365-19732a80dcfd?w=600&h=600&fit=crop&q=80",
    artist: "Nina Patel",
    avatar: "NP",
    likes: 445,
    views: 2345,
    placement: "Wrist",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "6s",
    isHot: true,
    isNew: true,
    createdAt: "2025-01-30",
  },
];

export function GalleryContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredItems = useMemo(() => {
    let items = [...galleryItems];

    if (activeCategory !== "All") {
      items = items.filter((item) => item.style === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.prompt.toLowerCase().includes(q) ||
          item.style.toLowerCase().includes(q) ||
          item.artist.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "popular":
        items.sort((a, b) => b.views - a.views);
        break;
      case "liked":
        items.sort((a, b) => b.likes - a.likes);
        break;
      case "newest":
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return items;
  }, [activeCategory, searchQuery, sortBy]);

  const toggleLike = (id: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Community{" "}
            <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="mt-3 text-lg text-white/60 max-w-2xl">
            Browse thousands of AI-generated tattoo designs. Get inspired, save
            your favorites, and create your own masterpiece.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search designs, styles, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 px-3 rounded-md bg-white/5 border border-white/10 text-white/60 text-sm">
              <SlidersHorizontal className="h-4 w-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white/60 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-black">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex rounded-md border border-white/10 overflow-hidden">
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

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat
                  ? "bg-brand-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-white/40 mb-6">
          Showing {filteredItems.length} design
          {filteredItems.length !== 1 ? "s" : ""}
        </p>

        {/* Gallery Grid */}
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
                "group overflow-hidden border-white/10 bg-white/5 cursor-pointer transition-all hover:border-brand-500/30",
                viewMode === "list" && "flex flex-row"
              )}
            >
              {/* Image */}
              <div
                className={cn(
                  "relative overflow-hidden",
                  viewMode === "grid" ? "aspect-square" : "w-48 shrink-0"
                )}
              >
                <Image
                  src={item.image}
                  alt={`${item.style} tattoo - ${item.prompt}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs font-medium text-white/90">
                    {item.style}
                  </span>
                  {item.isHot && (
                    <Badge className="bg-red-500/80 text-white border-0 text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                  {item.isNew && (
                    <Badge className="bg-brand-500/80 text-white border-0 text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
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
                {/* Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4 flex-1">
                <p className="text-sm font-medium text-white line-clamp-1 mb-2">
                  {item.prompt}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
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
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-[10px] font-bold text-white">
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

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No designs found</p>
            <p className="text-white/40 text-sm mt-1">
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

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-white mb-3">
              Create Your Own Design
            </h2>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Can not find what you are looking for? Use our AI generator to
              create a unique tattoo design just for you.
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
