"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  generateTattooSchema,
  GenerateTattooInput,
} from "@/lib/validations/generation";
import { generationService } from "@/lib/services/generation.service";
import { db as prisma } from "@/lib/db";

export interface GenerationActionResult {
  success: boolean;
  data?: {
    id: string;
    imageUrl: string;
    prompt: string;
    style: string;
  }[];
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  creditsUsed?: number;
  remainingCredits?: number;
}

export async function generateTattoo(
  input: GenerateTattooInput
): Promise<GenerationActionResult> {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "You must be signed in to generate tattoos",
        },
      };
    }

    // Validate input
    const validationResult = generateTattooSchema.safeParse(input);
    if (!validationResult.success) {
      const flattened = validationResult.error.flatten();
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
          details: flattened.fieldErrors as Record<string, string[]>,
        },
      };
    }

    // Check credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < 1) {
      return {
        success: false,
        error: {
          code: "INSUFFICIENT_CREDITS",
          message: "You don't have enough credits. Please upgrade your plan.",
        },
      };
    }

    // Generate tattoo
    const result = await generationService.generateTattoo(validationResult.data, userId);

    // Save to database and deduct credits
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });

      await tx.creditLedger.create({
        data: {
          userId,
          amount: -1,
          type: "GENERATION",
          description: `Generated tattoo: ${input.prompt.slice(0, 50)}...`,
        },
      });

      await tx.tattooGeneration.create({
        data: {
          userId,
          prompt: input.prompt,
          style: input.style,
          bodyPlacement: input.bodyPlacement || null,
          colorMode: input.colorMode,
          aspectRatio: input.aspectRatio,
          referenceImageUrl: input.referenceImageUrl || null,
          resultImageUrl: result.imageUrl,
          status: "COMPLETED",
        },
      });
    });

    // Revalidate dashboard path
    revalidatePath("/dashboard");

    return {
      success: true,
      data: [
        {
          id: result.id,
          imageUrl: result.imageUrl,
          prompt: result.prompt,
          style: result.style,
        },
      ],
      creditsUsed: 1,
      remainingCredits: user.credits - 1,
    };
  } catch (error) {
    console.error("Generate tattoo action error:", error);

    return {
      success: false,
      error: {
        code: "GENERATION_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    };
  }
}

export async function generateMultipleTattoos(
  input: GenerateTattooInput,
  count: number = 4
): Promise<GenerationActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "You must be signed in to generate tattoos",
        },
      };
    }

    // Validate input
    const validationResult = generateTattooSchema.safeParse(input);
    if (!validationResult.success) {
      const flattened = validationResult.error.flatten();
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
          details: flattened.fieldErrors as Record<string, string[]>,
        },
      };
    }

    // Check credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < count) {
      return {
        success: false,
        error: {
          code: "INSUFFICIENT_CREDITS",
          message: `You need ${count} credits but only have ${user?.credits || 0}.`,
        },
      };
    }

    // Generate multiple tattoos
    const results = await generationService.generateMultiple(
      validationResult.data,
      userId,
      count
    );

    // Save to database and deduct credits
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: count } },
      });

      await tx.creditLedger.create({
        data: {
          userId,
          amount: -count,
          type: "GENERATION",
          description: `Generated ${count} tattoo variations`,
        },
      });

      for (const result of results) {
        await tx.tattooGeneration.create({
          data: {
            userId,
            prompt: input.prompt,
            style: input.style,
            bodyPlacement: input.bodyPlacement || null,
            colorMode: input.colorMode,
            aspectRatio: input.aspectRatio,
            referenceImageUrl: input.referenceImageUrl || null,
            resultImageUrl: result.imageUrl,
            status: "COMPLETED",
          },
        });
      }
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: results.map((r) => ({
        id: r.id,
        imageUrl: r.imageUrl,
        prompt: r.prompt,
        style: r.style,
      })),
      creditsUsed: count,
      remainingCredits: user.credits - count,
    };
  } catch (error) {
    console.error("Generate multiple tattoos action error:", error);

    return {
      success: false,
      error: {
        code: "GENERATION_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    };
  }
}
