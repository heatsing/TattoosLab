import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { uploadImage } from "@/lib/cloudinary";
import {
  assertFeatureAccess,
  BillingAccessError,
} from "@/lib/credits/usage";
import {
  AuthSessionError,
  requireDatabaseUser,
} from "@/lib/auth/ensure-user";

export async function POST(req: NextRequest) {
  try {
    const user = await requireDatabaseUser();
    await assertFeatureAccess(user.id, "tryOn");

    const { projectId, imageData } = await req.json();

    if (!projectId || !imageData) {
      return NextResponse.json(
        { error: "Missing required fields", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const project = await prisma.tryOnProject.findFirst({
      where: { id: projectId, userId: user.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const uploaded = await uploadImage(imageData, {
      folder: "try-on-results",
      publicId: `tryon_${projectId}_${Date.now()}`,
    });

    await prisma.tryOnProject.update({
      where: { id: projectId },
      data: {
        resultUrl: uploaded.url,
        resultPublicId: uploaded.publicId,
        status: "EXPORTED",
      },
    });

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      publicId: uploaded.publicId,
    });
  } catch (error) {
    console.error("Export try-on project error:", error);
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
        error: "Failed to export project",
        code: "EXPORT_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}