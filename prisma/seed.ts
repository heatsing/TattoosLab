import {
  AudienceType,
  BodyPlacement,
  PrismaClient,
  TattooCategory,
  TattooStyleName,
} from "@prisma/client";
import { tattoos as galleryTattoos } from "../src/lib/gallery/data";

const prisma = new PrismaClient();

const styles = [
  ["geometric", "Geometric"],
  ["watercolor", "Watercolor"],
  ["traditional", "Traditional"],
  ["neo_traditional", "Neo Traditional"],
  ["minimalist", "Minimalist"],
  ["japanese", "Japanese"],
  ["blackwork", "Blackwork"],
  ["dotwork", "Dotwork"],
  ["realistic", "Realistic"],
  ["tribal", "Tribal"],
  ["new_school", "New School"],
  ["line_art", "Line Art"],
  ["illustrative", "Illustrative"],
] as const;

const styleMap: Record<string, TattooStyleName> = {
  geometric: TattooStyleName.GEOMETRIC,
  watercolor: TattooStyleName.WATERCOLOR,
  minimalist: TattooStyleName.MINIMALIST,
  traditional: TattooStyleName.TRADITIONAL,
  japanese: TattooStyleName.JAPANESE,
  blackwork: TattooStyleName.BLACKWORK,
  "neo-traditional": TattooStyleName.NEO_TRADITIONAL,
  dotwork: TattooStyleName.DOTWORK,
  tribal: TattooStyleName.TRIBAL,
  realism: TattooStyleName.REALISM,
  abstract: TattooStyleName.ABSTRACT,
  lettering: TattooStyleName.LETTERING,
  fineline: TattooStyleName.FINELINE,
  illustrative: TattooStyleName.ILLUSTRATIVE,
};

const placementMap: Record<string, BodyPlacement> = {
  arm: BodyPlacement.ARM,
  "upper-arm": BodyPlacement.ARM,
  "full-sleeve": BodyPlacement.ARM,
  forearm: BodyPlacement.FOREARM,
  wrist: BodyPlacement.WRIST,
  hand: BodyPlacement.HAND,
  chest: BodyPlacement.CHEST,
  back: BodyPlacement.BACK,
  shoulder: BodyPlacement.SHOULDER,
  leg: BodyPlacement.LEG,
  thigh: BodyPlacement.THIGH,
  calf: BodyPlacement.CALF,
  ankle: BodyPlacement.ANKLE,
  foot: BodyPlacement.FOOT,
  neck: BodyPlacement.NECK,
  ribcage: BodyPlacement.RIBCAGE,
};

const categoryMap: Record<string, TattooCategory> = {
  animal: TattooCategory.ANIMAL,
  floral: TattooCategory.FLORAL,
  symbol: TattooCategory.SYMBOL,
  portrait: TattooCategory.PORTRAIT,
  nature: TattooCategory.NATURE,
  mythology: TattooCategory.MYTHOLOGY,
  religious: TattooCategory.RELIGIOUS,
  memorial: TattooCategory.MEMORIAL,
  quote: TattooCategory.QUOTE,
  abstract: TattooCategory.ABSTRACT,
  skull: TattooCategory.SKULL,
  butterfly: TattooCategory.BUTTERFLY,
  dragon: TattooCategory.DRAGON,
  wolf: TattooCategory.WOLF,
  lion: TattooCategory.LION,
  rose: TattooCategory.ROSE,
  cross: TattooCategory.CROSS,
  anchor: TattooCategory.ANCHOR,
  compass: TattooCategory.COMPASS,
  mandala: TattooCategory.MANDALA,
};

const audienceMap: Record<string, AudienceType> = {
  men: AudienceType.MEN,
  women: AudienceType.WOMEN,
  unisex: AudienceType.UNISEX,
};

function toSeoTitle(title: string) {
  return `${title} | AI Tattoo Design`;
}

function toSeoDescription(title: string, description?: string) {
  return (
    description ||
    `Explore ${title}, an AI-generated tattoo flash design ready to remix, generate, or try on.`
  );
}

async function main() {
  for (const [slug, name] of styles) {
    await prisma.tattooStyle.upsert({
      where: { slug },
      update: {
        name,
        isActive: true,
      },
      create: {
        slug,
        name,
        promptPrefix: name,
        isActive: true,
      },
    });
  }

  for (const tattoo of galleryTattoos) {
    await prisma.tattoo.upsert({
      where: { slug: tattoo.slug },
      update: {
        title: tattoo.title,
        description: tattoo.description,
        imageUrl: tattoo.imageUrl,
        thumbnailUrl: tattoo.thumbnailUrl ?? tattoo.imageUrl,
        style: styleMap[tattoo.style] ?? TattooStyleName.ILLUSTRATIVE,
        placement: tattoo.placement
          ? placementMap[tattoo.placement] ?? BodyPlacement.OTHER
          : null,
        category: categoryMap[tattoo.category] ?? TattooCategory.ABSTRACT,
        meanings: tattoo.meanings,
        audience: audienceMap[tattoo.audience] ?? AudienceType.UNISEX,
        tags: tattoo.tags,
        seoTitle: toSeoTitle(tattoo.title),
        seoDescription: toSeoDescription(tattoo.title, tattoo.description),
        viewCount: tattoo.viewCount,
        likeCount: tattoo.likeCount,
        isPublic: true,
        isFeatured: tattoo.isFeatured,
        artistName: tattoo.artistName,
        artistUrl: tattoo.artistUrl,
      },
      create: {
        title: tattoo.title,
        slug: tattoo.slug,
        description: tattoo.description,
        imageUrl: tattoo.imageUrl,
        thumbnailUrl: tattoo.thumbnailUrl ?? tattoo.imageUrl,
        style: styleMap[tattoo.style] ?? TattooStyleName.ILLUSTRATIVE,
        placement: tattoo.placement
          ? placementMap[tattoo.placement] ?? BodyPlacement.OTHER
          : null,
        category: categoryMap[tattoo.category] ?? TattooCategory.ABSTRACT,
        meanings: tattoo.meanings,
        audience: audienceMap[tattoo.audience] ?? AudienceType.UNISEX,
        tags: tattoo.tags,
        seoTitle: toSeoTitle(tattoo.title),
        seoDescription: toSeoDescription(tattoo.title, tattoo.description),
        viewCount: tattoo.viewCount,
        likeCount: tattoo.likeCount,
        isPublic: true,
        isFeatured: tattoo.isFeatured,
        artistName: tattoo.artistName,
        artistUrl: tattoo.artistUrl,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
