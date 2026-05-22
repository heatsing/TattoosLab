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
  oldSchoolEagle: makeArtwork(`
    <path d="M256 126 C232 150 220 180 224 214 C204 190 174 174 126 166 C154 206 178 240 222 258" stroke="${ink}" stroke-width="10" />
    <path d="M256 126 C280 150 292 180 288 214 C308 190 338 174 386 166 C358 206 334 240 290 258" stroke="${ink}" stroke-width="10" />
    <path d="M210 270 C224 236 242 220 256 220 C270 220 288 236 302 270 C290 318 274 354 256 378 C238 354 222 318 210 270 Z" stroke="${ink}" stroke-width="10" />
    <path d="M224 194 C240 170 272 170 288 194" stroke="${gold}" stroke-width="6" />
    <path d="M236 252 L256 238 L276 252" stroke="${coral}" stroke-width="7" />
    <path d="M128 344 C178 328 222 334 256 360 C290 334 334 328 384 344" stroke="${coral}" stroke-width="10" />
    <path d="M146 356 H366" stroke="${gold}" stroke-width="5" />
    <circle cx="214" cy="278" r="8" fill="${ink}" />
    <circle cx="298" cy="278" r="8" fill="${ink}" />
  `),
  japaneseDragon: makeArtwork(`
    <path d="M128 334 C170 252 228 264 252 210 C274 162 332 146 386 194 C340 190 314 212 302 248 C284 304 230 316 200 374" stroke="${ink}" stroke-width="12" />
    <path d="M150 324 C194 284 224 292 250 252 C278 210 318 194 360 210" stroke="${gold}" stroke-width="6" />
    <path d="M344 168 C366 138 406 146 420 178 C390 166 368 176 350 202" stroke="${ink}" stroke-width="9" />
    <path d="M386 188 L428 166 M384 202 L432 214" stroke="${coral}" stroke-width="6" />
    <path d="M176 382 C150 404 122 406 94 392 C126 386 146 366 158 338" stroke="${ink}" stroke-width="8" />
    <path d="M232 164 C214 138 184 130 158 144 C182 150 202 166 214 192" stroke="${teal}" stroke-width="7" />
    <circle cx="374" cy="184" r="7" fill="${ink}" />
  `),
  cherryBlossomBranch: makeArtwork(`
    <path d="M104 346 C174 298 242 246 326 150" stroke="${softInk}" stroke-width="10" />
    <path d="M166 288 C132 250 126 212 148 184" stroke="${softInk}" stroke-width="6" />
    <path d="M244 228 C286 230 320 252 342 286" stroke="${softInk}" stroke-width="6" />
    <path d="M146 174 C162 142 196 138 216 164 C196 192 166 198 146 174 Z" stroke="${plum}" stroke-width="6" />
    <path d="M206 242 C224 210 260 210 278 238 C256 266 226 268 206 242 Z" stroke="${coral}" stroke-width="6" />
    <path d="M324 286 C342 258 376 262 394 288 C374 314 342 314 324 286 Z" stroke="${plum}" stroke-width="6" />
    <path d="M300 140 C318 112 352 116 370 140 C350 168 320 168 300 140 Z" stroke="${coral}" stroke-width="6" />
    <circle cx="188" cy="166" r="7" fill="${gold}" />
    <circle cx="248" cy="238" r="7" fill="${gold}" />
    <circle cx="350" cy="286" r="7" fill="${gold}" />
    <circle cx="336" cy="140" r="7" fill="${gold}" />
  `),
  neoRose: makeArtwork(`
    <path d="M176 224 C176 164 220 126 256 126 C292 126 336 164 336 224 C336 284 298 326 256 326 C214 326 176 284 176 224 Z" stroke="${ink}" stroke-width="10" />
    <path d="M210 216 C218 172 246 156 256 198 C268 156 300 172 306 216 C286 208 270 216 256 238 C242 216 226 208 210 216 Z" stroke="${coral}" stroke-width="8" />
    <path d="M198 258 C226 242 244 252 256 286 C268 252 290 242 314 258" stroke="${plum}" stroke-width="7" />
    <path d="M256 326 C250 360 236 394 212 428" stroke="${softInk}" stroke-width="8" />
    <path d="M226 374 C190 358 164 366 148 394 C184 400 210 394 226 374 Z" stroke="${teal}" stroke-width="7" />
    <path d="M248 390 C284 372 316 382 332 412 C294 416 266 410 248 390 Z" stroke="${teal}" stroke-width="7" />
    <circle cx="256" cy="224" r="16" stroke="${gold}" stroke-width="6" />
  `),
  wolfMoon: makeArtwork(`
    <circle cx="342" cy="142" r="52" stroke="${gold}" stroke-width="7" />
    <path d="M168 340 C168 248 210 168 256 122 C302 168 344 248 344 340 C316 382 286 404 256 404 C226 404 196 382 168 340 Z" stroke="${ink}" stroke-width="10" />
    <path d="M206 180 L174 112 L232 154" stroke="${ink}" stroke-width="8" />
    <path d="M306 180 L338 112 L280 154" stroke="${ink}" stroke-width="8" />
    <path d="M220 268 C232 248 244 240 256 240 C268 240 280 248 292 268" stroke="${softInk}" stroke-width="6" />
    <circle cx="224" cy="238" r="8" fill="${ink}" />
    <circle cx="288" cy="238" r="8" fill="${ink}" />
    <path d="M238 300 L256 318 L274 300" stroke="${gold}" stroke-width="7" />
    <path d="M214 344 C238 360 274 360 298 344" stroke="${ink}" stroke-width="7" />
    <path d="M134 418 C192 390 284 390 368 418" stroke="${softInk}" stroke-width="6" />
  `),
  peonySleeve: makeArtwork(`
    <path d="M160 220 C160 152 210 112 256 118 C308 124 348 166 342 224 C336 284 300 328 256 332 C212 328 166 286 160 220 Z" stroke="${ink}" stroke-width="10" />
    <path d="M198 222 C220 168 250 156 256 214 C270 156 302 172 316 222 C286 206 270 228 256 276 C242 228 216 206 198 222 Z" stroke="${coral}" stroke-width="8" />
    <path d="M184 284 C222 256 242 268 256 318 C270 268 296 256 330 284" stroke="${plum}" stroke-width="7" />
    <path d="M132 382 C184 332 226 328 256 354 C286 328 328 332 380 382" stroke="${teal}" stroke-width="8" />
    <path d="M150 398 C204 376 252 380 304 416" stroke="${softInk}" stroke-width="6" />
    <path d="M326 132 C356 104 398 104 420 134 C386 158 356 160 326 132 Z" stroke="${teal}" stroke-width="6" />
    <path d="M112 168 C136 132 174 124 202 150 C170 178 138 184 112 168 Z" stroke="${teal}" stroke-width="6" />
  `),
  lotusFineline: makeArtwork(`
    <path d="M256 148 C278 202 276 250 256 296 C236 250 234 202 256 148 Z" stroke="${ink}" stroke-width="8" />
    <path d="M218 186 C242 224 246 268 256 300 C218 284 190 248 178 204 C194 196 206 192 218 186 Z" stroke="${softInk}" stroke-width="7" />
    <path d="M294 186 C270 224 266 268 256 300 C294 284 322 248 334 204 C318 196 306 192 294 186 Z" stroke="${softInk}" stroke-width="7" />
    <path d="M164 252 C204 250 236 268 256 304 C210 316 172 294 142 260 C150 256 158 254 164 252 Z" stroke="${teal}" stroke-width="6" />
    <path d="M348 252 C308 250 276 268 256 304 C302 316 340 294 370 260 C362 256 354 254 348 252 Z" stroke="${teal}" stroke-width="6" />
    <path d="M126 356 C172 334 218 334 256 354 C294 334 340 334 386 356" stroke="${gold}" stroke-width="6" />
    <path d="M150 388 C210 366 274 366 342 388" stroke="${softInk}" stroke-width="5" />
  `),
  sugarSkull: makeArtwork(`
    <path d="M164 232 C164 154 214 108 256 108 C298 108 348 154 348 232 C348 302 310 358 284 382 H228 C202 358 164 302 164 232 Z" stroke="${ink}" stroke-width="10" />
    <circle cx="222" cy="234" r="34" stroke="${plum}" stroke-width="8" />
    <circle cx="290" cy="234" r="34" stroke="${teal}" stroke-width="8" />
    <circle cx="222" cy="234" r="12" fill="${ink}" />
    <circle cx="290" cy="234" r="12" fill="${ink}" />
    <path d="M238 296 L256 274 L274 296 L256 306 Z" stroke="${gold}" stroke-width="6" />
    <path d="M214 336 H298 M226 360 H286" stroke="${ink}" stroke-width="6" />
    <path d="M154 126 C170 98 204 98 220 126 C198 150 176 150 154 126 Z" stroke="${coral}" stroke-width="6" />
    <path d="M292 126 C308 98 342 98 358 126 C336 150 314 150 292 126 Z" stroke="${coral}" stroke-width="6" />
    <path d="M184 190 C204 176 226 176 244 190 M268 190 C288 176 310 176 330 190" stroke="${gold}" stroke-width="5" />
  `),
  geometricSkull: makeArtwork(`
    <path d="M168 212 L214 128 H302 L348 212 L320 344 L282 384 H230 L192 344 Z" stroke="${ink}" stroke-width="10" />
    <path d="M214 128 L256 214 L302 128 M168 212 L256 214 L348 212 M192 344 L256 214 L320 344 M230 384 L256 326 L282 384" stroke="${softInk}" stroke-width="6" />
    <path d="M208 236 L240 228 L232 264 L204 262 Z" stroke="${ink}" stroke-width="7" />
    <path d="M304 236 L272 228 L280 264 L308 262 Z" stroke="${ink}" stroke-width="7" />
    <path d="M238 306 H274 M246 334 H266" stroke="${gold}" stroke-width="6" />
    <circle cx="256" cy="86" r="9" fill="${gold}" />
    <circle cx="392" cy="256" r="9" fill="${gold}" />
    <circle cx="256" cy="442" r="9" fill="${gold}" />
    <circle cx="120" cy="256" r="9" fill="${gold}" />
  `),
  butterflyMonarch: makeArtwork(`
    <path d="M256 154 V386" stroke="${ink}" stroke-width="10" />
    <path d="M248 190 C194 118 112 132 98 222 C90 278 130 322 220 304 C232 258 242 220 248 190 Z" stroke="${ink}" stroke-width="10" />
    <path d="M264 190 C318 118 400 132 414 222 C422 278 382 322 292 304 C280 258 270 220 264 190 Z" stroke="${ink}" stroke-width="10" />
    <path d="M220 304 C178 334 150 372 154 414 C204 410 234 374 250 326" stroke="${ink}" stroke-width="8" />
    <path d="M292 304 C334 334 362 372 358 414 C308 410 278 374 262 326" stroke="${ink}" stroke-width="8" />
    <path d="M132 222 C164 202 196 202 230 224 M156 274 C184 256 208 256 226 270" stroke="${coral}" stroke-width="7" />
    <path d="M380 222 C348 202 316 202 282 224 M356 274 C328 256 304 256 286 270" stroke="${coral}" stroke-width="7" />
    <path d="M236 152 C230 118 210 104 188 100 M276 152 C282 118 302 104 324 100" stroke="${softInk}" stroke-width="5" />
  `),
  celticCross: makeArtwork(`
    <path d="M230 88 H282 V210 H396 V262 H282 V424 H230 V262 H116 V210 H230 Z" stroke="${ink}" stroke-width="10" />
    <circle cx="256" cy="236" r="92" stroke="${gold}" stroke-width="8" />
    <path d="M206 138 C246 178 246 214 206 254 C246 294 246 330 206 374" stroke="${softInk}" stroke-width="6" />
    <path d="M306 138 C266 178 266 214 306 254 C266 294 266 330 306 374" stroke="${softInk}" stroke-width="6" />
    <path d="M146 236 C190 214 222 214 256 236 C290 258 322 258 366 236" stroke="${softInk}" stroke-width="6" />
    <path d="M146 236 C190 258 222 258 256 236 C290 214 322 214 366 236" stroke="${softInk}" stroke-width="6" />
  `),
  compassRose: makeArtwork(`
    <circle cx="256" cy="256" r="148" stroke="${ink}" stroke-width="9" />
    <circle cx="256" cy="256" r="92" stroke="${gold}" stroke-width="6" stroke-dasharray="8 10" />
    <path d="M256 82 L286 226 L430 256 L286 286 L256 430 L226 286 L82 256 L226 226 Z" stroke="${ink}" stroke-width="10" />
    <path d="M256 136 L274 238 L376 256 L274 274 L256 376 L238 274 L136 256 L238 238 Z" stroke="${teal}" stroke-width="6" />
    <path d="M164 164 L224 236 M348 164 L288 236 M348 348 L288 288 M164 348 L224 288" stroke="${softInk}" stroke-width="6" />
    <circle cx="256" cy="256" r="18" fill="${gold}" />
    <path d="M256 46 V70 M256 442 V466 M46 256 H70 M442 256 H466" stroke="${ink}" stroke-width="5" />
  `),
  smallDragon: makeArtwork(`
    <path d="M144 304 C184 232 236 240 252 190 C266 148 314 128 360 162 C328 166 304 186 296 222 C282 284 224 300 196 364" stroke="${ink}" stroke-width="10" />
    <path d="M164 312 C204 270 230 276 252 232 C270 196 306 174 338 174" stroke="${softInk}" stroke-width="5" />
    <path d="M342 154 C360 126 394 132 408 160 C380 154 364 166 346 190" stroke="${ink}" stroke-width="7" />
    <path d="M364 174 L410 196 M360 188 L402 228" stroke="${gold}" stroke-width="5" />
    <path d="M150 372 C124 388 100 386 82 370 C112 370 134 350 146 318" stroke="${teal}" stroke-width="6" />
    <circle cx="366" cy="170" r="6" fill="${ink}" />
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

export const communityGalleryArtworks = artworks;

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
  {
    id: 13,
    style: "Traditional",
    prompt: "Old school eagle with banner lines and rose-red flash accents",
    image: artworks.oldSchoolEagle,
    artist: "Derek Stone",
    avatar: "DS",
    likes: 276,
    views: 3340,
    placement: "Upper Arm",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "17s",
    isHot: true,
    isNew: false,
    createdAt: "2025-02-01",
  },
  {
    id: 14,
    style: "Japanese",
    prompt: "Japanese dragon sleeve draft with clouds and red scale accents",
    image: artworks.japaneseDragon,
    artist: "Kenji Sato",
    avatar: "KS",
    likes: 634,
    views: 7890,
    placement: "Full Sleeve",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "26s",
    isHot: true,
    isNew: true,
    createdAt: "2025-02-03",
  },
  {
    id: 15,
    style: "Japanese",
    prompt: "Cherry blossom branch with soft petals for shoulder placement",
    image: artworks.cherryBlossomBranch,
    artist: "Yuki Tanaka",
    avatar: "YT",
    likes: 498,
    views: 5670,
    placement: "Shoulder",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "15s",
    isHot: false,
    isNew: true,
    createdAt: "2025-02-04",
  },
  {
    id: 16,
    style: "Neo-Traditional",
    prompt: "Vibrant neo-traditional rose with jewel tone leaves",
    image: artworks.neoRose,
    artist: "Mia Torres",
    avatar: "MT",
    likes: 334,
    views: 3890,
    placement: "Forearm",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "18s",
    isHot: false,
    isNew: false,
    createdAt: "2025-02-05",
  },
  {
    id: 17,
    style: "Realism",
    prompt: "Realistic wolf head with moon halo and clean black shading",
    image: artworks.wolfMoon,
    artist: "Marcus Reed",
    avatar: "MR",
    likes: 523,
    views: 6340,
    placement: "Shoulder",
    colorMode: "Black & Grey",
    resolution: "2048x2048",
    generationTime: "24s",
    isHot: true,
    isNew: false,
    createdAt: "2025-02-06",
  },
  {
    id: 18,
    style: "Watercolor",
    prompt: "Peony flower sleeve concept with soft botanical flow",
    image: artworks.peonySleeve,
    artist: "Yuki Tanaka",
    avatar: "YT",
    likes: 601,
    views: 7120,
    placement: "Full Sleeve",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "21s",
    isHot: true,
    isNew: true,
    createdAt: "2025-02-07",
  },
  {
    id: 19,
    style: "Fineline",
    prompt: "Delicate lotus fineline tattoo emerging from water ripples",
    image: artworks.lotusFineline,
    artist: "Emma Blake",
    avatar: "EB",
    likes: 398,
    views: 4560,
    placement: "Ankle",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "9s",
    isHot: false,
    isNew: true,
    createdAt: "2025-02-08",
  },
  {
    id: 20,
    style: "Illustrative",
    prompt: "Sugar skull with floral eyes and Day of the Dead color accents",
    image: artworks.sugarSkull,
    artist: "Luna Reyes",
    avatar: "LR",
    likes: 445,
    views: 5340,
    placement: "Thigh",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "23s",
    isHot: true,
    isNew: false,
    createdAt: "2025-02-09",
  },
  {
    id: 21,
    style: "Geometric",
    prompt: "Low-poly geometric skull with gold compass points",
    image: artworks.geometricSkull,
    artist: "Ryan Park",
    avatar: "RP",
    likes: 312,
    views: 3780,
    placement: "Forearm",
    colorMode: "Black & Grey",
    resolution: "2048x2048",
    generationTime: "16s",
    isHot: false,
    isNew: false,
    createdAt: "2025-02-10",
  },
  {
    id: 22,
    style: "Watercolor",
    prompt: "Monarch butterfly tattoo with warm watercolor wing panels",
    image: artworks.butterflyMonarch,
    artist: "Mia Torres",
    avatar: "MT",
    likes: 678,
    views: 8230,
    placement: "Shoulder",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "19s",
    isHot: true,
    isNew: true,
    createdAt: "2025-02-11",
  },
  {
    id: 23,
    style: "Minimalist",
    prompt: "Minimal butterfly silhouette for tiny wrist placement",
    image: artworks.butterflyMonarch,
    artist: "Nina Patel",
    avatar: "NP",
    likes: 489,
    views: 5670,
    placement: "Wrist",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "8s",
    isHot: false,
    isNew: true,
    createdAt: "2025-02-12",
  },
  {
    id: 24,
    style: "Blackwork",
    prompt: "Celtic cross with knotwork loop and heavy black structure",
    image: artworks.celticCross,
    artist: "Jonas Weber",
    avatar: "JW",
    likes: 334,
    views: 4120,
    placement: "Upper Arm",
    colorMode: "Black & Grey",
    resolution: "2048x2048",
    generationTime: "18s",
    isHot: false,
    isNew: false,
    createdAt: "2025-02-13",
  },
  {
    id: 25,
    style: "Neo-Traditional",
    prompt: "Rose cross with bold outline and devotional flash symmetry",
    image: artworks.celticCross,
    artist: "Sarah Kim",
    avatar: "SK",
    likes: 278,
    views: 3450,
    placement: "Chest",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "18s",
    isHot: false,
    isNew: false,
    createdAt: "2025-02-14",
  },
  {
    id: 26,
    style: "Traditional",
    prompt: "Vintage compass rose with antique map linework",
    image: artworks.compassRose,
    artist: "Derek Stone",
    avatar: "DS",
    likes: 401,
    views: 4890,
    placement: "Forearm",
    colorMode: "Black & Grey",
    resolution: "2048x2048",
    generationTime: "20s",
    isHot: true,
    isNew: false,
    createdAt: "2025-02-15",
  },
  {
    id: 27,
    style: "Geometric",
    prompt: "Modern geometric compass with clean direction marks",
    image: artworks.compassRose,
    artist: "Ryan Park",
    avatar: "RP",
    likes: 267,
    views: 3120,
    placement: "Wrist",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "13s",
    isHot: false,
    isNew: false,
    createdAt: "2025-02-16",
  },
  {
    id: 28,
    style: "Tribal",
    prompt: "Tribal wolf tattoo with bold shoulder-ready black shapes",
    image: artworks.wolfMoon,
    artist: "Kai Mahalo",
    avatar: "KM",
    likes: 456,
    views: 5670,
    placement: "Shoulder",
    colorMode: "Black & Grey",
    resolution: "2048x2048",
    generationTime: "19s",
    isHot: true,
    isNew: false,
    createdAt: "2025-02-17",
  },
  {
    id: 29,
    style: "Watercolor",
    prompt: "Watercolor wolf portrait with moon and soft splash accents",
    image: artworks.wolfMoon,
    artist: "Mia Torres",
    avatar: "MT",
    likes: 534,
    views: 6450,
    placement: "Thigh",
    colorMode: "Full Color",
    resolution: "2048x2048",
    generationTime: "22s",
    isHot: true,
    isNew: true,
    createdAt: "2025-02-18",
  },
  {
    id: 30,
    style: "Minimalist",
    prompt: "Small dragon wrist tattoo with compact protective curves",
    image: artworks.smallDragon,
    artist: "Nina Patel",
    avatar: "NP",
    likes: 356,
    views: 4120,
    placement: "Wrist",
    colorMode: "Black & Grey",
    resolution: "1024x1024",
    generationTime: "10s",
    isHot: false,
    isNew: true,
    createdAt: "2025-02-19",
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
  "Fineline",
  "Illustrative",
] as const;
