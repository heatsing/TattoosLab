import OpenAI from "openai";
import { AIProvider, GenerateImageParams, GenerateImageResult } from "./index";

let openaiInstance: OpenAI | null = null;

function getOpenai(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiInstance = new OpenAI({ apiKey });
  }
  return openaiInstance;
}

const aspectRatioToSize: Record<string, { width: number; height: number }> = {
  SQUARE: { width: 1024, height: 1024 },
  PORTRAIT: { width: 1024, height: 1536 },
  LANDSCAPE: { width: 1536, height: 1024 },
  WIDE: { width: 1792, height: 1024 },
};

export class OpenAIProvider implements AIProvider {
  name = "openai";

  async generateImage(
    params: GenerateImageParams
  ): Promise<GenerateImageResult> {
    const size = aspectRatioToSize[params.aspectRatio || "SQUARE"];

    // Enhance prompt with style and tattoo-specific keywords
    let enhancedPrompt = params.prompt;
    if (params.style) {
      enhancedPrompt = `${params.style} style tattoo design: ${params.prompt}`;
    }
    enhancedPrompt = `${enhancedPrompt}, professional tattoo design, clean lines, high quality, isolated on white background, tattoo flash art`;

    const openai = getOpenai();
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      size: `${size.width}x${size.height}` as any,
      quality: "standard",
      n: 1,
      ...(params.negativePrompt && {
        // Note: DALL-E 3 doesn't support negative prompts directly
        // We could use prompt engineering instead
      }),
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    return {
      url: imageUrl,
      width: size.width,
      height: size.height,
      provider: this.name,
      metadata: {
        revisedPrompt: response.data?.[0]?.revised_prompt,
      },
    };
  }
}

export const openaiProvider = new OpenAIProvider();
