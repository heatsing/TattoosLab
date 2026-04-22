import { z } from "zod";

export const BlendModeEnum = z.enum([
  "NORMAL",
  "MULTIPLY",
  "SCREEN",
  "OVERLAY",
  "SOFT_LIGHT",
  "HARD_LIGHT",
  "DARKEN",
  "LIGHTEN",
]);

export const TattooSourceEnum = z.enum([
  "GENERATED",
  "UPLOADED",
  "GALLERY",
  "PRESET",
]);

export const TryOnStatusEnum = z.enum([
  "DRAFT",
  "SAVED",
  "EXPORTED",
  "SHARED",
]);

export const transformStateSchema = z.object({
  positionX: z.number().min(0).max(1).default(0.5),
  positionY: z.number().min(0).max(1).default(0.5),
  scale: z.number().min(0.1).max(5).default(1),
  rotation: z.number().min(-180).max(180).default(0),
  opacity: z.number().min(0).max(1).default(0.85),
  blendMode: BlendModeEnum.default("MULTIPLY"),
  flipX: z.boolean().default(false),
  flipY: z.boolean().default(false),
});

export const createTryOnProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  bodyPhotoId: z.string(),
  bodyPhotoUrl: z.string().url(),
  tattooImageUrl: z.string().url(),
  tattooSource: TattooSourceEnum.default("GENERATED"),
  transform: transformStateSchema,
});

export const updateTryOnProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  transform: transformStateSchema.optional(),
  resultUrl: z.string().url().optional(),
  status: TryOnStatusEnum.optional(),
});

export const exportTryOnProjectSchema = z.object({
  projectId: z.string(),
  imageData: z.string(), // Base64 image data
});

export type BlendMode = z.infer<typeof BlendModeEnum>;
export type TattooSource = z.infer<typeof TattooSourceEnum>;
export type TryOnStatus = z.infer<typeof TryOnStatusEnum>;
export type TransformState = z.infer<typeof transformStateSchema>;
export type CreateTryOnProjectInput = z.infer<typeof createTryOnProjectSchema>;
export type UpdateTryOnProjectInput = z.infer<typeof updateTryOnProjectSchema>;

export const blendModeLabels: Record<BlendMode, string> = {
  NORMAL: "Normal",
  MULTIPLY: "Multiply",
  SCREEN: "Screen",
  OVERLAY: "Overlay",
  SOFT_LIGHT: "Soft Light",
  HARD_LIGHT: "Hard Light",
  DARKEN: "Darken",
  LIGHTEN: "Lighten",
};

export const blendModeDescriptions: Record<BlendMode, string> = {
  NORMAL: "Standard blending",
  MULTIPLY: "Darkens the image, good for realistic tattoos",
  SCREEN: "Lightens the image",
  OVERLAY: "Combines multiply and screen",
  SOFT_LIGHT: "Gentle lighting effect",
  HARD_LIGHT: "Strong lighting effect",
  DARKEN: "Keeps darker pixels",
  LIGHTEN: "Keeps lighter pixels",
};
