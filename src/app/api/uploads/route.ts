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

const ALLOWED_UPLOAD_TYPES = new Set(["BODY_PHOTO", "REFERENCE"]);

export async function POST(req: NextRequest) {
  try {
    const user = await requireDatabaseUser();

    const formData = await req.formData();
    const file = formData.get("file");
    const uploadType = String(formData.get("type") || "REFERENCE");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    if (!ALLOWED_UPLOAD_TYPES.has(uploadType)) {
      return NextResponse.json(
        { error: "Invalid upload type", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const normalizedType = uploadType === "BODY_PHOTO" ? "BODY_PHOTO" : "REFERENCE";
    if (normalizedType === "BODY_PHOTO") {
      await assertFeatureAccess(user.id, "tryOn");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploaded = await uploadImage(dataUri, {
      folder:
        normalizedType === "BODY_PHOTO" ? "body-photos" : "reference-images",
      publicId: `${user.id}_${Date.now()}`,
    });

    const savedUpload = await prisma.userUpload.create({
      data: {
        userId: user.id,
        url: uploaded.url,
        publicId: uploaded.publicId,
        type: normalizedType,
        filename: file.name,
        size: file.size,
      },
      select: {
        id: true,
        url: true,
        publicId: true,
        type: true,
      },
    });

    return NextResponse.json({
      success: true,
      uploadId: savedUpload.id,
      url: savedUpload.url,
      publicId: savedUpload.publicId,
      type: savedUpload.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
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
        error: "Failed to upload image",
        code: "UPLOAD_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}