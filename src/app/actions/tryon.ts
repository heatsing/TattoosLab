"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db as prisma } from "@/lib/db";
import {
  createTryOnProjectSchema,
  updateTryOnProjectSchema,
  CreateTryOnProjectInput,
  UpdateTryOnProjectInput,
} from "@/lib/validations/tryon";

export interface TryOnActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function createTryOnProject(
  input: CreateTryOnProjectInput
): Promise<TryOnActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in" },
      };
    }

    const validation = createTryOnProjectSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid input data" },
      };
    }

    // Verify the body photo belongs to the user
    const bodyPhoto = await prisma.userUpload.findFirst({
      where: { id: input.bodyPhotoId, userId },
    });

    if (!bodyPhoto) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Body photo not found" },
      };
    }

    const project = await prisma.tryOnProject.create({
      data: {
        userId,
        name: input.name || `Project ${new Date().toLocaleDateString()}`,
        description: input.description,
        bodyPhotoId: input.bodyPhotoId,
        bodyPhotoUrl: input.bodyPhotoUrl,
        tattooImageUrl: input.tattooImageUrl,
        tattooSource: input.tattooSource,
        positionX: input.transform.positionX,
        positionY: input.transform.positionY,
        scale: input.transform.scale,
        rotation: input.transform.rotation,
        opacity: input.transform.opacity,
        blendMode: input.transform.blendMode,
        flipX: input.transform.flipX,
        flipY: input.transform.flipY,
        status: "DRAFT",
      },
    });

    revalidatePath("/dashboard/try-on");

    return {
      success: true,
      data: { id: project.id },
    };
  } catch (error) {
    console.error("Create try-on project error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to create project" },
    };
  }
}

export async function updateTryOnProject(
  input: UpdateTryOnProjectInput
): Promise<TryOnActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in" },
      };
    }

    const validation = updateTryOnProjectSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid input data" },
      };
    }

    // Verify ownership
    const existing = await prisma.tryOnProject.findFirst({
      where: { id: input.id, userId },
    });

    if (!existing) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Project not found" },
      };
    }

    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.resultUrl !== undefined) updateData.resultUrl = input.resultUrl;
    if (input.status !== undefined) updateData.status = input.status;

    if (input.transform) {
      updateData.positionX = input.transform.positionX;
      updateData.positionY = input.transform.positionY;
      updateData.scale = input.transform.scale;
      updateData.rotation = input.transform.rotation;
      updateData.opacity = input.transform.opacity;
      updateData.blendMode = input.transform.blendMode;
      updateData.flipX = input.transform.flipX;
      updateData.flipY = input.transform.flipY;
    }

    await prisma.tryOnProject.update({
      where: { id: input.id },
      data: updateData,
    });

    revalidatePath("/dashboard/try-on");

    return { success: true };
  } catch (error) {
    console.error("Update try-on project error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to update project" },
    };
  }
}

export async function deleteTryOnProject(
  projectId: string
): Promise<TryOnActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in" },
      };
    }

    // Verify ownership
    const existing = await prisma.tryOnProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!existing) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Project not found" },
      };
    }

    await prisma.tryOnProject.delete({
      where: { id: projectId },
    });

    revalidatePath("/dashboard/try-on");

    return { success: true };
  } catch (error) {
    console.error("Delete try-on project error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to delete project" },
    };
  }
}

export async function getTryOnProjects(): Promise<
  TryOnActionResult<
    {
      id: string;
      name: string;
      description: string | null;
      bodyPhotoUrl: string;
      tattooImageUrl: string;
      resultUrl: string | null;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in" },
      };
    }

    const projects = await prisma.tryOnProject.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        bodyPhotoUrl: true,
        tattooImageUrl: true,
        resultUrl: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { success: true, data: projects };
  } catch (error) {
    console.error("Get try-on projects error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch projects" },
    };
  }
}

export async function getTryOnProject(
  projectId: string
): Promise<
  TryOnActionResult<{
    id: string;
    name: string;
    description: string | null;
    bodyPhotoUrl: string;
    tattooImageUrl: string;
    tattooSource: string;
    transform: {
      positionX: number;
      positionY: number;
      scale: number;
      rotation: number;
      opacity: number;
      blendMode: string;
      flipX: boolean;
      flipY: boolean;
    };
    resultUrl: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "You must be signed in" },
      };
    }

    const project = await prisma.tryOnProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Project not found" },
      };
    }

    return {
      success: true,
      data: {
        id: project.id,
        name: project.name,
        description: project.description,
        bodyPhotoUrl: project.bodyPhotoUrl,
        tattooImageUrl: project.tattooImageUrl,
        tattooSource: project.tattooSource,
        transform: {
          positionX: project.positionX,
          positionY: project.positionY,
          scale: project.scale,
          rotation: project.rotation,
          opacity: project.opacity,
          blendMode: project.blendMode,
          flipX: project.flipX,
          flipY: project.flipY,
        },
        resultUrl: project.resultUrl,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    };
  } catch (error) {
    console.error("Get try-on project error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch project" },
    };
  }
}
