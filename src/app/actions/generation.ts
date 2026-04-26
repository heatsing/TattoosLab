"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  generateTattooSchema,
  GenerateTattooInput,
} from "@/lib/validations/generation";
import {
  generateAndPersistTattoos,
  GenerationWorkflowError,
} from "@/lib/generation/workflow";

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
  return runGenerationAction(input, 1);
}

export async function generateMultipleTattoos(
  input: GenerateTattooInput,
  count: number = 4
): Promise<GenerationActionResult> {
  return runGenerationAction(input, count);
}

async function runGenerationAction(
  input: GenerateTattooInput,
  count: number
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

    const result = await generateAndPersistTattoos(
      userId,
      validationResult.data,
      count
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/generate");
    revalidatePath("/dashboard/try-on");

    return {
      success: true,
      data: result.data,
      creditsUsed: result.creditsUsed,
      remainingCredits: result.remainingCredits,
    };
  } catch (error) {
    console.error("Generate tattoo action error:", error);

    if (error instanceof GenerationWorkflowError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }

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
