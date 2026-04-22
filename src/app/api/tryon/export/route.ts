import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { db as prisma } from "@/lib/db";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

    const { projectId, imageData } = await req.json();

    if (!projectId || !imageData) {
      return NextResponse.json(
        { error: "Missing required fields", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    // Verify project ownership
    const project = await prisma.tryOnProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageData, {
      folder: "tattoos-lab/try-on-results",
      public_id: `tryon_${projectId}_${Date.now()}`,
      overwrite: true,
      resource_type: "image",
    });

    // Update project with result URL
    await prisma.tryOnProject.update({
      where: { id: projectId },
      data: {
        resultUrl: uploadResult.secure_url,
        resultPublicId: uploadResult.public_id,
        status: "EXPORTED",
      },
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
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
