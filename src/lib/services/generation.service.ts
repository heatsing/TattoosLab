import { openaiProvider } from "@/lib/ai/openai";
import {
  GenerateTattooInput,
  TattooStyle,
  ColorMode,
  BodyPlacement,
} from "@/lib/validations/generation";

export interface GenerationResult {
  id: string;
  imageUrl: string;
  prompt: string;
  style: TattooStyle;
  createdAt: Date;
}

export interface GenerationError {
  code: string;
  message: string;
}

class GenerationService {
  private static instance: GenerationService;

  private constructor() {}

  public static getInstance(): GenerationService {
    if (!GenerationService.instance) {
      GenerationService.instance = new GenerationService();
    }
    return GenerationService.instance;
  }

  private buildPrompt(input: GenerateTattooInput): string {
    const { prompt, style, colorMode, bodyPlacement } = input;
    
    let enhancedPrompt = `Professional tattoo design: ${prompt}`;
    
    // Add style descriptor
    const styleDescriptors: Record<TattooStyle, string> = {
      geometric: "clean geometric patterns, symmetrical, mathematical precision",
      watercolor: "watercolor painting style, flowing colors, artistic splashes",
      traditional: "traditional American tattoo style, bold lines, classic imagery",
      neo_traditional: "neo-traditional style, bold outlines, vibrant colors, detailed shading",
      minimalist: "minimalist design, simple lines, elegant simplicity",
      japanese: "traditional Japanese irezumi style, flowing composition, wave patterns",
      blackwork: "heavy black ink, solid black areas, high contrast",
      dotwork: "intricate dotwork patterns, stippling technique, pointillism",
      realistic: "photorealistic style, detailed shading, lifelike appearance",
      tribal: "tribal patterns, bold black lines, cultural motifs",
      new_school: "new school style, cartoon-like, exaggerated features, bright colors",
      line_art: "fine line art, delicate lines, continuous line drawing",
      illustrative: "illustrative style, sketch-like, artistic interpretation",
    };

    enhancedPrompt += `. Style: ${styleDescriptors[style]}.`;

    // Add color mode
    const colorDescriptors: Record<ColorMode, string> = {
      black_and_grey: "Black and grey shading, monochromatic, no color",
      full_color: "Full color palette, vibrant colors, color saturation",
      single_color: "Single color ink, monochrome, one color only",
    };

    enhancedPrompt += ` Color scheme: ${colorDescriptors[colorMode]}.`;

    // Add body placement context if provided
    if (bodyPlacement) {
      enhancedPrompt += ` Designed for ${bodyPlacement} placement.`;
    }

    // Add tattoo-specific enhancements
    enhancedPrompt += " Tattoo artwork, skin-ready design, professional tattoo flash, clean background, isolated on white or skin tone background.";

    return enhancedPrompt;
  }

  private getAspectRatioSize(aspectRatio: string): { width: number; height: number } {
    switch (aspectRatio) {
      case "1:1":
        return { width: 1024, height: 1024 };
      case "4:5":
        return { width: 1024, height: 1280 };
      case "9:16":
        return { width: 1024, height: 1792 };
      case "16:9":
        return { width: 1792, height: 1024 };
      default:
        return { width: 1024, height: 1024 };
    }
  }

  public async generateTattoo(
    input: GenerateTattooInput,
    userId: string
  ): Promise<GenerationResult> {
    try {
      const prompt = this.buildPrompt(input);
      const size = this.getAspectRatioSize(input.aspectRatio);

      // Use DALL-E 3 for high-quality tattoo designs
      const result = await openaiProvider.generateImage({
        prompt: input.prompt,
        style: input.style,
        aspectRatio: input.aspectRatio as any,
        negativePrompt: undefined,
      });

      const imageUrl = result.url;

      if (!imageUrl) {
        throw new Error("Failed to generate image");
      }

      // Return result
      return {
        id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        imageUrl,
        prompt: input.prompt,
        style: input.style,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Generation error:", error);
      throw error;
    }
  }

  public async generateMultiple(
    input: GenerateTattooInput,
    userId: string,
    count: number = 4
  ): Promise<GenerationResult[]> {
    // Generate variations by slightly modifying the prompt
    const variations: GenerateTattooInput[] = Array(count)
      .fill(null)
      .map((_, i) => ({
        ...input,
        prompt: `${input.prompt} (variation ${i + 1})`,
      }));

    const results = await Promise.all(
      variations.map((v) => this.generateTattoo(v, userId))
    );

    return results;
  }
}

export const generationService = GenerationService.getInstance();
