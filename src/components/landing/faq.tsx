"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does the AI tattoo generation work?",
    answer:
      "Simply describe your tattoo idea in words - style, subject, placement, and any specific details. Our AI, powered by state-of-the-art image generation models, creates unique designs based on your description in seconds.",
  },
  {
    question: "Can I see the tattoo on my body before getting it?",
    answer:
      "Yes! Our AR preview feature lets you upload a photo of your body and see exactly how the tattoo will look. The AI adjusts for skin tone, body contours, and lighting to give you a realistic preview.",
  },
  {
    question: "Do I own the designs I create?",
    answer:
      "Absolutely. All designs you generate are yours to keep, download, and use. You have full commercial rights to use them for your tattoo or any other purpose.",
  },
  {
    question: "What styles are available?",
    answer:
      "We offer 50+ tattoo styles including Geometric, Watercolor, Traditional, Neo-Traditional, Japanese, Minimalist, Blackwork, Dotwork, and many more. You can also mix styles for unique results.",
  },
  {
    question: "How many designs can I generate?",
    answer:
      "Free users get 3 generations to try the service. Pro subscribers get 50 generations per month, and Studio subscribers get 200 generations per month. Additional credits can be purchased anytime.",
  },
  {
    question: "Can I use this as a tattoo artist?",
    answer:
      "Definitely! Many tattoo artists use our Studio plan to create custom designs for clients, speed up their workflow, and offer visual previews. The Studio plan includes client management features and API access.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently Asked
            <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Questions
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Everything you need to know about Tattoos Lab
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-brand-400 shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-white/70">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
