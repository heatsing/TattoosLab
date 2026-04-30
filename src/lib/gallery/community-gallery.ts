export interface CommunityGalleryItem {
  id: number;
  style: string;
  prompt: string;
  image: string;
  artist: string;
  avatar: string;
  likes: number;
  views: number;
  placement: string;
  colorMode: string;
  resolution: string;
  generationTime: string;
  isHot: boolean;
  isNew: boolean;
  createdAt: string;
}

const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    svg.replace(/\s+/g, " ").trim()
  )}`;

const makeArtwork = (content: string, viewBox = "0 0 512 512") =>
  svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        ${content}
      </g>
    </svg>
  `);

const ink = "#111111";
const softInk = "#3f342c";
const gold = "#c5914d";
const coral = "#de7d65";
const teal = "#4f8b8c";
const blue = "#6d8fd9";
const plum = "#8d5f92";

const artworks = {
  geometricMandala: makeArtwork(`
    <circle cx="256" cy="256" r="170" stroke="${ink}" stroke-width="10" />
    <circle cx="256" cy="256" r="126" stroke="${softInk}" stroke-width="8" stroke-dasharray="10 14" />
    <circle cx="256" cy="256" r="78" stroke="${ink}" stroke-width="8" />
    <path d="M256 78 L297 160 L388 168 L324 230 L340 322 L256 278 L172 322 L188 230 L124 168 L215 160 Z" stroke="${ink}" stroke-width="11" />
    <path d="M256 112 L286 182 L360 192 L310 240 L322 316 L256 284 L190 316 L202 240 L152 192 L226 182 Z" stroke="${gold}" stroke-width="6" />
    <path d="M256 48 V464 M48 256 H464 M106 106 L406 406 M406 106 L106 406" stroke="${softInk}" stroke-width="5" opacity="0.7" />
    <circle cx="256" cy="256" r="22" stroke="${gold}" stroke-width="10" />
    <circle cx="256" cy="84" r="10" fill="${gold}" />
    <circle cx="428" cy="256" r="10" fill="${gold}" />
    <circle cx="256" cy="428" r="10" fill="${gold}" />
    <circle cx="84" cy="256" r="10" fill="${gold}" />
  `),
  watercolorWave: makeArtwork(`
    <path d="M76 282 C126 214 178 196 234 220 C286 242 336 242 434 170" stroke="${teal}" stroke-width="18" opacity="0.32" />
    <path d="M84 332 C150 248 222 232 284 254 C342 274 388 270 438 230" stroke="${blue}" stroke-width="14" opacity="0.28" />
    <path d="M82 308 C140 246 198 228 244 242 C292 256 356 280 430 212" stroke="${teal}" stroke-width="8" />
    <path d="M98 350 C156 290 210 272 266 284 C326 298 382 304 434 264" stroke="${coral}" stroke-width="8" />
    <path d="M104 226 C164 174 222 170 286 198 C342 224 390 220 426 188" stroke="${plum}" stroke-width="6" opacity="0.8" />
    <circle cx="156" cy="164" r="18" fill="${coral}" opacity="0.18" />
    <circle cx="198" cy="132" r="14" fill="${blue}" opacity="0.18" />
    <circle cx="328" cy="118" r="12" fill="${teal}" opacity="0.18" />
    <path d="M140 144 C152 118 178 112 190 136 C174 156 154 160 140 144 Z" stroke="${coral}" stroke-width="5" />
    <path d="M314 126 C324 104 346 98 360 118 C346 136 326 142 314 126 Z" stroke="${teal}" stroke-width="5" />
  `),
  linePortrait: makeArtwork(`
    <path d="M332 104 C288 94 240 118 220 160 C202 198 204 242 194 272 C182 306 158 332 132 340 C170 360 224 350 248 322 C260 306 260 276 272 258 C288 234 316 232 332 250 C350 270 366 304 352 330 C340 352 314 366 290 370 C248 376 220 366 184 344" stroke="${ink}" stroke-width="8" />
    <path d="M218 174 C246 168 268 182 278 208" stroke="${softInk}" stroke-width="5" />
    <path d="M230 246 C250 260 278 258 296 242" stroke="${gold}" stroke-width="5" />
    <circle cx="264" cy="210" r="8" fill="${ink}" />
  `),
  anchorRose: makeArtwork(`
    <path d="M256 84 V344" stroke="${ink}" stroke-width="14" />
    <path d="M212 134 C212 108 230 90 256 90 C282 90 300 108 300 134 C300 160 282 178 256 178 C230 178 212 160 212 134 Z" stroke="${ink}" stroke-width="10" />
    <path d="M182 230 H330" stroke="${ink}" stroke-width="14" />
    <path d="M180 340 C196 382 238 404 256 404 C274 404 316 382 332 340" stroke="${ink}" stroke-width="14" />
    <path d="M160 334 C152 390 188 436 244 432" stroke="${softInk}" stroke-width="8" />
    <path d="M352 334 C360 390 324 436 268 432" stroke="${softInk}" stroke-width="8" />
    <path d="M298 212 C318 194 348 194 366 214 C384 234 384 264 362 282 C340 300 312 298 296 278 C282 260 282 232 298 212 Z" stroke="${coral}" stroke-width="8" />
    <path d="M314 222 C326 214 344 216 352 228 C358 240 354 254 344 264 C332 272 318 270 308 260 C300 248 302 232 314 222 Z" stroke="${coral}" stroke-width="5" />
    <path d="M286 286 L248 316" stroke="${gold}" stroke-width="6" />
    <path d="M266 302 C276 296 288 300 294 310" stroke="${gold}" stroke-width="5" />
  `),
  koiCherry: makeArtwork(`
    <path d="M150 288 C188 208 272 176 328 212 C378 244 380 320 328 354 C264 394 182 352 150 288 Z" stroke="${ink}" stroke-width="10" />
    <path d="M166 280 C208 234 274 224 310 250 C344 274 344 320 308 340 C262 366 204 348 166 280 Z" stroke="${coral}" stroke-width="5" />
    <path d="M332 252 C372 242 402 212 418 178 C408 224 392 252 364 278" stroke="${ink}" stroke-width="8" />
    <path d="M338 320 C374 334 404 362 422 398 C398 370 368 354 334 346" stroke="${ink}" stroke-width="8" />
    <path d="M194 258 C220 236 252 224 286 224" stroke="${softInk}" stroke-width="5" />
    <path d="M192 320 C228 344 272 352 312 340" stroke="${softInk}" stroke-width="5" />
    <circle cx="290" cy="262" r="8" fill="${ink}" />
    <path d="M110 142 C124 118 150 114 166 136 C146 156 124 160 110 142 Z" stroke="${plum}" stroke-width="5" />
    <path d="M382 126 C394 102 422 98 438 118 C420 142 398 148 382 126 Z" stroke="${plum}" stroke-width="5" />
    <path d="M408 306 C422 286 448 284 462 304 C446 324 424 326 408 306 Z" stroke="${plum}" stroke-width="5" />
  `),
  blackworkMandala: makeArtwork(`
    <circle cx="256" cy="256" r="148" stroke="${ink}" stroke-width="10" stroke-dasharray="2 18" />
    <circle cx="256" cy="256" r="102" stroke="${ink}" stroke-width="8" />
    <path d="M256 138 C280 180 330 192 364 164 C350 212 372 258 412 276 C368 288 346 332 356 382 C324 348 274 352 256 394 C238 352 188 348 156 382 C166 332 144 288 100 276 C140 258 162 212 148 164 C182 192 232 180 256 138 Z" stroke="${ink}" stroke-width="10" />
    <path d="M256 178 C276 214 316 222 340 198 C330 230 346 264 380 276 C344 286 330 322 336 352 C308 326 272 332 256 366 C240 332 204 326 176 352 C182 322 168 286 132 276 C166 264 182 230 172 198 C196 222 236 214 256 178 Z" stroke="${gold}" stroke-width="5" />
    <circle cx="256" cy="256" r="26" fill="${ink}" />
    <circle cx="256" cy="86" r="8" fill="${ink}" />
    <circle cx="426" cy="256" r="8" fill="${ink}" />
    <circle cx="256" cy="426" r="8" fill="${ink}" />
    <circle cx="86" cy="256" r="8" fill="${ink}" />
  `),
  owlCelestial: makeArtwork(`
    <path d="M150 318 C150 220 194 144 256 144 C318 144 362 220 362 318 C330 364 294 392 256 392 C218 392 182 364 150 318 Z" stroke="${ink}" stroke-width="10" />
    <circle cx="214" cy="250" r="34" stroke="${ink}" stroke-width="10" />
    <circle cx="298" cy="250" r="34" stroke="${ink}" stroke-width="10" />
    <circle cx="214" cy="250" r="8" fill="${ink}" />
    <circle cx="298" cy="250" r="8" fill="${ink}" />
    <path d="M236 300 L256 328 L276 300" stroke="${gold}" stroke-width="8" />
    <path d="M180 184 C194 160 218 144 246 140" stroke="${softInk}" stroke-width="6" />
    <path d="M332 184 C318 160 294 144 266 140" stroke="${softInk}" stroke-width="6" />
    <path d="M176 318 C204 306 226 310 242 332" stroke="${softInk}" stroke-width="6" />
    <path d="M336 318 C308 306 286 310 270 332" stroke="${softInk}" stroke-width="6" />
    <path d="M162 110 H350" stroke="${softInk}" stroke-width="5" stroke-dasharray="1 14" />
    <circle cx="188" cy="102" r="12" stroke="${gold}" stroke-width="5" />
    <circle cx="256" cy="102" r="14" stroke="${gold}" stroke-width="5" />
    <circle cx="324" cy="102" r="10" stroke="${gold}" stroke-width="5" />
  `),
  dotworkMountain: makeArtwork(`
    <path d="M88 336 L184 220 L236 286 L298 182 L424 336" stroke="${ink}" stroke-width="11" />
    <path d="M138 336 L220 256 L270 312 L346 236 L424 336" stroke="${softInk}" stroke-width="6" />
    <circle cx="344" cy="148" r="42" stroke="${gold}" stroke-width="7" />
    <path d="M344 72 V106 M344 190 V224 M268 148 H302 M386 148 H420 M292 96 L314 118 M396 96 L374 118 M292 200 L314 178 M396 200 L374 178" stroke="${gold}" stroke-width="5" />
    <circle cx="116" cy="160" r="4" fill="${ink}" />
    <circle cx="146" cy="132" r="4" fill="${ink}" />
    <circle cx="174" cy="154" r="4" fill="${ink}" />
    <circle cx="208" cy="118" r="4" fill="${ink}" />
    <circle cx="242" cy="146" r="4" fill="${ink}" />
    <path d="M110 388 C178 360 252 360 334 388 C374 402 410 404 434 394" stroke="${softInk}" stroke-width="6" />
  `),
  crystalGeometry: makeArtwork(`
    <path d="M256 104 L334 176 L308 336 L204 336 L178 176 Z" stroke="${ink}" stroke-width="10" />
    <path d="M256 104 L256 336 M178 176 L334 176 M204 336 L256 224 L308 336" stroke="${softInk}" stroke-width="6" />
    <circle cx="256" cy="256" r="146" stroke="${gold}" stroke-width="8" stroke-dasharray="14 12" />
    <path d="M120 256 H392 M256 120 V392 M156 156 L356 356 M356 156 L156 356" stroke="${gold}" stroke-width="4" opacity="0.6" />
    <path d="M214 188 L256 150 L298 188" stroke="${blue}" stroke-width="6" />
    <path d="M204 294 L256 252 L308 294" stroke="${teal}" stroke-width="6" />
    <circle cx="256" cy="74" r="10" fill="${blue}" />
    <circle cx="438" cy="256" r="10" fill="${teal}" />
    <circle cx="256" cy="438" r="10" fill="${coral}" />
    <circle cx="74" cy="256" r="10" fill="${plum}" />
  `),
  lionPortrait: makeArtwork(`
    <path d="M256 118 C198 120 156 164 150 220 C140 308 192 392 256 392 C320 392 372 308 362 220 C356 164 314 120 256 118 Z" stroke="${ink}" stroke-width="10" />
    <path d="M182 164 C150 170 118 194 106 226 C134 220 160 232 178 254" stroke="${softInk}" stroke-width="8" />
    <path d="M330 164 C362 170 394 194 406 226 C378 220 352 232 334 254" stroke="${softInk}" stroke-width="8" />
    <path d="M168 288 C148 310 138 338 138 368 C170 350 198 352 220 366" stroke="${softInk}" stroke-width="8" />
    <path d="M344 288 C364 310 374 338 374 368 C342 350 314 352 292 366" stroke="${softInk}" stroke-width="8" />
    <circle cx="220" cy="236" r="10" fill="${ink}" />
    <circle cx="292" cy="236" r="10" fill="${ink}" />
    <path d="M236 280 L256 298 L276 280" stroke="${gold}" stroke-width="8" />
    <path d="M208 320 C234 336 278 336 304 320" stroke="${ink}" stroke-width="7" />
    <path d="M174 124 C196 88 230 70 256 66 C282 70 316 88 338 124" stroke="${gold}" stroke-width="7" />
  `),
  tribalWave: makeArtwork(`
    <path d="M90 178 C148 106 230 88 304 118 C262 140 222 182 210 232 C194 294 222 338 278 360 C336 382 404 356 438 306 C428 362 388 412 320 432 C250 452 174 430 130 376 C88 326 82 248 90 178 Z" stroke="${ink}" stroke-width="14" />
    <path d="M152 188 C198 146 252 146 282 174 C246 194 222 228 220 270 C218 304 236 332 266 350 C212 356 164 328 146 280 C134 250 136 214 152 188 Z" stroke="${softInk}" stroke-width="9" />
    <path d="M316 186 C354 180 386 198 404 228 C384 226 362 238 348 256 C328 280 326 318 344 350 C304 326 286 284 292 246 C296 220 306 200 316 186 Z" stroke="${gold}" stroke-width="7" />
  `),
  constellationMap: makeArtwork(`
    <circle cx="124" cy="184" r="12" fill="${ink}" />
    <circle cx="202" cy="144" r="10" fill="${ink}" />
    <circle cx="268" cy="198" r="10" fill="${ink}" />
    <circle cx="334" cy="150" r="10" fill="${ink}" />
    <circle cx="390" cy="214" r="12" fill="${ink}" />
    <circle cx="302" cy="294" r="10" fill="${ink}" />
    <circle cx="206" cy="324" r="10" fill="${ink}" />
    <circle cx="130" cy="280" r="12" fill="${ink}" />
    <path d="M124 184 L202 144 L268 198 L334 150 L390 214 L302 294 L206 324 L130 280 Z" stroke="${ink}" stroke-width="8" />
    <path d="M152 108 L166 122 M166 108 L152 122 M360 96 L374 110 M374 96 L360 110 M104 356 L118 370 M118 356 L104 370 M396 338 L410 352 M410 338 L396 352" stroke="${gold}" stroke-width="5" />
    <circle cx="256" cy="256" r="162" stroke="${gold}" stroke-width="6" stroke-dasharray="6 14" opacity="0.75" />
  `),
} as const;

export const communityGalleryItems: CommunityGalleryItem[] = [
  {
    id: 1,
    style: "Geometric",
    prompt: "Sacred geometry mandala with golden ratios and hexagonal patterns",
    image: artworks.geometricMandala,
    artist: "Alex Chen",
    avatar: "AC",
    likes: 234,
    views: 1205,
    placement: "Forearm",
    colorMode: "Black & Grey",
    resolution: "2048x2048",
    generationTime: "12s",
    isHot: true,
    isNew: false,
    createdAt: "2024-12-15",
  },
  {
    id: 2,
    style: "Watercolor",
    prompt: "Flowing abstract ocean waves with coral reef details",
    image: artworks.watercolorWave,
    artist: "Mia Torres",
    avatar: "MT",
    likes: 189,
    views: 892,
    placement: "Shoulder",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "18s",
    isHot: false,
    isNew: true,
    createdAt: "2025-01-20",
  },
  {
    id: 3,
    style: "Minimalist",
    prompt: "Single continuous line portrait silhouette of a woman",
    image: artworks.linePortrait,
    artist: "Jonas Weber",
    avatar: "JW",
    likes: 312,
    views: 1543,
    placement: "Wrist",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "8s",
    isHot: true,
    isNew: false,
    createdAt: "2024-11-08",
  },
  {
    id: 4,
    style: "Traditional",
    prompt: "Classic nautical anchor wrapped in rope with rose banner",
    image: artworks.anchorRose,
    artist: "Sarah Kim",
    avatar: "SK",
    likes: 156,
    views: 678,
    placement: "Chest",
    colorMode: "Full Color",
    resolution: "1024x1024",
    generationTime: "14s",
    isHot: false,
    isNew: false,
    createdAt: "2024-10-22",
  },
  {
    id: 5,
    style: "Japanese",
    prompt: "Koi fish swimming upstream through cherry blossom petals",
    image: artworks.koiCherry,
    artist: "Kenji Sato",
    avatar: "KS",
    likes: 278,
    views: 1102,
    placement: "Back",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "22s",
    isHot: true,
    isNew: true,
    createdAt: "2025-01-18",
  },
  {
    id: 6,
    style: "Blackwork",
    prompt: "Intricate sacred dot pattern mandala with floral elements",
    image: artworks.blackworkMandala,
    artist: "Luna Reyes",
    avatar: "LR",
    likes: 198,
    views: 845,
    placement: "Thigh",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "16s",
    isHot: false,
    isNew: false,
    createdAt: "2024-09-15",
  },
  {
    id: 7,
    style: "Neo-Traditional",
    prompt: "Owl with moon phases and celestial flowers on branch",
    image: artworks.owlCelestial,
    artist: "Derek Stone",
    avatar: "DS",
    likes: 421,
    views: 2103,
    placement: "Upper Arm",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "20s",
    isHot: true,
    isNew: true,
    createdAt: "2025-01-25",
  },
  {
    id: 8,
    style: "Dotwork",
    prompt: "Stippled mountain landscape with geometric sun rays",
    image: artworks.dotworkMountain,
    artist: "Emma Blake",
    avatar: "EB",
    likes: 267,
    views: 1342,
    placement: "Calf",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "25s",
    isHot: false,
    isNew: false,
    createdAt: "2024-12-01",
  },
  {
    id: 9,
    style: "Geometric",
    prompt: "Crystal formation with sacred geometry overlay and aurora colors",
    image: artworks.crystalGeometry,
    artist: "Ryan Park",
    avatar: "RP",
    likes: 356,
    views: 1876,
    placement: "Ribcage",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "15s",
    isHot: true,
    isNew: false,
    createdAt: "2024-11-30",
  },
  {
    id: 10,
    style: "Realism",
    prompt: "Hyper realistic lion portrait with dramatic lighting",
    image: artworks.lionPortrait,
    artist: "Maria Lopez",
    avatar: "ML",
    likes: 512,
    views: 3201,
    placement: "Chest",
    colorMode: "Black & Grey",
    resolution: "2048x2048",
    generationTime: "28s",
    isHot: true,
    isNew: true,
    createdAt: "2025-01-28",
  },
  {
    id: 11,
    style: "Tribal",
    prompt: "Polynesian tribal sleeve pattern with ocean wave motifs",
    image: artworks.tribalWave,
    artist: "Kai Mahalo",
    avatar: "KM",
    likes: 298,
    views: 1567,
    placement: "Full Sleeve",
    colorMode: "Black & Grey",
    resolution: "2048x2048",
    generationTime: "19s",
    isHot: true,
    isNew: false,
    createdAt: "2024-10-05",
  },
  {
    id: 12,
    style: "Minimalist",
    prompt: "Tiny constellation map with connected stars on wrist",
    image: artworks.constellationMap,
    artist: "Nina Patel",
    avatar: "NP",
    likes: 445,
    views: 2345,
    placement: "Wrist",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "6s",
    isHot: true,
    isNew: true,
    createdAt: "2025-01-30",
  },
];

export const communityGalleryCategories = [
  "All",
  "Geometric",
  "Watercolor",
  "Minimalist",
  "Traditional",
  "Japanese",
  "Blackwork",
  "Neo-Traditional",
  "Dotwork",
  "Tribal",
  "Realism",
] as const;

