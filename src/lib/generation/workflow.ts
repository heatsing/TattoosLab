import { AspectRatio, BodyPlacement } from "@prisma/client";
import { db as prisma } from "@/lib/db";
import {
  assertGenerationAllowed,
  BillingAccessError,
  finalizeGenerationUsage,
} from "@/lib/credits/usage";
import { getGenerationDeliveryUrl, uploadImage } from "@/lib/cloudinary";
import { generationService } from "@/lib/services/generation.service";
import {
  GenerateTattooInput,
  TattooStyle as TattooStyleSlug,
  styleLabels,
} from "@/lib/validations/generation";
import type {
  GenerationAllowance,
  UserBillingState,
} from "@/lib/credits/usage";

export interface PersistedGenerationResult {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
}

export interface GenerationWorkflowResult {
  data: PersistedGenerationResult[];
  creditsUsed: number;
  remainingCredits: number;
  billingMode: "CREDITS" | "UNLIMITED";
  remainingUsage: number | null;
}

export class GenerationWorkflowError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    status: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function generateAndPersistTattoos(
  userId: string,
  input: GenerateTattooInput,
  count: number,
  requestContext?: {
    ipAddress?: string | null;
    userAgent?: string | null;
  }
): Promise<GenerationWorkflowResult> {
  let billingState: UserBillingState;
  let allowance: GenerationAllowance;

  try {
    const result = await assertGenerationAllowed(userId, count);
    billingState = result.state;
    allowance = result.allowance;
  } catch (error) {
    if (error instanceof BillingAccessError) {
      throw new GenerationWorkflowError(
        error.code,
        error.message,
        error.status,
        error.details
      );
    }

    throw error;
  }

  const [style, results] = await Promise.all([
    ensureTattooStyle(input.style),
    count === 1
      ? Promise.resolve([await generationService.generateTattoo(input, userId)])
      : generationService.generateMultiple(input, userId, count),
  ]);

  const uploadedResults = await Promise.all(
    results.map(async (result, index) => {
      const uploadedAsset = await uploadImage(result.imageUrl, {
        folder: "generated-tattoos",
        publicId: `${userId}_${Date.now()}_${index}`,
        transformation: [],
      });

      return {
        result,
        uploadedAsset,
      };
    })
  );

  return prisma.$transaction(async (tx) => {
    const persistedResults: PersistedGenerationResult[] = [];

    for (const item of uploadedResults) {
      const { result, uploadedAsset } = item;
      const generation = await tx.tattooGeneration.create({
        data: {
          userId,
          prompt: result.prompt,
          negativePrompt: input.negativePrompt || null,
          styleId: style.id,
          placement: mapPlacement(input.bodyPlacement),
          aspectRatio: mapAspectRatio(input.aspectRatio),
          referenceImageUrl: input.referenceImageUrl || null,
          status: "COMPLETED",
          creditsUsed: 1,
          completedAt: result.createdAt,
          resultImages: {
            create: {
              url: uploadedAsset.url,
              publicId: uploadedAsset.publicId,
              width: uploadedAsset.width,
              height: uploadedAsset.height,
              size: uploadedAsset.size,
            },
          },
        },
        select: {
          id: true,
          prompt: true,
          style: {
            select: {
              name: true,
            },
          },
          resultImages: {
            select: {
              url: true,
              publicId: true,
            },
            take: 1,
            orderBy: { createdAt: "asc" },
          },
        },
      });

      persistedResults.push({
        id: generation.id,
        imageUrl:
          generation.resultImages[0]?.publicId
            ? getGenerationDeliveryUrl(generation.resultImages[0].publicId, {
                watermark: billingState.plan.limits.watermark,
                hd: billingState.plan.limits.hdDownload,
              })
            : generation.resultImages[0]?.url ?? uploadedAsset.url,
        prompt: generation.prompt,
        style: generation.style.name,
      });
    }

    const remainingCredits = await finalizeGenerationUsage(tx, billingState, allowance, {
      count,
      description:
        count === 1
          ? `Generated tattoo: ${truncatePrompt(input.prompt)}`
          : `Generated ${count} tattoo variations: ${truncatePrompt(input.prompt)}`,
      generationId: persistedResults.length === 1 ? persistedResults[0].id : undefined,
      ipAddress: requestContext?.ipAddress,
      userAgent: requestContext?.userAgent,
    });

    return {
      data: persistedResults,
      creditsUsed: allowance.creditsToDeduct,
      remainingCredits,
      billingMode: allowance.mode,
      remainingUsage: allowance.remainingUsageAfter,
    };
  });
}

async function ensureTattooStyle(styleSlug: TattooStyleSlug) {
  return prisma.tattooStyle.upsert({
    where: { slug: styleSlug },
    update: {
      name: styleLabels[styleSlug],
      isActive: true,
    },
    create: {
      slug: styleSlug,
      name: styleLabels[styleSlug],
      promptPrefix: styleLabels[styleSlug],
    },
  });
}

function mapPlacement(
  placement: GenerateTattooInput["bodyPlacement"]
): BodyPlacement | null {
  if (!placement) {
    return null;
  }

  const placementMap: Record<
    NonNullable<GenerateTattooInput["bodyPlacement"]>,
    BodyPlacement
  > = {
    arm: "ARM",
    forearm: "FOREARM",
    wrist: "WRIST",
    shoulder: "SHOULDER",
    chest: "CHEST",
    back: "BACK",
    leg: "LEG",
    thigh: "THIGH",
    calf: "CALF",
    ankle: "ANKLE",
    neck: "NECK",
    ribcage: "RIBCAGE",
    hand: "HAND",
    foot: "FOOT",
  };

  return placementMap[placement];
}

function mapAspectRatio(
  aspectRatio: GenerateTattooInput["aspectRatio"]
): AspectRatio {
  switch (aspectRatio) {
    case "4:5":
    case "9:16":
      return "PORTRAIT";
    case "16:9":
      return "WIDE";
    case "1:1":
    default:
      return "SQUARE";
  }
}

function truncatePrompt(prompt: string): string {
  return prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt;
}