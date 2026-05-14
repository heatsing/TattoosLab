import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// Upload image to Cloudinary
export async function uploadImage(
  file: string,
  options: {
    folder?: string;
    publicId?: string;
    transformation?: any;
  } = {}
) {
  const { folder = "tattoos", publicId, transformation } = options;

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `tattoos-lab/${folder}`,
      public_id: publicId,
      resource_type: "image",
      transformation: transformation || [
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      size: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

// Delete image from Cloudinary
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
}

// Generate signed upload params for client-side upload
export function generateUploadSignature(params: Record<string, string>) {
  const timestamp = Math.round(new Date().getTime() / 1000).toString();
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, ...params },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  };
}

// Get optimized image URL
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  } = {}
) {
  const { width, height, crop = "fill", quality = "auto" } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: "auto",
    secure: true,
  });
}

export function getWatermarkedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    watermarkText?: string;
  } = {}
) {
  const {
    width = 1024,
    height = 1024,
    watermarkText = "Tattoos Lab Preview",
  } = options;

  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width,
        height,
        crop: "limit",
        quality: "auto:good",
        fetch_format: "auto",
      },
      {
        overlay: {
          font_family: "Arial",
          font_size: 34,
          font_weight: "bold",
          text: watermarkText,
        },
        color: "#ffffff",
        opacity: 65,
        gravity: "south_east",
        x: 28,
        y: 28,
      },
    ],
  });
}

export function getGenerationDeliveryUrl(
  publicId: string,
  options: {
    watermark: boolean;
    hd: boolean;
  }
) {
  if (options.watermark) {
    return getWatermarkedUrl(publicId);
  }

  if (options.hd) {
    return getOptimizedUrl(publicId, {
      crop: "limit",
      quality: "auto:best",
    });
  }

  return getOptimizedUrl(publicId, {
    width: 1024,
    height: 1024,
    crop: "limit",
    quality: "auto:good",
  });
}