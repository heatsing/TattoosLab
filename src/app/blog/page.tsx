import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, User, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - Tattoos Lab",
  description: "Insights, trends, and stories from the world of AI tattoo design.",
};

const featuredPost = {
  title: "The Rise of AI in Tattoo Design: A New Era for Body Art",
  excerpt:
    "How artificial intelligence is transforming the tattoo industry, from concept to skin. We explore the technology, the artists adapting to it, and what it means for the future of permanent art.",
  author: "Alex Rivera",
  date: "Jan 15, 2025",
  readTime: "8 min read",
  category: "Industry",
};

const posts = [
  {
    title: "10 Watercolor Tattoo Trends to Watch in 2025",
    excerpt: "From soft florals to abstract splashes, discover the watercolor styles dominating this year.",
    author: "Mia Chen",
    date: "Jan 28, 2025",
    readTime: "5 min read",
    category: "Trends",
  },
  {
    title: "How to Describe Your Dream Tattoo to AI",
    excerpt: "A complete guide to writing prompts that get you exactly the design you are looking for.",
    author: "James Okafor",
    date: "Jan 22, 2025",
    readTime: "6 min read",
    category: "Guide",
  },
  {
    title: "Minimalist vs Maximalist: Choosing Your Style",
    excerpt: "Two tattoo artists debate the merits of simple lines versus elaborate full-body pieces.",
    author: "Sofia Lindberg",
    date: "Jan 18, 2025",
    readTime: "7 min read",
    category: "Style",
  },
  {
    title: "Behind the Algorithm: How Our AI Understands Tattoo Art",
    excerpt: "A technical deep dive into the machine learning models powering Tattoos Lab's generator.",
    author: "James Okafor",
    date: "Jan 10, 2025",
    readTime: "10 min read",
    category: "Technology",
  },
  {
    title: "User Spotlight: Sarah's Sleeve Journey",
    excerpt: "How one user designed an entire arm sleeve using our AI tools and brought it to life.",
    author: "Sofia Lindberg",
    date: "Jan 5, 2025",
    readTime: "4 min read",
    category: "Story",
  },
  {
    title: "The History of Japanese Tattoo Art",
    excerpt: "From irezumi traditions to modern interpretations, explore the rich cultural heritage.",
    author: "Mia Chen",
    date: "Dec 28, 2024",
    readTime: "9 min read",
    category: "History",
  },
];

const categories = ["All", "Industry", "Trends", "Guide", "Style", "Technology", "Story", "History"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Our Blog
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Insights &{" "}
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                Inspiration
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Stories, guides, and trends from the intersection of AI and tattoo art.
            </p>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  cat === "All"
                    ? "bg-brand-500 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <Card className="border-white/10 bg-white/5 mb-10 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-brand-600/20 to-pink-600/20 flex items-center justify-center">
                <Sparkles className="h-20 w-20 text-white/10" />
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-brand-500/20 text-brand-400 border-0">
                  {featuredPost.category}
                </Badge>
                <h2 className="text-2xl font-bold text-white mb-3">{featuredPost.title}</h2>
                <p className="text-white/60 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-white/50 mb-6">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </span>
                  <span>{featuredPost.date}</span>
                </div>
                <Link href="/blog">
                  <span className="inline-flex items-center text-brand-400 hover:text-brand-300 font-medium">
                    Read Article <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </CardContent>
            </div>
          </Card>

          {/* Posts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Card key={i} className="border-white/10 bg-white/5 overflow-hidden group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-brand-600/10 to-pink-600/10 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-white/10 group-hover:text-white/20 transition-colors" />
                </div>
                <CardContent className="p-5">
                  <Badge variant="outline" className="border-white/10 text-white/50 text-xs mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-brand-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-white/60 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
