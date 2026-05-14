import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import {
  AuthSessionError,
  requireDatabaseUser,
} from "@/lib/auth/ensure-user";
import {
  BillingAccessError,
  getUserBillingState,
  hasFeatureAccess,
  recordUsageLog,
} from "@/lib/credits/usage";
import { getGenerationDeliveryUrl } from "@/lib/cloudinary";

type RouteContext = {
  params: Promise<{ generationId: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const user = await requireDatabaseUser();
    const { generationId } = await context.params;

    const generation = await prisma.tattooGeneration.findFirst({
      where: {
        id: generationId,
        userId: user.id,
      },
      select: {
        id: true,
        resultImages: {
          orderBy: { createdAt: "asc" },
          take: 1,
          select: {
            url: true,
            publicId: true,
          },
        },
      },
    });

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const image = generation.resultImages[0];
    if (!image) {
      return NextResponse.json(
        { error: "Generation image not found", code: "IMAGE_NOT_FOUND" },
        { status: 404 }
      );
    }

    const billingState = await getUserBillingState(user.id);
    const hasHdAccess = hasFeatureAccess(billingState, "hdDownload");

    let downloadUrl: string;

    if (image.publicId) {
      downloadUrl = getGenerationDeliveryUrl(image.publicId, {
        watermark: !hasHdAccess,
        hd: hasHdAccess,
      });
    } else if (hasHdAccess) {
      downloadUrl = image.url;
    } else {
      return NextResponse.json(
        {
          error: "Free-plan downloads are only available for newly generated assets.",
          code: "LEGACY_DOWNLOAD_RESTRICTED",
        },
        { status: 403 }
      );
    }

    if (hasHdAccess) {
      await recordUsageLog(prisma, {
        userId: user.id,
        action: "DOWNLOAD_HD",
        units: 1,
        generationId: generation.id,
        metadata: {
          source: "generation-download",
        },
      });
    }

    return NextResponse.json({
      success: true,
      url: downloadUrl,
      filename: `tattoo-${generation.id}.png`,
      hd: hasHdAccess,
      watermarked: !hasHdAccess,
    });
  } catch (error) {
    console.error("Generation download error:", error);

    if (error instanceof AuthSessionError || error instanceof BillingAccessError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to prepare download",
        code: "DOWNLOAD_ERROR",
      },
      { status: 500 }
    );
  }
}