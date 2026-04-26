import { Tattoo, FilterConfig, FilterType, GalleryFilter } from "./types";

export const tattoos: Tattoo[] = [
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
      { value: "tribal", label: "Tribal", count: 1 },
      { value: "fineline", label: "Fineline", count: 1 },
      { value: "illustrative", label: "Illustrative", count: 1 },
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

// ============ Helper Functions ============

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
