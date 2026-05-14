import { PrismaClient } from "@prisma/client";

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