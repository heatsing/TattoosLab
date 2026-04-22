import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  generateTattooSchema,
  GenerateTattooInput,
} from "@/lib/validations/generation";
import { generationService } from "@/lib/services/generation.service";
import { db as prisma } from "@/lib/db";

const requestSchema = z.object({
  input: generateTattooSchema,
  generateMultiple: z.boolean().default(false),
  count: z.number().min(1).max(4).default(4),
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // Parse and validate request body
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

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    const requiredCredits = generateMultiple ? count : 1;

    if (user.credits < requiredCredits) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          code: "INSUFFICIENT_CREDITS",
          required: requiredCredits,
          available: user.credits,
        },
        { status: 403 }
      );
    }

    // Generate tattoo(s)
    let results;
    if (generateMultiple) {
      results = await generationService.generateMultiple(input, userId, count);
    } else {
      const result = await generationService.generateTattoo(input, userId);
      results = [result];
    }

    // Deduct credits and save to database
    await prisma.$transaction(async (tx) => {
      // Deduct credits
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: requiredCredits } },
      });

      // Create credit ledger entry
      await tx.creditLedger.create({
        data: {
          userId,
          amount: -requiredCredits,
          type: "GENERATION",
          description: `Generated ${results.length} tattoo design(s)`,
        },
      });

      // Save generation records
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

    return NextResponse.json({
      success: true,
      data: results,
      creditsUsed: requiredCredits,
    });
  } catch (error) {
    console.error("Generation API error:", error);

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
