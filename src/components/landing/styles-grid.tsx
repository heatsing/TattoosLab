"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

const styles = [
  { name: "Geometric", count: "2,400+ designs" },
  { name: "Watercolor", count: "1,800+ designs" },
  { name: "Traditional", count: "3,200+ designs" },
  { name: "Minimalist", count: "2,100+ designs" },
  { name: "Japanese", count: "1,500+ designs" },
  { name: "Neo-Traditional", count: "1,900+ designs" },
  { name: "Blackwork", count: "1,600+ designs" },
  { name: "Dotwork", count: "1,200+ designs" },
];

export function StylesGrid() {
  return (
    <section className="py-24 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Explore
            <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Tattoo Styles
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            From classic to contemporary, find the perfect style for your next tattoo
          </p>
        </div>

        {/* Styles Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {styles.map((style) => (
            <Link key={style.name} href={`/gallery?style=${encodeURIComponent(style.name)}`}>
              <Card className="group cursor-pointer border-white/10 bg-white/5 p-6 transition-all hover:border-brand-500/50 hover:bg-white/10 h-full">
                <div className="aspect-square mb-4 rounded-lg bg-gradient-to-br from-brand-600/20 to-pink-600/20 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-600 to-pink-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-white text-center">{style.name}</h3>
                <p className="text-sm text-white/60 text-center">{style.count}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
