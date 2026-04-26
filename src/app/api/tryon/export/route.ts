import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { projectId, imageData } = await req.json();

    if (!projectId || !imageData) {
      return NextResponse.json(
        { error: "Missing required fields", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const project = await prisma.tryOnProject.findFirst({
      where: { id: projectId, userId },
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
