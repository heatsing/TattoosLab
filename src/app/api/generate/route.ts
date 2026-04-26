import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { generateTattooSchema } from "@/lib/validations/generation";
import {
  generateAndPersistTattoos,
  GenerationWorkflowError,
} from "@/lib/generation/workflow";

const requestSchema = z.object({
  input: generateTattooSchema,
  generateMultiple: z.boolean().default(false),
  count: z.number().min(1).max(4).default(4),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          code: "VALIDATION_ERROR",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { input, generateMultiple, count } = validationResult.data;
    const result = await generateAndPersistTattoos(
      userId,
      input,
      generateMultiple ? count : 1
    );

    return NextResponse.json({
      success: true,
      data: result.data,
      creditsUsed: result.creditsUsed,
      remainingCredits: result.remainingCredits,
    });
  } catch (error) {
    console.error("Generation API error:", error);

    if (error instanceof GenerationWorkflowError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: error.status }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate tattoo",
        code: "GENERATION_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
