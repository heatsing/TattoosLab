import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateTattooSchema } from "@/lib/validations/generation";
import {
  generateAndPersistTattoos,
  GenerationWorkflowError,
} from "@/lib/generation/workflow";
import { requireDatabaseUser, AuthSessionError } from "@/lib/auth/ensure-user";

const requestSchema = z.object({
  input: generateTattooSchema,
  generateMultiple: z.boolean().default(false),
  count: z.number().min(1).max(4).default(4),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireDatabaseUser();

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
      user.id,
      input,
      generateMultiple ? count : 1,
      {
        ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        userAgent: req.headers.get("user-agent"),
      }
    );

    return NextResponse.json({
      success: true,
      data: result.data,
      creditsUsed: result.creditsUsed,
      remainingCredits: result.remainingCredits,
      billingMode: result.billingMode,
      remainingUsage: result.remainingUsage,
    });
  } catch (error) {
    console.error("Generation API error:", error);

    if (error instanceof AuthSessionError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

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