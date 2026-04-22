// AI Provider Interface and Service
export interface AIProvider {
  generateImage(params: GenerateImageParams): Promise<GenerateImageResult>;
  upscaleImage?(imageUrl: string): Promise<string>;
}

export interface GenerateImageParams {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: "SQUARE" | "PORTRAIT" | "LANDSCAPE" | "WIDE";
  style?: string;
  referenceImageUrl?: string;
}

export interface GenerateImageResult {
  url: string;
  width: number;
  height: number;
  provider: string;
  metadata?: Record<string, any>;
}

export class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private defaultProvider: string;

  constructor(defaultProvider: string = "openai") {
    this.defaultProvider = defaultProvider;
  }

  registerProvider(name: string, provider: AIProvider) {
    this.providers.set(name, provider);
  }

  async generateImage(
    params: GenerateImageParams,
    providerName?: string
  ): Promise<GenerateImageResult> {
    const name = providerName || this.defaultProvider;
    const provider = this.providers.get(name);

    if (!provider) {
      throw new Error(`AI provider "${name}" not found`);
    }

    return provider.generateImage(params);
  }

  async upscaleImage(
    imageUrl: string,
    providerName?: string
  ): Promise<string> {
    const name = providerName || this.defaultProvider;
    const provider = this.providers.get(name);

    if (!provider) {
      throw new Error(`AI provider "${name}" not found`);
    }

    if (!provider.upscaleImage) {
      throw new Error(`Provider "${name}" does not support upscaling`);
    }

    return provider.upscaleImage(imageUrl);
  }

  setDefaultProvider(name: string) {
    if (!this.providers.has(name)) {
      throw new Error(`AI provider "${name}" not found`);
    }
    this.defaultProvider = name;
  }
}

// Singleton instance
export const aiService = new AIService();
