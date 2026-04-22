"use client";

import { useState, useCallback } from "react";
import { Wand2, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PromptTextarea } from "@/components/generator/prompt-textarea";
import { StyleSelector } from "@/components/generator/style-selector";
import { PlacementSelector } from "@/components/generator/placement-selector";
import { ColorModeSelector } from "@/components/generator/color-mode-selector";
import { AspectRatioSelector } from "@/components/generator/aspect-ratio-selector";
import { ReferenceUploader } from "@/components/generator/reference-uploader";
import { ResultCard } from "@/components/generator/result-card";
import {
  EmptyState,
  LoadingState,
  ErrorState,
  SuccessState,
} from "@/components/generator/generation-states";
import {
  generateTattoo,
  generateMultipleTattoos,
  GenerationActionResult,
} from "@/app/actions/generation";
import {
  GenerateTattooInput,
  TattooStyle,
  BodyPlacement,
  ColorMode,
  AspectRatio,
} from "@/lib/validations/generation";
import { toast } from "sonner";

type GenerationStatus = "idle" | "loading" | "success" | "error";

interface GenerationResult {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
}

export default function GeneratePage() {
  // Form state
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<TattooStyle>("geometric");
  const [bodyPlacement, setBodyPlacement] = useState<BodyPlacement | undefined>(
    undefined
  );
  const [colorMode, setColorMode] = useState<ColorMode>("black_and_grey");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>("");
  const [generateCount, setGenerateCount] = useState<1 | 4>(1);

  // Generation state
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [lastResult, setLastResult] = useState<{
    count: number;
    creditsUsed: number;
    remainingCredits?: number;
  } | null>(null);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!prompt.trim()) {
      errors.prompt = "Please describe your tattoo idea";
    } else if (prompt.length < 3) {
      errors.prompt = "Prompt must be at least 3 characters";
    }

    if (!style) {
      errors.style = "Please select a style";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    setStatus("loading");
    setError("");
    setProgress(0);
    setLastResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 1000);

    const input: GenerateTattooInput = {
      prompt,
      style,
      bodyPlacement,
      colorMode,
      aspectRatio,
      referenceImageUrl: referenceImageUrl || undefined,
    };

    try {
      let result: GenerationActionResult;

      if (generateCount === 4) {
        result = await generateMultipleTattoos(input, 4);
      } else {
        result = await generateTattoo(input);
      }

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success && result.data) {
        setResults(result.data);
        setStatus("success");
        setLastResult({
          count: result.data.length,
          creditsUsed: result.creditsUsed || 0,
          remainingCredits: result.remainingCredits,
        });
        toast.success(
          `Generated ${result.data.length} design${
            result.data.length > 1 ? "s" : ""
          }!`
        );
      } else {
        setError(result.error?.message || "Generation failed");
        setStatus("error");
        toast.error(result.error?.message || "Failed to generate tattoo");
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError("An unexpected error occurred");
      setStatus("error");
      toast.error("An unexpected error occurred");
    }
  };

  const handleExampleClick = useCallback((examplePrompt: string) => {
    setPrompt(examplePrompt);
    setValidationErrors((prev) => ({ ...prev, prompt: "" }));
  }, []);

  const handleRetry = () => {
    handleGenerate();
  };

  const handleClear = () => {
    setStatus("idle");
    setResults([]);
    setError("");
    setProgress(0);
    setLastResult(null);
  };

  const handleSaveResult = async (resultId: string) => {
    // TODO: Implement save functionality
    toast.success("Saved to your gallery!");
  };

  return (
    <div className="min-h-screen bg-black pb-12">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Wand2 className="h-6 w-6 text-brand-400" />
                AI Tattoo Generator
              </h1>
              <p className="text-sm text-white/60">
                Create stunning tattoo designs with AI
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-white">12 credits remaining</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <Card className="p-6 border-white/10 bg-white/5">
              {/* Prompt */}
              <PromptTextarea
                value={prompt}
                onChange={(value) => {
                  setPrompt(value);
                  if (validationErrors.prompt) {
                    setValidationErrors((prev) => ({ ...prev, prompt: "" }));
                  }
                }}
                error={validationErrors.prompt}
              />

              <div className="mt-6 space-y-6">
                {/* Style Selector */}
                <StyleSelector
                  value={style}
                  onChange={setStyle}
                  error={validationErrors.style}
                />

                {/* Color Mode */}
                <ColorModeSelector value={colorMode} onChange={setColorMode} />

                {/* Body Placement */}
                <PlacementSelector
                  value={bodyPlacement}
                  onChange={setBodyPlacement}
                />

                {/* Aspect Ratio */}
                <AspectRatioSelector
                  value={aspectRatio}
                  onChange={setAspectRatio}
                />

                {/* Reference Image */}
                <ReferenceUploader
                  value={referenceImageUrl}
                  onChange={setReferenceImageUrl}
                />
              </div>

              {/* Generate Options */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/60">Generate</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGenerateCount(1)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        generateCount === 1
                          ? "bg-brand-600 text-white"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      1 Design (1 credit)
                    </button>
                    <button
                      onClick={() => setGenerateCount(4)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        generateCount === 4
                          ? "bg-brand-600 text-white"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      4 Designs (4 credits)
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={status === "loading"}
                  className="w-full h-12 text-lg"
                >
                  {status === "loading" ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Tattoo
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Success Message */}
            {lastResult && status === "success" && (
              <SuccessState
                count={lastResult.count}
                creditsUsed={lastResult.creditsUsed}
                remainingCredits={lastResult.remainingCredits}
              />
            )}

            {/* States */}
            {status === "idle" && (
              <EmptyState onExampleClick={handleExampleClick} />
            )}

            {status === "loading" && (
              <LoadingState progress={Math.round(progress)} />
            )}

            {status === "error" && (
              <ErrorState
                error={error}
                onRetry={handleRetry}
                onClear={handleClear}
              />
            )}

            {status === "success" && results.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {results.map((result) => (
                  <ResultCard
                    key={result.id}
                    id={result.id}
                    imageUrl={result.imageUrl}
                    prompt={result.prompt}
                    style={result.style}
                    onSave={() => handleSaveResult(result.id)}
                    onRegenerate={handleGenerate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
