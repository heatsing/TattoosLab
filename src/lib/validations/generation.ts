import { z } from "zod";

export const TattooStyleEnum = z.enum([
  "geometric",
  "watercolor",
  "traditional",
  "neo_traditional",
  "minimalist",
  "japanese",
  "blackwork",
  "dotwork",
  "realistic",
  "tribal",
  "new_school",
  "line_art",
  "illustrative",
]);

export const BodyPlacementEnum = z.enum([
  "arm",
  "forearm",
  "wrist",
  "shoulder",
  "chest",
  "back",
  "leg",
  "thigh",
  "calf",
  "ankle",
  "neck",
  "ribcage",
  "hand",
  "foot",
]);

export const ColorModeEnum = z.enum([
  "black_and_grey",
  "full_color",
  "single_color",
]);

export const AspectRatioEnum = z.enum([
  "1:1",
  "4:5",
  "9:16",
  "16:9",
]);

export const generateTattooSchema = z.object({
  prompt: z
    .string()
    .min(3, "Prompt must be at least 3 characters")
    .max(500, "Prompt must be less than 500 characters")
    .trim(),
  style: TattooStyleEnum,
  bodyPlacement: BodyPlacementEnum.optional(),
  colorMode: ColorModeEnum.default("black_and_grey"),
  aspectRatio: AspectRatioEnum.default("1:1"),
  referenceImageUrl: z.string().url().optional().or(z.literal("")),
  negativePrompt: z
    .string()
    .max(200, "Negative prompt must be less than 200 characters")
    .optional(),
});

export type GenerateTattooInput = z.infer<typeof generateTattooSchema>;
export type TattooStyle = z.infer<typeof TattooStyleEnum>;
export type BodyPlacement = z.infer<typeof BodyPlacementEnum>;
export type ColorMode = z.infer<typeof ColorModeEnum>;
export type AspectRatio = z.infer<typeof AspectRatioEnum>;

export const styleLabels: Record<TattooStyle, string> = {
  geometric: "Geometric",
  watercolor: "Watercolor",
  traditional: "Traditional",
  neo_traditional: "Neo-Traditional",
  minimalist: "Minimalist",
  japanese: "Japanese",
  blackwork: "Blackwork",
  dotwork: "Dotwork",
  realistic: "Realistic",
  tribal: "Tribal",
  new_school: "New School",
  line_art: "Line Art",
  illustrative: "Illustrative",
};

export const bodyPlacementLabels: Record<BodyPlacement, string> = {
  arm: "Arm",
  forearm: "Forearm",
  wrist: "Wrist",
  shoulder: "Shoulder",
  chest: "Chest",
  back: "Back",
  leg: "Leg",
  thigh: "Thigh",
  calf: "Calf",
  ankle: "Ankle",
  neck: "Neck",
  ribcage: "Ribcage",
  hand: "Hand",
  foot: "Foot",
};

export const colorModeLabels: Record<ColorMode, string> = {
  black_and_grey: "Black & Grey",
  full_color: "Full Color",
  single_color: "Single Color",
};

export const aspectRatioLabels: Record<AspectRatio, string> = {
  "1:1": "Square (1:1)",
  "4:5": "Portrait (4:5)",
  "9:16": "Tall (9:16)",
  "16:9": "Wide (16:9)",
};
