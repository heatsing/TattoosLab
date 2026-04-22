"use client";

import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Tattoo Enthusiast",
    content:
      "I was able to visualize my sleeve design before committing. The AI understood exactly what I wanted and the body preview feature is incredible!",
    rating: 5,
  },
  {
    name: "Marcus Chen",
    role: "First-time Client",
    content:
      "As someone who was nervous about getting their first tattoo, this gave me the confidence to proceed. The design matched my vision perfectly.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Tattoo Artist",
    content:
      "I recommend this to all my clients. It helps us communicate better and ensures they get exactly what they want. Game changer for the industry.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Loved by
            <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Thousands
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            See what our community has to say about their experience
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-brand-400/50 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-white/80 mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-600 to-pink-600" />
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-white/60">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
