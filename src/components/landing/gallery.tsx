"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Heart,
  Eye,
  Clock,
  Palette,
  MapPin,
  Zap,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
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
];

const galleryItems = [
  {
    style: "Geometric",
    prompt: "Sacred geometry mandala with golden ratios",
    image: "https://images.unsplash.com/photo-1598371839696-5c5cda994e28?w=600&h=600&fit=crop&q=80",
    artist: "Alex Chen",
    avatar: "AC",
    likes: 234,
    views: 1205,
    placement: "Forearm",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "12s",
    isHot: true,
    isNew: false,
  },
  {
    style: "Watercolor",
    prompt: "Flowing abstract waves with coral reef",
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
  },
  {
    style: "Minimalist",
    prompt: "Single continuous line portrait silhouette",
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
  },
  {
    style: "Traditional",
    prompt: "Classic nautical anchor with rope and rose",
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
  },
  {
    style: "Japanese",
    prompt: "Koi fish swimming upstream with cherry blossoms",
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
  },
  {
    style: "Blackwork",
    prompt: "Intricate sacred dot pattern mandala",
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
  },
  {
    style: "Neo-Traditional",
    prompt: "Owl with moon phases and celestial flowers",
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
  },
  {
    style: "Dotwork",
    prompt: "Stippled mountain landscape with geometric sun",
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
  },
  {
    style: "Geometric",
    prompt: "Crystal formation with sacred geometry overlay",
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
  },
];

const stats = [
  { label: "Total Designs", value: "12,847", icon: Sparkles },
  { label: "Active Artists", value: "3,291", icon: Users },
  { label: "Style Categories", value: "50+", icon: Palette },
  { label: "Trending Now", value: "Neo-Traditional", icon: TrendingUp },
];

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.style === activeCategory);

  const toggleLike = (index: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section id="gallery" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Community
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Gallery
              </span>
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Stunning designs created by our community of artists
            </p>
          </div>
          <Link href="/gallery" className="mt-4 sm:mt-0">
            <Button variant="outline">
              Explore All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/20">
                <stat.icon className="h-5 w-5 text-brand-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category Filter */}
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

        {/* Gallery Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-white/10 bg-white/5 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-square">
                <Image
                  src={item.image}
                  alt={`${item.style} tattoo - ${item.prompt}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  <div className="flex gap-2">
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
                      toggleLike(index);
                    }}
                    className="p-2 rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        likedItems.has(index)
                          ? "fill-red-500 text-red-500"
                          : "text-white/80"
                      )}
                    />
                  </button>
                </div>

                {/* Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {item.prompt}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-white/50">
                    <span className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" />
                      {item.placement}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Palette className="h-3 w-3" />
                      {item.colorMode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold text-white">
                      {item.avatar}
                    </div>
                    <span className="text-xs text-white/70">{item.artist}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40">
                    <span className="flex items-center gap-1 text-xs">
                      <Heart className="h-3 w-3" />
                      {item.likes + (likedItems.has(index) ? 1 : 0)}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Eye className="h-3 w-3" />
                      {item.views}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {item.generationTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                <Button size="sm" className="pointer-events-auto gap-2">
                  <Eye className="h-4 w-4" />
                  View Design
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Load More Designs
          </Button>
        </div>
      </div>
    </section>
  );
}
