import { Tattoo, FilterConfig, FilterType, GalleryFilter } from "./types";
import { communityGalleryArtworks } from "./community-gallery";

const tattooSeeds: Tattoo[] = [
  // Geometric
  {
    id: "1", title: "Sacred Geometry Mandala", slug: "sacred-geometry-mandala",
    description: "Intricate sacred geometry mandala representing unity and cosmic order.",
    imageUrl: "https://images.unsplash.com/photo-1614179688766-3d197a6996c4?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1614179688766-3d197a6996c4?w=300&h=400&fit=crop&q=80",
    style: "geometric", placement: "forearm", category: "mandala",
    meanings: ["unity", "balance", "spirituality"], audience: "unisex",
    tags: ["geometric", "mandala", "sacred", "forearm", "spiritual"],
    artistName: "Alex Chen", viewCount: 3420, likeCount: 289, isFeatured: true,
    createdAt: "2024-11-15T10:00:00Z",
  },
  {
    id: "2", title: "Hexagonal Crystal Formation", slug: "hexagonal-crystal",
    description: "Crystalline hexagonal pattern with aurora color accents.",
    imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&h=400&fit=crop&q=80",
    style: "geometric", placement: "ribcage", category: "abstract",
    meanings: ["strength", "clarity"], audience: "unisex",
    tags: ["geometric", "crystal", "abstract", "ribcage"],
    artistName: "Ryan Park", viewCount: 2156, likeCount: 178, isFeatured: false,
    createdAt: "2024-12-01T10:00:00Z",
  },
  // Watercolor
  {
    id: "3", title: "Watercolor Koi Fish", slug: "watercolor-koi-fish",
    description: "Flowing watercolor koi fish swimming through cherry blossoms.",
    imageUrl: "https://images.unsplash.com/photo-1551913902-c92207136625?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1551913902-c92207136625?w=300&h=400&fit=crop&q=80",
    style: "watercolor", placement: "thigh", category: "animal",
    meanings: ["perseverance", "luck", "transformation"], audience: "unisex",
    tags: ["watercolor", "koi", "fish", "japanese", "thigh", "animal"],
    artistName: "Mia Torres", viewCount: 5620, likeCount: 445, isFeatured: true,
    createdAt: "2024-10-20T10:00:00Z",
  },
  {
    id: "4", title: "Abstract Watercolor Waves", slug: "watercolor-waves",
    description: "Soft flowing watercolor ocean waves with coral details.",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=400&fit=crop&q=80",
    style: "watercolor", placement: "shoulder", category: "nature",
    meanings: ["freedom", "flow", "peace"], audience: "women",
    tags: ["watercolor", "ocean", "waves", "nature", "shoulder"],
    artistName: "Emma Blake", viewCount: 3890, likeCount: 312, isFeatured: false,
    createdAt: "2024-11-05T10:00:00Z",
  },
  // Minimalist
  {
    id: "5", title: "Single Line Portrait", slug: "single-line-portrait",
    description: "Continuous single line drawing of a female silhouette.",
    imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=400&fit=crop&q=80",
    style: "minimalist", placement: "wrist", category: "portrait",
    meanings: ["elegance", "simplicity"], audience: "women",
    tags: ["minimalist", "line", "portrait", "wrist", "simple"],
    artistName: "Jonas Weber", viewCount: 6780, likeCount: 567, isFeatured: true,
    createdAt: "2024-09-10T10:00:00Z",
  },
  {
    id: "6", title: "Tiny Constellation Map", slug: "constellation-map",
    description: "Minimalist constellation with connected stars.",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=400&fit=crop&q=80",
    style: "minimalist", placement: "wrist", category: "nature",
    meanings: ["destiny", "guidance"], audience: "unisex",
    tags: ["minimalist", "stars", "constellation", "wrist", "space"],
    artistName: "Nina Patel", viewCount: 4230, likeCount: 389, isFeatured: false,
    createdAt: "2024-12-20T10:00:00Z",
  },
  // Traditional
  {
    id: "7", title: "Classic Anchor with Rose", slug: "anchor-rose",
    description: "Traditional nautical anchor wrapped in rope with rose banner.",
    imageUrl: "https://images.unsplash.com/photo-1590246814801-867517deb529?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1590246814801-867517deb529?w=300&h=400&fit=crop&q=80",
    style: "traditional", placement: "chest", category: "anchor",
    meanings: ["stability", "hope", "love"], audience: "men",
    tags: ["traditional", "anchor", "rose", "nautical", "chest"],
    artistName: "Sarah Kim", viewCount: 2890, likeCount: 198, isFeatured: false,
    createdAt: "2024-08-15T10:00:00Z",
  },
  {
    id: "8", title: "Old School Eagle", slug: "old-school-eagle",
    description: "Bold traditional eagle with banner and roses.",
    imageUrl: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=300&h=400&fit=crop&q=80",
    style: "traditional", placement: "upper-arm", category: "animal",
    meanings: ["freedom", "power", "patriotism"], audience: "men",
    tags: ["traditional", "eagle", "animal", "upper-arm", "bold"],
    artistName: "Derek Stone", viewCount: 3340, likeCount: 276, isFeatured: true,
    createdAt: "2024-07-22T10:00:00Z",
  },
  // Japanese
  {
    id: "9", title: "Japanese Dragon Sleeve", slug: "japanese-dragon",
    description: "Fierce Japanese dragon with clouds and waves.",
    imageUrl: "https://images.unsplash.com/photo-1551913902-c92207136625?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1551913902-c92207136625?w=300&h=400&fit=crop&q=80",
    style: "japanese", placement: "full-sleeve", category: "dragon",
    meanings: ["power", "wisdom", "protection"], audience: "men",
    tags: ["japanese", "dragon", "sleeve", "mythology", "irezumi"],
    artistName: "Kenji Sato", viewCount: 7890, likeCount: 634, isFeatured: true,
    createdAt: "2024-06-10T10:00:00Z",
  },
  {
    id: "10", title: "Cherry Blossom Branch", slug: "cherry-blossom",
    description: "Delicate Japanese cherry blossoms on a branch.",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=400&fit=crop&q=80",
    style: "japanese", placement: "shoulder", category: "floral",
    meanings: ["beauty", "transience", "renewal"], audience: "women",
    tags: ["japanese", "cherry", "blossom", "floral", "shoulder", "feminine"],
    artistName: "Yuki Tanaka", viewCount: 5670, likeCount: 498, isFeatured: false,
    createdAt: "2024-10-05T10:00:00Z",
  },
  // Blackwork
  {
    id: "11", title: "Dotwork Mountain Landscape", slug: "dotwork-mountains",
    description: "Stippled mountain scene with geometric sun.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop&q=80",
    style: "blackwork", placement: "calf", category: "nature",
    meanings: ["adventure", "stability"], audience: "unisex",
    tags: ["blackwork", "dotwork", "mountain", "nature", "calf"],
    artistName: "Luna Reyes", viewCount: 3120, likeCount: 245, isFeatured: false,
    createdAt: "2024-11-18T10:00:00Z",
  },
  {
    id: "12", title: "Sacred Dot Mandala", slug: "dot-mandala",
    description: "Intricate dotwork mandala with sacred patterns.",
    imageUrl: "https://images.unsplash.com/photo-1614179688766-3d197a6996c4?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1614179688766-3d197a6996c4?w=300&h=400&fit=crop&q=80",
    style: "blackwork", placement: "back", category: "mandala",
    meanings: ["spirituality", "balance"], audience: "unisex",
    tags: ["blackwork", "dotwork", "mandala", "spiritual", "back"],
    artistName: "Alex Chen", viewCount: 4560, likeCount: 378, isFeatured: true,
    createdAt: "2024-09-25T10:00:00Z",
  },
  // Neo-Traditional
  {
    id: "13", title: "Neo-Traditional Owl", slug: "neo-owl",
    description: "Owl with moon phases and celestial flowers.",
    imageUrl: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=300&h=400&fit=crop&q=80",
    style: "neo-traditional", placement: "upper-arm", category: "animal",
    meanings: ["wisdom", "mystery", "intuition"], audience: "unisex",
    tags: ["neo-traditional", "owl", "animal", "moon", "upper-arm"],
    artistName: "Derek Stone", viewCount: 5230, likeCount: 421, isFeatured: true,
    createdAt: "2024-12-12T10:00:00Z",
  },
  {
    id: "14", title: "Vibrant Neo Rose", slug: "neo-rose",
    description: "Bold neo-traditional rose with jewel tones.",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=400&fit=crop&q=80",
    style: "neo-traditional", placement: "forearm", category: "rose",
    meanings: ["love", "passion", "beauty"], audience: "women",
    tags: ["neo-traditional", "rose", "floral", "colorful", "forearm"],
    artistName: "Mia Torres", viewCount: 3890, likeCount: 334, isFeatured: false,
    createdAt: "2024-08-30T10:00:00Z",
  },
  // Realism
  {
    id: "15", title: "Realistic Lion Portrait", slug: "realistic-lion",
    description: "Hyper-realistic lion portrait with dramatic lighting.",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=300&h=400&fit=crop&q=80",
    style: "realism", placement: "chest", category: "lion",
    meanings: ["courage", "leadership", "family"], audience: "men",
    tags: ["realism", "lion", "animal", "portrait", "chest", "detailed"],
    artistName: "Maria Lopez", viewCount: 8900, likeCount: 712, isFeatured: true,
    createdAt: "2024-11-28T10:00:00Z",
  },
  {
    id: "16", title: "Realistic Wolf Howling", slug: "realistic-wolf",
    description: "Photorealistic wolf howling at the moon.",
    imageUrl: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=300&h=400&fit=crop&q=80",
    style: "realism", placement: "shoulder", category: "wolf",
    meanings: ["loyalty", "instinct", "freedom"], audience: "men",
    tags: ["realism", "wolf", "animal", "moon", "shoulder"],
    artistName: "Marcus Reed", viewCount: 6340, likeCount: 523, isFeatured: false,
    createdAt: "2024-10-15T10:00:00Z",
  },
  // Floral
  {
    id: "17", title: "Peony Flower Sleeve", slug: "peony-sleeve",
    description: "Soft peony flowers with leaves and vines.",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=400&fit=crop&q=80",
    style: "watercolor", placement: "full-sleeve", category: "floral",
    meanings: ["prosperity", "honor", "romance"], audience: "women",
    tags: ["watercolor", "peony", "floral", "sleeve", "feminine"],
    artistName: "Yuki Tanaka", viewCount: 7120, likeCount: 601, isFeatured: true,
    createdAt: "2024-09-05T10:00:00Z",
  },
  {
    id: "18", title: "Delicate Lotus", slug: "delicate-lotus",
    description: "Minimalist lotus flower emerging from water.",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&h=400&fit=crop&q=80",
    style: "fineline", placement: "ankle", category: "floral",
    meanings: ["purity", "enlightenment", "rebirth"], audience: "women",
    tags: ["fineline", "lotus", "floral", "ankle", "delicate"],
    artistName: "Emma Blake", viewCount: 4560, likeCount: 398, isFeatured: false,
    createdAt: "2024-12-25T10:00:00Z",
  },
  // Skull
  {
    id: "19", title: "Sugar Skull", slug: "sugar-skull",
    description: "Colorful Day of the Dead sugar skull with flowers.",
    imageUrl: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=300&h=400&fit=crop&q=80",
    style: "illustrative", placement: "thigh", category: "skull",
    meanings: ["death", "celebration", "life"], audience: "unisex",
    tags: ["illustrative", "skull", "sugar", "colorful", "thigh"],
    artistName: "Luna Reyes", viewCount: 5340, likeCount: 445, isFeatured: false,
    createdAt: "2024-07-15T10:00:00Z",
  },
  {
    id: "20", title: "Geometric Skull", slug: "geometric-skull",
    description: "Low-poly geometric skull with clean lines.",
    imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=400&fit=crop&q=80",
    style: "geometric", placement: "forearm", category: "skull",
    meanings: ["mortality", "transformation"], audience: "men",
    tags: ["geometric", "skull", "polygon", "forearm", "modern"],
    artistName: "Ryan Park", viewCount: 3780, likeCount: 312, isFeatured: false,
    createdAt: "2024-11-10T10:00:00Z",
  },
  // Butterfly
  {
    id: "21", title: "Monarch Butterfly", slug: "monarch-butterfly",
    description: "Realistic monarch butterfly with watercolor splash.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop&q=80",
    style: "watercolor", placement: "shoulder", category: "butterfly",
    meanings: ["transformation", "freedom", "beauty"], audience: "women",
    tags: ["watercolor", "butterfly", "monarch", "shoulder", "colorful"],
    artistName: "Mia Torres", viewCount: 8230, likeCount: 678, isFeatured: true,
    createdAt: "2024-08-05T10:00:00Z",
  },
  {
    id: "22", title: "Minimalist Butterfly", slug: "minimalist-butterfly",
    description: "Single line butterfly silhouette.",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=400&fit=crop&q=80",
    style: "minimalist", placement: "wrist", category: "butterfly",
    meanings: ["change", "grace"], audience: "women",
    tags: ["minimalist", "butterfly", "line", "wrist", "simple"],
    artistName: "Nina Patel", viewCount: 5670, likeCount: 489, isFeatured: false,
    createdAt: "2024-10-22T10:00:00Z",
  },
  // Cross
  {
    id: "23", title: "Celtic Cross", slug: "celtic-cross",
    description: "Ornate Celtic cross with knotwork patterns.",
    imageUrl: "https://images.unsplash.com/photo-1614179688766-3d197a6996c4?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1614179688766-3d197a6996c4?w=300&h=400&fit=crop&q=80",
    style: "blackwork", placement: "upper-arm", category: "cross",
    meanings: ["faith", "heritage", "eternity"], audience: "men",
    tags: ["blackwork", "cross", "celtic", "religious", "upper-arm"],
    artistName: "Jonas Weber", viewCount: 4120, likeCount: 334, isFeatured: false,
    createdAt: "2024-09-18T10:00:00Z",
  },
  {
    id: "24", title: "Rose Cross", slug: "rose-cross",
    description: "Cross intertwined with blooming roses.",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=400&fit=crop&q=80",
    style: "neo-traditional", placement: "chest", category: "cross",
    meanings: ["faith", "sacrifice", "love"], audience: "unisex",
    tags: ["neo-traditional", "cross", "rose", "religious", "chest"],
    artistName: "Sarah Kim", viewCount: 3450, likeCount: 278, isFeatured: false,
    createdAt: "2024-12-08T10:00:00Z",
  },
  // Compass
  {
    id: "25", title: "Vintage Compass", slug: "vintage-compass",
    description: "Antique compass with world map and coordinates.",
    imageUrl: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=300&h=400&fit=crop&q=80",
    style: "traditional", placement: "forearm", category: "compass",
    meanings: ["direction", "adventure", "home"], audience: "men",
    tags: ["traditional", "compass", "map", "travel", "forearm"],
    artistName: "Derek Stone", viewCount: 4890, likeCount: 401, isFeatured: true,
    createdAt: "2024-07-30T10:00:00Z",
  },
  {
    id: "26", title: "Geometric Compass", slug: "geometric-compass",
    description: "Modern geometric compass with clean lines.",
    imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=400&fit=crop&q=80",
    style: "geometric", placement: "wrist", category: "compass",
    meanings: ["guidance", "purpose"], audience: "unisex",
    tags: ["geometric", "compass", "minimal", "wrist"],
    artistName: "Ryan Park", viewCount: 3120, likeCount: 267, isFeatured: false,
    createdAt: "2024-11-02T10:00:00Z",
  },
  // Wolf
  {
    id: "27", title: "Tribal Wolf", slug: "tribal-wolf",
    description: "Polynesian tribal wolf pattern.",
    imageUrl: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=300&h=400&fit=crop&q=80",
    style: "tribal", placement: "shoulder", category: "wolf",
    meanings: ["strength", "pack", "instinct"], audience: "men",
    tags: ["tribal", "wolf", "polynesian", "shoulder", "bold"],
    artistName: "Kai Mahalo", viewCount: 5670, likeCount: 456, isFeatured: false,
    createdAt: "2024-08-18T10:00:00Z",
  },
  {
    id: "28", title: "Watercolor Wolf", slug: "watercolor-wolf",
    description: "Wolf portrait with watercolor splash background.",
    imageUrl: "https://images.unsplash.com/photo-1551913902-c92207136625?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1551913902-c92207136625?w=300&h=400&fit=crop&q=80",
    style: "watercolor", placement: "thigh", category: "wolf",
    meanings: ["loyalty", "wildness"], audience: "unisex",
    tags: ["watercolor", "wolf", "animal", "thigh", "artistic"],
    artistName: "Mia Torres", viewCount: 6450, likeCount: 534, isFeatured: true,
    createdAt: "2024-10-01T10:00:00Z",
  },
  // Dragon
  {
    id: "29", title: "Chinese Dragon Back Piece", slug: "chinese-dragon",
    description: "Majestic Chinese dragon winding across the back.",
    imageUrl: "https://images.unsplash.com/photo-1614179688766-3d197a6996c4?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1614179688766-3d197a6996c4?w=300&h=400&fit=crop&q=80",
    style: "japanese", placement: "back", category: "dragon",
    meanings: ["power", "luck", "strength"], audience: "men",
    tags: ["japanese", "dragon", "back", "mythology", "large"],
    artistName: "Kenji Sato", viewCount: 9230, likeCount: 789, isFeatured: true,
    createdAt: "2024-06-25T10:00:00Z",
  },
  {
    id: "30", title: "Small Dragon Wrist", slug: "small-dragon-wrist",
    description: "Small minimalist dragon for the wrist.",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=800&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=400&fit=crop&q=80",
    style: "minimalist", placement: "wrist", category: "dragon",
    meanings: ["protection", "wisdom"], audience: "unisex",
    tags: ["minimalist", "dragon", "small", "wrist", "simple"],
    artistName: "Nina Patel", viewCount: 4120, likeCount: 356, isFeatured: false,
    createdAt: "2024-12-15T10:00:00Z",
  },
];

const tattooArtworkBySlug: Record<string, string> = {
  "sacred-geometry-mandala": communityGalleryArtworks.geometricMandala,
  "hexagonal-crystal": communityGalleryArtworks.crystalGeometry,
  "watercolor-koi-fish": communityGalleryArtworks.koiCherry,
  "watercolor-waves": communityGalleryArtworks.watercolorWave,
  "single-line-portrait": communityGalleryArtworks.linePortrait,
  "constellation-map": communityGalleryArtworks.constellationMap,
  "anchor-rose": communityGalleryArtworks.anchorRose,
  "old-school-eagle": communityGalleryArtworks.oldSchoolEagle,
  "japanese-dragon": communityGalleryArtworks.japaneseDragon,
  "cherry-blossom": communityGalleryArtworks.cherryBlossomBranch,
  "dotwork-mountains": communityGalleryArtworks.dotworkMountain,
  "dot-mandala": communityGalleryArtworks.blackworkMandala,
  "neo-owl": communityGalleryArtworks.owlCelestial,
  "neo-rose": communityGalleryArtworks.neoRose,
  "realistic-lion": communityGalleryArtworks.lionPortrait,
  "realistic-wolf": communityGalleryArtworks.wolfMoon,
  "peony-sleeve": communityGalleryArtworks.peonySleeve,
  "delicate-lotus": communityGalleryArtworks.lotusFineline,
  "sugar-skull": communityGalleryArtworks.sugarSkull,
  "geometric-skull": communityGalleryArtworks.geometricSkull,
  "monarch-butterfly": communityGalleryArtworks.butterflyMonarch,
  "minimalist-butterfly": communityGalleryArtworks.butterflyMonarch,
  "celtic-cross": communityGalleryArtworks.celticCross,
  "rose-cross": communityGalleryArtworks.celticCross,
  "vintage-compass": communityGalleryArtworks.compassRose,
  "geometric-compass": communityGalleryArtworks.compassRose,
  "tribal-wolf": communityGalleryArtworks.wolfMoon,
  "watercolor-wolf": communityGalleryArtworks.wolfMoon,
  "chinese-dragon": communityGalleryArtworks.japaneseDragon,
  "small-dragon-wrist": communityGalleryArtworks.smallDragon,
};

const expandedTattooSeeds: Tattoo[] = [
  {
    id: "31", title: "Blackout Rose Cover-Up", slug: "blackout-rose-coverup",
    description: "Dense blackwork rose built for covering older forearm tattoos.",
    imageUrl: communityGalleryArtworks.neoRose, style: "blackwork", placement: "forearm", category: "rose",
    meanings: ["transformation", "strength"], audience: "unisex",
    tags: ["coverup", "blackwork", "rose", "forearm", "bold"],
    artistName: "Luna Reyes", viewCount: 7420, likeCount: 612, isFeatured: true,
    createdAt: "2025-02-20T10:00:00Z",
  },
  {
    id: "32", title: "Black Panther Cover-Up", slug: "black-panther-coverup",
    description: "Heavy black panther silhouette composed for strong cover-up work.",
    imageUrl: communityGalleryArtworks.lionPortrait, style: "blackwork", placement: "upper-arm", category: "animal",
    meanings: ["power", "protection", "courage"], audience: "men",
    tags: ["coverup", "panther", "animal", "blackwork", "upper-arm"],
    artistName: "Derek Stone", viewCount: 6810, likeCount: 548, isFeatured: true,
    createdAt: "2025-02-21T10:00:00Z",
  },
  {
    id: "33", title: "Ornamental Blackout Sleeve", slug: "ornamental-blackout-sleeve",
    description: "Layered ornamental blackout pattern for sleeve renovation.",
    imageUrl: communityGalleryArtworks.blackworkMandala, style: "blackwork", placement: "full-sleeve", category: "abstract",
    meanings: ["renewal", "strength"], audience: "unisex",
    tags: ["coverup", "blackout", "ornamental", "sleeve", "abstract"],
    artistName: "Kai Mahalo", viewCount: 8120, likeCount: 702, isFeatured: true,
    createdAt: "2025-02-22T10:00:00Z",
  },
  {
    id: "34", title: "Fine Script Name Tattoo", slug: "fine-script-name-tattoo",
    description: "Elegant name lettering with small ornamental star details.",
    imageUrl: communityGalleryArtworks.constellationMap, style: "lettering", placement: "wrist", category: "quote",
    meanings: ["love", "family"], audience: "unisex",
    tags: ["lettering", "script", "name", "wrist", "minimal"],
    artistName: "Nina Patel", viewCount: 3920, likeCount: 324, isFeatured: false,
    createdAt: "2025-02-23T10:00:00Z",
  },
  {
    id: "35", title: "Gothic Spine Quote", slug: "gothic-spine-quote",
    description: "Tall blackletter quote layout intended for a spine placement.",
    imageUrl: communityGalleryArtworks.celticCross, style: "lettering", placement: "back", category: "quote",
    meanings: ["resilience", "faith"], audience: "unisex",
    tags: ["lettering", "gothic", "quote", "spine", "back"],
    artistName: "Jonas Weber", viewCount: 4860, likeCount: 401, isFeatured: false,
    createdAt: "2025-02-24T10:00:00Z",
  },
  {
    id: "36", title: "Roman Numeral Memorial", slug: "roman-numeral-memorial",
    description: "Minimal memorial date concept with roman numeral rhythm.",
    imageUrl: communityGalleryArtworks.compassRose, style: "lettering", placement: "forearm", category: "memorial",
    meanings: ["memory", "family", "love"], audience: "unisex",
    tags: ["lettering", "memorial", "roman-numerals", "date", "forearm"],
    artistName: "Sarah Kim", viewCount: 5310, likeCount: 459, isFeatured: true,
    createdAt: "2025-02-25T10:00:00Z",
  },
  {
    id: "37", title: "Abstract Smoke Cover-Up", slug: "abstract-smoke-coverup",
    description: "Soft abstract smoke and ink flow built to obscure older marks.",
    imageUrl: communityGalleryArtworks.watercolorWave, style: "abstract", placement: "shoulder", category: "abstract",
    meanings: ["freedom", "renewal"], audience: "unisex",
    tags: ["coverup", "abstract", "smoke", "shoulder", "flow"],
    artistName: "Emma Blake", viewCount: 6240, likeCount: 487, isFeatured: false,
    createdAt: "2025-02-26T10:00:00Z",
  },
  {
    id: "38", title: "Biomech Crystal Cover-Up", slug: "biomech-crystal-coverup",
    description: "Angular crystal geometry for a high-contrast shoulder cover-up.",
    imageUrl: communityGalleryArtworks.crystalGeometry, style: "abstract", placement: "shoulder", category: "abstract",
    meanings: ["clarity", "strength", "transformation"], audience: "unisex",
    tags: ["coverup", "abstract", "crystal", "geometric", "shoulder"],
    artistName: "Ryan Park", viewCount: 7020, likeCount: 538, isFeatured: true,
    createdAt: "2025-02-27T10:00:00Z",
  },
  {
    id: "39", title: "Sacred Eye Symbol", slug: "sacred-eye-symbol",
    description: "Geometric protective eye with circular sacred geometry marks.",
    imageUrl: communityGalleryArtworks.geometricMandala, style: "geometric", placement: "chest", category: "symbol",
    meanings: ["protection", "spirituality", "guidance"], audience: "unisex",
    tags: ["geometric", "eye", "symbol", "chest", "spiritual"],
    artistName: "Alex Chen", viewCount: 5980, likeCount: 512, isFeatured: true,
    createdAt: "2025-02-28T10:00:00Z",
  },
  {
    id: "40", title: "Moon Moth Sternum", slug: "moon-moth-sternum",
    description: "Illustrative moth-inspired butterfly with moon balance.",
    imageUrl: communityGalleryArtworks.butterflyMonarch, style: "illustrative", placement: "chest", category: "butterfly",
    meanings: ["transformation", "intuition"], audience: "women",
    tags: ["moth", "butterfly", "sternum", "moon", "illustrative"],
    artistName: "Mia Torres", viewCount: 7740, likeCount: 691, isFeatured: true,
    createdAt: "2025-03-01T10:00:00Z",
  },
  {
    id: "41", title: "Snake and Rose Flash", slug: "snake-rose-flash",
    description: "Traditional snake-and-rose flash concept with bold red accents.",
    imageUrl: communityGalleryArtworks.anchorRose, style: "traditional", placement: "forearm", category: "animal",
    meanings: ["transformation", "love", "power"], audience: "unisex",
    tags: ["snake", "rose", "traditional", "flash", "forearm"],
    artistName: "Sarah Kim", viewCount: 6620, likeCount: 556, isFeatured: true,
    createdAt: "2025-03-02T10:00:00Z",
  },
  {
    id: "42", title: "Raven Skull Blackwork", slug: "raven-skull-blackwork",
    description: "Dark raven-and-skull composition for upper arm placement.",
    imageUrl: communityGalleryArtworks.sugarSkull, style: "blackwork", placement: "upper-arm", category: "skull",
    meanings: ["mortality", "wisdom"], audience: "unisex",
    tags: ["raven", "skull", "blackwork", "upper-arm", "dark"],
    artistName: "Luna Reyes", viewCount: 5890, likeCount: 476, isFeatured: false,
    createdAt: "2025-03-03T10:00:00Z",
  },
  {
    id: "43", title: "Phoenix Back Piece", slug: "phoenix-back-piece",
    description: "Large phoenix back concept with Japanese flow and bold wings.",
    imageUrl: communityGalleryArtworks.japaneseDragon, style: "japanese", placement: "back", category: "mythology",
    meanings: ["rebirth", "strength", "freedom"], audience: "unisex",
    tags: ["phoenix", "mythology", "back", "japanese", "large"],
    artistName: "Kenji Sato", viewCount: 9120, likeCount: 784, isFeatured: true,
    createdAt: "2025-03-04T10:00:00Z",
  },
  {
    id: "44", title: "Lotus Mandala Thigh", slug: "lotus-mandala-thigh",
    description: "Dotwork lotus mandala with balanced thigh composition.",
    imageUrl: communityGalleryArtworks.lotusFineline, style: "dotwork", placement: "thigh", category: "mandala",
    meanings: ["balance", "spirituality", "purity"], audience: "women",
    tags: ["lotus", "mandala", "dotwork", "thigh", "spiritual"],
    artistName: "Emma Blake", viewCount: 6470, likeCount: 529, isFeatured: true,
    createdAt: "2025-03-05T10:00:00Z",
  },
  {
    id: "45", title: "Dagger Rose Traditional", slug: "dagger-rose-traditional",
    description: "Classic dagger and rose flash with a clean traditional silhouette.",
    imageUrl: communityGalleryArtworks.oldSchoolEagle, style: "traditional", placement: "forearm", category: "rose",
    meanings: ["love", "sacrifice", "strength"], audience: "unisex",
    tags: ["dagger", "rose", "traditional", "forearm", "flash"],
    artistName: "Derek Stone", viewCount: 5340, likeCount: 438, isFeatured: false,
    createdAt: "2025-03-06T10:00:00Z",
  },
  {
    id: "46", title: "Fine Line Moon Phases", slug: "fine-line-moon-phases",
    description: "Fine line moon phase chain for wrist or collarbone placement.",
    imageUrl: communityGalleryArtworks.owlCelestial, style: "fineline", placement: "wrist", category: "nature",
    meanings: ["cycles", "intuition", "guidance"], audience: "unisex",
    tags: ["fineline", "moon", "phases", "wrist", "celestial"],
    artistName: "Nina Patel", viewCount: 6030, likeCount: 522, isFeatured: true,
    createdAt: "2025-03-07T10:00:00Z",
  },
  {
    id: "47", title: "Sun Moon Matching Set", slug: "sun-moon-matching-set",
    description: "Minimal sun and moon pair for tiny matching tattoos.",
    imageUrl: communityGalleryArtworks.dotworkMountain, style: "minimalist", placement: "ankle", category: "symbol",
    meanings: ["balance", "love", "guidance"], audience: "unisex",
    tags: ["minimalist", "matching", "sun", "moon", "ankle"],
    artistName: "Nina Patel", viewCount: 7210, likeCount: 639, isFeatured: true,
    createdAt: "2025-03-08T10:00:00Z",
  },
  {
    id: "48", title: "Crowned Lion Chest", slug: "crowned-lion-chest",
    description: "Realism lion chest piece with crown-inspired geometry.",
    imageUrl: communityGalleryArtworks.lionPortrait, style: "realism", placement: "chest", category: "lion",
    meanings: ["courage", "leadership", "family"], audience: "men",
    tags: ["realism", "lion", "crown", "chest", "masculine"],
    artistName: "Maria Lopez", viewCount: 9600, likeCount: 812, isFeatured: true,
    createdAt: "2025-03-09T10:00:00Z",
  },
  {
    id: "49", title: "Tiger Lily Shoulder", slug: "tiger-lily-shoulder",
    description: "Illustrative tiger lily shoulder design with botanical motion.",
    imageUrl: communityGalleryArtworks.peonySleeve, style: "illustrative", placement: "shoulder", category: "floral",
    meanings: ["beauty", "growth", "strength"], audience: "women",
    tags: ["illustrative", "floral", "tiger-lily", "shoulder", "botanical"],
    artistName: "Yuki Tanaka", viewCount: 5580, likeCount: 463, isFeatured: false,
    createdAt: "2025-03-10T10:00:00Z",
  },
  {
    id: "50", title: "Koi Wave Sleeve", slug: "koi-wave-sleeve",
    description: "Japanese koi sleeve concept with strong wave direction.",
    imageUrl: communityGalleryArtworks.koiCherry, style: "japanese", placement: "full-sleeve", category: "animal",
    meanings: ["perseverance", "luck", "transformation"], audience: "unisex",
    tags: ["koi", "japanese", "sleeve", "waves", "animal"],
    artistName: "Kenji Sato", viewCount: 8840, likeCount: 751, isFeatured: true,
    createdAt: "2025-03-11T10:00:00Z",
  },
  {
    id: "51", title: "Dragon Chest Emblem", slug: "dragon-chest-emblem",
    description: "Symmetric dragon emblem scaled for chest placement.",
    imageUrl: communityGalleryArtworks.japaneseDragon, style: "japanese", placement: "chest", category: "dragon",
    meanings: ["power", "wisdom", "protection"], audience: "men",
    tags: ["dragon", "chest", "japanese", "emblem", "mythology"],
    artistName: "Kenji Sato", viewCount: 7960, likeCount: 682, isFeatured: true,
    createdAt: "2025-03-12T10:00:00Z",
  },
  {
    id: "52", title: "Wolf Compass Forearm", slug: "wolf-compass-forearm",
    description: "Wolf and compass design for directional forearm storytelling.",
    imageUrl: communityGalleryArtworks.wolfMoon, style: "geometric", placement: "forearm", category: "wolf",
    meanings: ["loyalty", "guidance", "freedom"], audience: "unisex",
    tags: ["wolf", "compass", "geometric", "forearm", "guidance"],
    artistName: "Ryan Park", viewCount: 6720, likeCount: 547, isFeatured: false,
    createdAt: "2025-03-13T10:00:00Z",
  },
  {
    id: "53", title: "Butterfly Cover-Up Shoulder", slug: "butterfly-coverup-shoulder",
    description: "Color butterfly cover-up idea with broad wing coverage.",
    imageUrl: communityGalleryArtworks.butterflyMonarch, style: "watercolor", placement: "shoulder", category: "butterfly",
    meanings: ["transformation", "beauty", "freedom"], audience: "women",
    tags: ["coverup", "butterfly", "watercolor", "shoulder", "color"],
    artistName: "Mia Torres", viewCount: 8460, likeCount: 735, isFeatured: true,
    createdAt: "2025-03-14T10:00:00Z",
  },
  {
    id: "54", title: "Celtic Knot Armband", slug: "celtic-knot-armband",
    description: "Blackwork armband with Celtic knot rhythm and negative space.",
    imageUrl: communityGalleryArtworks.celticCross, style: "blackwork", placement: "arm", category: "symbol",
    meanings: ["heritage", "eternity", "family"], audience: "unisex",
    tags: ["celtic", "armband", "blackwork", "symbol", "arm"],
    artistName: "Jonas Weber", viewCount: 5020, likeCount: 407, isFeatured: false,
    createdAt: "2025-03-15T10:00:00Z",
  },
  {
    id: "55", title: "Cross With Radiant Rays", slug: "cross-with-rays",
    description: "Traditional cross flash with radiating devotional lines.",
    imageUrl: communityGalleryArtworks.celticCross, style: "traditional", placement: "chest", category: "cross",
    meanings: ["faith", "hope", "protection"], audience: "unisex",
    tags: ["cross", "traditional", "religious", "chest", "faith"],
    artistName: "Sarah Kim", viewCount: 4760, likeCount: 384, isFeatured: false,
    createdAt: "2025-03-16T10:00:00Z",
  },
  {
    id: "56", title: "Anchor Compass Hybrid", slug: "anchor-compass-hybrid",
    description: "Traditional travel tattoo combining anchor stability and compass direction.",
    imageUrl: communityGalleryArtworks.compassRose, style: "traditional", placement: "forearm", category: "anchor",
    meanings: ["stability", "direction", "adventure"], audience: "men",
    tags: ["anchor", "compass", "traditional", "travel", "forearm"],
    artistName: "Derek Stone", viewCount: 5220, likeCount: 429, isFeatured: false,
    createdAt: "2025-03-17T10:00:00Z",
  },
  {
    id: "57", title: "Tribal Turtle Ocean", slug: "tribal-turtle-ocean",
    description: "Polynesian-inspired turtle and wave shoulder design.",
    imageUrl: communityGalleryArtworks.tribalWave, style: "tribal", placement: "shoulder", category: "animal",
    meanings: ["protection", "family", "journey"], audience: "unisex",
    tags: ["tribal", "turtle", "ocean", "shoulder", "polynesian"],
    artistName: "Kai Mahalo", viewCount: 6110, likeCount: 504, isFeatured: true,
    createdAt: "2025-03-18T10:00:00Z",
  },
  {
    id: "58", title: "Polynesian Sun Calf", slug: "polynesian-sun-calf",
    description: "Tribal sun and wave motif scaled for calf placement.",
    imageUrl: communityGalleryArtworks.tribalWave, style: "tribal", placement: "calf", category: "symbol",
    meanings: ["energy", "guidance", "strength"], audience: "unisex",
    tags: ["tribal", "sun", "calf", "wave", "symbol"],
    artistName: "Kai Mahalo", viewCount: 3890, likeCount: 319, isFeatured: false,
    createdAt: "2025-03-19T10:00:00Z",
  },
  {
    id: "59", title: "Realistic Owl Portrait", slug: "realistic-owl-portrait",
    description: "Realism owl portrait with moon phase detailing.",
    imageUrl: communityGalleryArtworks.owlCelestial, style: "realism", placement: "upper-arm", category: "animal",
    meanings: ["wisdom", "mystery", "intuition"], audience: "unisex",
    tags: ["realism", "owl", "moon", "upper-arm", "animal"],
    artistName: "Maria Lopez", viewCount: 6730, likeCount: 581, isFeatured: true,
    createdAt: "2025-03-20T10:00:00Z",
  },
  {
    id: "60", title: "Neo Panther Thigh", slug: "neo-panther-thigh",
    description: "Neo-traditional panther-inspired thigh flash with jewel accents.",
    imageUrl: communityGalleryArtworks.lionPortrait, style: "neo-traditional", placement: "thigh", category: "animal",
    meanings: ["power", "protection", "courage"], audience: "unisex",
    tags: ["neo-traditional", "panther", "thigh", "animal", "bold"],
    artistName: "Derek Stone", viewCount: 5890, likeCount: 496, isFeatured: false,
    createdAt: "2025-03-21T10:00:00Z",
  },
  {
    id: "61", title: "Skull Rose Cover-Up", slug: "skull-rose-coverup",
    description: "Illustrative skull and rose design with high cover-up density.",
    imageUrl: communityGalleryArtworks.sugarSkull, style: "illustrative", placement: "thigh", category: "skull",
    meanings: ["mortality", "love", "transformation"], audience: "unisex",
    tags: ["coverup", "skull", "rose", "illustrative", "thigh"],
    artistName: "Luna Reyes", viewCount: 6340, likeCount: 524, isFeatured: true,
    createdAt: "2025-03-22T10:00:00Z",
  },
  {
    id: "62", title: "Mandala Shoulder Cap", slug: "mandala-shoulder-cap",
    description: "Geometric mandala arranged for shoulder cap placement.",
    imageUrl: communityGalleryArtworks.geometricMandala, style: "geometric", placement: "shoulder", category: "mandala",
    meanings: ["balance", "spirituality", "unity"], audience: "unisex",
    tags: ["geometric", "mandala", "shoulder", "cap", "spiritual"],
    artistName: "Alex Chen", viewCount: 7520, likeCount: 628, isFeatured: true,
    createdAt: "2025-03-23T10:00:00Z",
  },
  {
    id: "63", title: "Peony Sternum Fine Line", slug: "peony-sternum-fineline",
    description: "Fine line peony composition for elegant sternum placement.",
    imageUrl: communityGalleryArtworks.peonySleeve, style: "fineline", placement: "chest", category: "floral",
    meanings: ["beauty", "growth", "romance"], audience: "women",
    tags: ["fineline", "peony", "sternum", "floral", "chest"],
    artistName: "Emma Blake", viewCount: 7110, likeCount: 609, isFeatured: true,
    createdAt: "2025-03-24T10:00:00Z",
  },
  {
    id: "64", title: "Watercolor Phoenix Back", slug: "watercolor-phoenix-back",
    description: "Watercolor phoenix concept for a broad back composition.",
    imageUrl: communityGalleryArtworks.watercolorWave, style: "watercolor", placement: "back", category: "mythology",
    meanings: ["rebirth", "freedom", "transformation"], audience: "unisex",
    tags: ["watercolor", "phoenix", "back", "mythology", "color"],
    artistName: "Mia Torres", viewCount: 8290, likeCount: 713, isFeatured: true,
    createdAt: "2025-03-25T10:00:00Z",
  },
  {
    id: "65", title: "Abstract Brush Dragon", slug: "abstract-brush-dragon",
    description: "Loose brushstroke dragon silhouette with abstract movement.",
    imageUrl: communityGalleryArtworks.smallDragon, style: "abstract", placement: "arm", category: "dragon",
    meanings: ["power", "wisdom", "freedom"], audience: "unisex",
    tags: ["abstract", "dragon", "brush", "arm", "motion"],
    artistName: "Ryan Park", viewCount: 5140, likeCount: 421, isFeatured: false,
    createdAt: "2025-03-26T10:00:00Z",
  },
  {
    id: "66", title: "Faith Script Cross", slug: "faith-script-cross",
    description: "Lettering and cross concept for a small faith tattoo.",
    imageUrl: communityGalleryArtworks.celticCross, style: "lettering", placement: "wrist", category: "religious",
    meanings: ["faith", "hope", "protection"], audience: "unisex",
    tags: ["lettering", "faith", "cross", "wrist", "religious"],
    artistName: "Sarah Kim", viewCount: 4430, likeCount: 367, isFeatured: false,
    createdAt: "2025-03-27T10:00:00Z",
  },
  {
    id: "67", title: "Memorial Angel Wing", slug: "memorial-angel-wing",
    description: "Fine line memorial wing with subtle date space.",
    imageUrl: communityGalleryArtworks.owlCelestial, style: "fineline", placement: "back", category: "memorial",
    meanings: ["memory", "family", "love"], audience: "unisex",
    tags: ["memorial", "angel-wing", "fineline", "back", "date"],
    artistName: "Nina Patel", viewCount: 5340, likeCount: 462, isFeatured: false,
    createdAt: "2025-03-28T10:00:00Z",
  },
  {
    id: "68", title: "Compass Coordinates", slug: "compass-coordinates",
    description: "Compass tattoo with room for meaningful coordinate lettering.",
    imageUrl: communityGalleryArtworks.compassRose, style: "lettering", placement: "forearm", category: "compass",
    meanings: ["guidance", "home", "adventure"], audience: "unisex",
    tags: ["compass", "coordinates", "lettering", "forearm", "travel"],
    artistName: "Derek Stone", viewCount: 4930, likeCount: 408, isFeatured: false,
    createdAt: "2025-03-29T10:00:00Z",
  },
  {
    id: "69", title: "Paw Constellation", slug: "paw-constellation",
    description: "Minimal pet memorial constellation with tiny paw symbolism.",
    imageUrl: communityGalleryArtworks.constellationMap, style: "minimalist", placement: "wrist", category: "animal",
    meanings: ["family", "memory", "love"], audience: "unisex",
    tags: ["minimalist", "paw", "pet", "constellation", "wrist"],
    artistName: "Nina Patel", viewCount: 6890, likeCount: 574, isFeatured: true,
    createdAt: "2025-03-30T10:00:00Z",
  },
  {
    id: "70", title: "Ornamental Neck Blackwork", slug: "ornamental-neck-blackwork",
    description: "High-contrast ornamental blackwork for neck placement.",
    imageUrl: communityGalleryArtworks.blackworkMandala, style: "blackwork", placement: "neck", category: "abstract",
    meanings: ["strength", "identity"], audience: "unisex",
    tags: ["blackwork", "neck", "ornamental", "abstract", "bold"],
    artistName: "Luna Reyes", viewCount: 5920, likeCount: 486, isFeatured: false,
    createdAt: "2025-03-31T10:00:00Z",
  },
  {
    id: "71", title: "Moon Rose Cover-Up", slug: "moon-rose-coverup",
    description: "Neo-traditional rose and moon design built for shoulder cover-ups.",
    imageUrl: communityGalleryArtworks.neoRose, style: "neo-traditional", placement: "shoulder", category: "rose",
    meanings: ["love", "transformation", "intuition"], audience: "women",
    tags: ["coverup", "rose", "moon", "neo-traditional", "shoulder"],
    artistName: "Mia Torres", viewCount: 7040, likeCount: 596, isFeatured: true,
    createdAt: "2025-04-01T10:00:00Z",
  },
  {
    id: "72", title: "Hannya Mask Thigh", slug: "hannya-mask-thigh",
    description: "Japanese hannya-inspired mask concept for thigh placement.",
    imageUrl: communityGalleryArtworks.sugarSkull, style: "japanese", placement: "thigh", category: "mythology",
    meanings: ["protection", "transformation", "power"], audience: "unisex",
    tags: ["japanese", "hannya", "mask", "thigh", "mythology"],
    artistName: "Kenji Sato", viewCount: 8560, likeCount: 733, isFeatured: true,
    createdAt: "2025-04-02T10:00:00Z",
  },
];

const allTattooSeeds = [...tattooSeeds, ...expandedTattooSeeds];

export const tattoos: Tattoo[] = allTattooSeeds.map((tattoo) => {
  const imageUrl = tattooArtworkBySlug[tattoo.slug] ?? tattoo.imageUrl;

  return {
    ...tattoo,
    imageUrl,
    thumbnailUrl: imageUrl,
  };
});

// ============ Filter Configurations ============

export const filterConfigs: FilterConfig[] = [
  {
    type: "style",
    label: "Style",
    options: [
      { value: "geometric", label: "Geometric", count: 4 },
      { value: "watercolor", label: "Watercolor", count: 5 },
      { value: "minimalist", label: "Minimalist", count: 4 },
      { value: "traditional", label: "Traditional", count: 3 },
      { value: "japanese", label: "Japanese", count: 3 },
      { value: "blackwork", label: "Blackwork", count: 2 },
      { value: "neo-traditional", label: "Neo-Traditional", count: 2 },
      { value: "realism", label: "Realism", count: 2 },
      { value: "dotwork", label: "Dotwork", count: 1 },
      { value: "tribal", label: "Tribal", count: 1 },
      { value: "fineline", label: "Fineline", count: 1 },
      { value: "illustrative", label: "Illustrative", count: 1 },
      { value: "abstract", label: "Abstract", count: 1 },
      { value: "lettering", label: "Lettering", count: 1 },
    ],
  },
  {
    type: "placement",
    label: "Placement",
    options: [
      { value: "forearm", label: "Forearm", count: 5 },
      { value: "wrist", label: "Wrist", count: 6 },
      { value: "shoulder", label: "Shoulder", count: 5 },
      { value: "thigh", label: "Thigh", count: 3 },
      { value: "chest", label: "Chest", count: 3 },
      { value: "back", label: "Back", count: 2 },
      { value: "upper-arm", label: "Upper Arm", count: 3 },
      { value: "full-sleeve", label: "Full Sleeve", count: 2 },
      { value: "calf", label: "Calf", count: 1 },
      { value: "ankle", label: "Ankle", count: 1 },
      { value: "ribcage", label: "Ribcage", count: 1 },
      { value: "arm", label: "Arm", count: 1 },
      { value: "neck", label: "Neck", count: 1 },
    ],
  },
  {
    type: "category",
    label: "Category",
    options: [
      { value: "animal", label: "Animal", count: 5 },
      { value: "floral", label: "Floral", count: 4 },
      { value: "mandala", label: "Mandala", count: 2 },
      { value: "nature", label: "Nature", count: 3 },
      { value: "abstract", label: "Abstract", count: 2 },
      { value: "portrait", label: "Portrait", count: 1 },
      { value: "skull", label: "Skull", count: 2 },
      { value: "butterfly", label: "Butterfly", count: 2 },
      { value: "cross", label: "Cross", count: 2 },
      { value: "compass", label: "Compass", count: 2 },
      { value: "wolf", label: "Wolf", count: 2 },
      { value: "dragon", label: "Dragon", count: 2 },
      { value: "lion", label: "Lion", count: 1 },
      { value: "rose", label: "Rose", count: 1 },
      { value: "anchor", label: "Anchor", count: 1 },
      { value: "symbol", label: "Symbol", count: 1 },
      { value: "quote", label: "Quote", count: 1 },
      { value: "memorial", label: "Memorial", count: 1 },
      { value: "religious", label: "Religious", count: 1 },
      { value: "mythology", label: "Mythology", count: 1 },
    ],
  },
  {
    type: "meaning",
    label: "Meaning",
    options: [
      { value: "strength", label: "Strength", count: 6 },
      { value: "freedom", label: "Freedom", count: 5 },
      { value: "love", label: "Love", count: 4 },
      { value: "spirituality", label: "Spirituality", count: 3 },
      { value: "wisdom", label: "Wisdom", count: 3 },
      { value: "transformation", label: "Transformation", count: 3 },
      { value: "protection", label: "Protection", count: 2 },
      { value: "courage", label: "Courage", count: 2 },
      { value: "loyalty", label: "Loyalty", count: 2 },
      { value: "beauty", label: "Beauty", count: 3 },
      { value: "balance", label: "Balance", count: 2 },
      { value: "family", label: "Family", count: 1 },
      { value: "guidance", label: "Guidance", count: 2 },
      { value: "renewal", label: "Renewal", count: 1 },
      { value: "memory", label: "Memory", count: 1 },
      { value: "faith", label: "Faith", count: 1 },
      { value: "hope", label: "Hope", count: 1 },
      { value: "rebirth", label: "Rebirth", count: 1 },
      { value: "intuition", label: "Intuition", count: 1 },
      { value: "identity", label: "Identity", count: 1 },
      { value: "adventure", label: "Adventure", count: 1 },
    ],
  },
  {
    type: "audience",
    label: "Audience",
    options: [
      { value: "men", label: "Men", count: 10 },
      { value: "women", label: "Women", count: 9 },
      { value: "unisex", label: "Unisex", count: 11 },
    ],
  },
];

for (const config of filterConfigs) {
  config.options = config.options.map((option) => ({
    ...option,
    count: getFilterOptionCount(config.type, option.value),
  }));
}

// ============ Helper Functions ============

function getFilterOptionCount(type: FilterType, value: string): number {
  return tattoos.filter((tattoo) => {
    if (type === "meaning") {
      return tattoo.meanings.includes(value);
    }

    return (tattoo as unknown as Record<string, string | undefined>)[type] === value;
  }).length;
}

export function getTattoosByFilters(filters: Record<string, string>): Tattoo[] {
  return tattoos.filter((tattoo) => {
    for (const [key, value] of Object.entries(filters)) {
      if (key === "meaning") {
        if (!tattoo.meanings.includes(value)) return false;
      } else if (key === "style" && tattoo.style !== value) {
        return false;
      } else if (key === "placement" && tattoo.placement !== value) {
        return false;
      } else if (key === "category" && tattoo.category !== value) {
        return false;
      } else if (key === "audience" && tattoo.audience !== value) {
        return false;
      }
    }
    return true;
  });
}

export function getFilterLabel(type: FilterType, slug: string): string {
  const config = filterConfigs.find((c) => c.type === type);
  return config?.options.find((o) => o.value === slug)?.label || slug;
}

export function getRelatedFilters(
  currentFilters: Record<string, string>,
  type: FilterType
): GalleryFilter[] {
  const baseTattoos = getTattoosByFilters(currentFilters);
  const config = filterConfigs.find((c) => c.type === type);
  if (!config) return [];

  return config.options
    .map((opt) => {
      const count = baseTattoos.filter((t) => {
        if (type === "meaning") return t.meanings.includes(opt.value);
        return (t as unknown as Record<string, unknown>)[type] === opt.value;
      }).length;
      return { type, slug: opt.value, label: opt.label, count };
    })
    .filter((f) => f.count > 0 && !currentFilters[type]);
}

export function generateSEOTitle(
  filters: Record<string, string>,
  count: number
): string {
  const parts: string[] = [];
  if (filters.style) parts.push(getFilterLabel("style", filters.style));
  if (filters.category) parts.push(getFilterLabel("category", filters.category));
  if (filters.placement) parts.push(getFilterLabel("placement", filters.placement));
  if (filters.meaning) parts.push(getFilterLabel("meaning", filters.meaning));
  if (filters.audience) parts.push(getFilterLabel("audience", filters.audience));

  if (parts.length === 0) return `Tattoo Ideas Gallery (${count}+ Designs)`;

  const prefix = parts.join(" ");
  return `${prefix} Tattoo Ideas (${count}+ Designs)`;
}

export function generateSEODescription(
  filters: Record<string, string>,
  count: number
): string {
  const parts: string[] = [];
  if (filters.style) parts.push(getFilterLabel("style", filters.style));
  if (filters.category) parts.push(getFilterLabel("category", filters.category));
  if (filters.placement) parts.push(getFilterLabel("placement", filters.placement));

  if (parts.length === 0) {
    return `Explore our curated collection of ${count}+ tattoo designs. Browse by style, placement, category, and meaning to find your perfect tattoo.`;
  }

  const prefix = parts.join(" ");
  return `Explore ${prefix} tattoo ideas including styles, placements, and meanings. Find your perfect tattoo among ${count}+ designs and generate your own instantly.`;
}

export function getPopularFilterCombinations(): Record<string, string>[] {
  return [
    { style: "geometric" },
    { style: "watercolor" },
    { style: "minimalist" },
    { style: "traditional" },
    { style: "japanese" },
    { category: "animal" },
    { category: "floral" },
    { category: "skull" },
    { category: "butterfly" },
    { placement: "forearm" },
    { placement: "wrist" },
    { placement: "shoulder" },
    { style: "geometric", category: "mandala" },
    { style: "watercolor", category: "animal" },
    { style: "minimalist", placement: "wrist" },
    { style: "japanese", category: "dragon" },
    { category: "lion", placement: "chest" },
    { meaning: "strength" },
    { meaning: "freedom" },
    { audience: "women" },
    { audience: "men" },
  ];
}
