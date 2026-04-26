import { AspectRatio, BodyPlacement } from "@prisma/client";
import { db as prisma } from "@/lib/db";
import {
  createCreditLedgerEntry,
  getCreditBalance,
} from "@/lib/credits/usage";
import { generationService } from "@/lib/services/generation.service";
import {
  GenerateTattooInput,
  TattooStyle as TattooStyleSlug,
  styleLabels,
} from "@/lib/validations/generation";

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
  count: number
): Promise<GenerationWorkflowResult> {
  const requiredCredits = count;
  const availableCredits = await getCreditBalance(userId);

  if (availableCredits < requiredCredits) {
    throw new GenerationWorkflowError(
      "INSUFFICIENT_CREDITS",
      `You need ${requiredCredits} credits but only have ${availableCredits}.`,
      403,
      {
        required: requiredCredits,
        available: availableCredits,
      }
    );
  }

  const style = await ensureTattooStyle(input.style);
  const results =
    count === 1
      ? [await generationService.generateTattoo(input, userId)]
      : await generationService.generateMultiple(input, userId, count);

  return prisma.$transaction(async (tx) => {
    const currentBalance = await getCreditBalance(userId, tx);

    if (currentBalance < requiredCredits) {
      throw new GenerationWorkflowError(
        "INSUFFICIENT_CREDITS",
        `You need ${requiredCredits} credits but only have ${currentBalance}.`,
        403,
        {
          required: requiredCredits,
          available: currentBalance,
        }
      );
    }

    const persistedResults: PersistedGenerationResult[] = [];

    for (const result of results) {
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
              url: result.imageUrl,
              width: result.width,
              height: result.height,
              size: 0,
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
            },
            take: 1,
            orderBy: { createdAt: "asc" },
          },
        },
      });

      persistedResults.push({
        id: generation.id,
        imageUrl: generation.resultImages[0]?.url ?? result.imageUrl,
        prompt: generation.prompt,
        style: generation.style.name,
      });
    }

    const remainingCredits = currentBalance - requiredCredits;
    await createCreditLedgerEntry(tx, {
      userId,
      amount: -requiredCredits,
      balance: remainingCredits,
      type: "GENERATION_USE",
      description:
        count === 1
          ? `Generated tattoo: ${truncatePrompt(input.prompt)}`
          : `Generated ${count} tattoo variations: ${truncatePrompt(input.prompt)}`,
      generationId: persistedResults.length === 1 ? persistedResults[0].id : undefined,
    });

    return {
      data: persistedResults,
      creditsUsed: requiredCredits,
      remainingCredits,
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
