"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  generateTattooSchema,
  GenerateTattooInput,
} from "@/lib/validations/generation";
import {
  generateAndPersistTattoos,
  GenerationWorkflowError,
} from "@/lib/generation/workflow";
import { requireDatabaseUser } from "@/lib/auth/ensure-user";

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
  billingMode?: "CREDITS" | "UNLIMITED";
  remainingUsage?: number | null;
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
    const user = await requireDatabaseUser();

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

    const requestHeaders = await headers();
    const result = await generateAndPersistTattoos(
      user.id,
      validationResult.data,
      count,
      {
        ipAddress:
          requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        userAgent: requestHeaders.get("user-agent"),
      }
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/generate");
    revalidatePath("/dashboard/try-on");

    return {
      success: true,
      data: result.data,
      creditsUsed: result.creditsUsed,
      remainingCredits: result.remainingCredits,
      billingMode: result.billingMode,
      remainingUsage: result.remainingUsage,
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