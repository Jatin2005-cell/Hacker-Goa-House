import QRCode from 'qrcode';

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1520;

const COLORS = {
  cream: '#FBF3E1',
  creamDark: '#F1E2C1',
  teal: '#0E4C43',
  tealDark: '#06352F',
  coral: '#FF5A6E',
  mango: '#FFC23C',
  ink: '#14231E',
  aqua: '#35B0A0',
  white: '#FFFFFF',
  muted: '#66817A',
};

export interface CardData {
  name: string;
  role: string;
  builderTitle: string;
  builderId: string;
  photo: ImageBitmap | HTMLImageElement | null;
}

type LoadedImage = HTMLImageElement | ImageBitmap;

/* ================================================== */
/* BASIC HELPERS                                      */
/* ================================================== */

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  weight = 600,
  align: CanvasTextAlign = 'left'
) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "Poppins", Arial, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(value, x, y);
}

function line(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 2
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/* ================================================== */
/* IMAGE LOADING                                      */
/* ================================================== */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);

    img.onerror = () =>
      reject(new Error(`Unable to load ${src}`));

    img.src = src;
  });
}

async function loadCardAssets() {
  const assets = {
    background: null as LoadedImage | null,
    hackerHouse: null as LoadedImage | null,
    goaLogo: null as LoadedImage | null,
    pm247: null as LoadedImage | null,
  };

  const results = await Promise.allSettled([
    loadImage('/card-assets/background.png'),
    loadImage('/card-assets/hacker-house.png'),
    loadImage('/card-assets/goa_hindi.svg'),
    loadImage('/card-assets/2-47.svg'),
  ]);

  if (results[0].status === 'fulfilled') {
    assets.background = results[0].value;
  }

  if (results[1].status === 'fulfilled') {
    assets.hackerHouse = results[1].value;
  }

  if (results[2].status === 'fulfilled') {
    assets.goaLogo = results[2].value;
  }

  if (results[3].status === 'fulfilled') {
    assets.pm247 = results[3].value;
  }

  return assets;
}

/* ================================================== */
/* IMAGE HELPERS                                      */
/* ================================================== */

function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: LoadedImage,
  x: number,
  y: number,
  w: number,
  h: number,
  radius = 0
) {
  const iw = img.width;
  const ih = img.height;

  const scale = Math.min(w / iw, h / ih);

  const dw = iw * scale;
  const dh = ih * scale;

  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;

  ctx.save();

  if (radius > 0) {
    roundRect(ctx, x, y, w, h, radius);
    ctx.clip();
  }

  ctx.drawImage(img, dx, dy, dw, dh);

  ctx.restore();
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: LoadedImage,
  x: number,
  y: number,
  w: number,
  h: number,
  radius = 0
) {
  const iw = img.width;
  const ih = img.height;

  const scale = Math.max(w / iw, h / ih);

  const dw = iw * scale;
  const dh = ih * scale;

  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;

  ctx.save();

  if (radius > 0) {
    roundRect(ctx, x, y, w, h, radius);
    ctx.clip();
  }

  ctx.drawImage(img, dx, dy, dw, dh);

  ctx.restore();
}

/* ================================================== */
/* BACKGROUND                                         */
/* ================================================== */

function drawBackground(
  ctx: CanvasRenderingContext2D,
  background: LoadedImage | null
) {
  ctx.fillStyle = COLORS.cream;

  ctx.fillRect(
    0,
    0,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  if (background) {
    ctx.save();

    ctx.globalAlpha = 0.68;
    ctx.filter = 'blur(0.8px)';

    drawImageCover(
      ctx,
      background,
      0,
      0,
      CARD_WIDTH,
      CARD_HEIGHT
    );

    ctx.restore();

    ctx.save();

    const overlay = ctx.createLinearGradient(
      0,
      0,
      0,
      CARD_HEIGHT
    );

    overlay.addColorStop(
      0,
      'rgba(6,53,47,0.18)'
    );

    overlay.addColorStop(
      0.35,
      'rgba(6,53,47,0.08)'
    );

    overlay.addColorStop(
      0.7,
      'rgba(6,53,47,0.06)'
    );

    overlay.addColorStop(
      1,
      'rgba(6,53,47,0.20)'
    );

    ctx.fillStyle = overlay;

    ctx.fillRect(
      0,
      0,
      CARD_WIDTH,
      CARD_HEIGHT
    );

    ctx.restore();

    ctx.save();

    const readability =
      ctx.createLinearGradient(
        0,
        0,
        0,
        CARD_HEIGHT
      );

    readability.addColorStop(
      0,
      'rgba(251,243,225,0.10)'
    );

    readability.addColorStop(
      0.45,
      'rgba(251,243,225,0.02)'
    );

    readability.addColorStop(
      0.75,
      'rgba(251,243,225,0.03)'
    );

    readability.addColorStop(
      1,
      'rgba(251,243,225,0.08)'
    );

    ctx.fillStyle = readability;

    ctx.fillRect(
      0,
      0,
      CARD_WIDTH,
      CARD_HEIGHT
    );

    ctx.restore();
  }

  /*
   * Fine dot texture
   */
  ctx.fillStyle =
    'rgba(14,76,67,0.045)';

  for (
    let y = 30;
    y < CARD_HEIGHT;
    y += 28
  ) {
    for (
      let x = 25;
      x < CARD_WIDTH;
      x += 28
    ) {
      ctx.beginPath();

      ctx.arc(
        x,
        y,
        1.2,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  }

  /*
   * Diagonal paper lines
   */
  ctx.save();

  ctx.strokeStyle =
    'rgba(14,76,67,0.035)';

  ctx.lineWidth = 2;

  for (
    let i = -CARD_HEIGHT;
    i < CARD_WIDTH;
    i += 45
  ) {
    ctx.beginPath();

    ctx.moveTo(i, 0);

    ctx.lineTo(
      i + CARD_HEIGHT,
      CARD_HEIGHT
    );

    ctx.stroke();
  }

  ctx.restore();

  /*
   * Decorative waves
   */
  ctx.save();

  ctx.strokeStyle =
    'rgba(53,176,160,0.08)';

  ctx.lineWidth = 3;

  for (
    let i = 0;
    i < 5;
    i++
  ) {
    ctx.beginPath();

    for (
      let x = 60;
      x <= 1020;
      x += 20
    ) {
      const y =
        520 +
        i * 28 +
        Math.sin(x / 90 + i) * 18;

      if (x === 60) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }

  ctx.restore();

  /*
   * Outer border
   * CHANGED TO GOLDEN
   */
 /*
 * Outer golden border with broad shadow
 */
ctx.save();

ctx.shadowColor = 'rgba(255,194,60,0.55)';
ctx.shadowBlur = 28;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;

ctx.strokeStyle = COLORS.mango;
ctx.lineWidth = 14;

roundRect(
  ctx,
  18,
  18,
  CARD_WIDTH - 36,
  CARD_HEIGHT - 36,
  38
);

ctx.stroke();

ctx.restore();

/*
 * Inner border
 */
ctx.strokeStyle =
  'rgba(14,76,67,0.35)';

ctx.lineWidth = 2;

roundRect(
  ctx,
  38,
  38,
  CARD_WIDTH - 76,
  CARD_HEIGHT - 76,
  28
);

ctx.stroke();
}

/* ================================================== */
/* STAR                                               */
/* ================================================== */

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  color: string,
  rotationDeg = 0
) {
  ctx.save();

  ctx.fillStyle = color;

  ctx.translate(cx, cy);

  ctx.rotate(
    (rotationDeg * Math.PI) / 180
  );

  ctx.beginPath();

  for (let i = 0; i < 8; i++) {
    const r =
      i % 2 === 0
        ? outerR
        : innerR;

    const angle =
      (Math.PI / 4) * i -
      Math.PI / 2;

    const px =
      Math.cos(angle) * r;

    const py =
      Math.sin(angle) * r;

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.closePath();

  ctx.fill();

  ctx.restore();
}

/* ================================================== */
/* HEADER                                             */
/* ================================================== */

function drawHeader(
  ctx: CanvasRenderingContext2D,
  hackerHouse: LoadedImage | null,
  goaLogo: LoadedImage | null
) {
  const centerX = CARD_WIDTH / 2;

  /*
   * Top left
   */
  text(
    ctx,
    'HH / GOA / 26',
    80,
    94,
    19,
    COLORS.tealDark,
    900
  );

  /*
   * Top right
   */
  text(
    ctx,
    'OCT 28 — 31',
    CARD_WIDTH - 80,
    94,
    21,
    COLORS.tealDark,
    900,
    'right'
  );

  /*
   * Main Hacker House logo
   */
  if (hackerHouse) {
    drawImageContain(
      ctx,
      hackerHouse,
      centerX - 385,
      102,
      770,
      170
    );
  } else {
    text(
      ctx,
      'HACKER        HOUSE',
      centerX,
      220,
      88,
      COLORS.mango,
      900,
      'center'
    );
  }

  /*
   * GOA logo
   * Exact center between HACKER and HOUSE.
   */
  if (goaLogo) {
    drawImageContain(
      ctx,
      goaLogo,
      centerX - 62,
      142,
      124,
      88
    );
  }

  /*
   * Decorative stars
   */
  drawStar(
    ctx,
    centerX - 390,
    205,
    17,
    7,
    COLORS.mango,
    -10
  );

  drawStar(
    ctx,
    centerX + 390,
    205,
    17,
    7,
    COLORS.coral,
    12
  );

  /*
   * Gold line
   */
  ctx.strokeStyle =
    COLORS.mango;

  ctx.lineWidth = 6;

  ctx.lineCap = 'round';

  ctx.beginPath();

  ctx.moveTo(
    centerX - 285,
    280
  );

  ctx.lineTo(
    centerX + 285,
    280
  );

  ctx.stroke();

  /*
   * Main tagline
   */
  text(
    ctx,
    'A BUILDER ID FOR THE PEOPLE WHO SHIP',
    centerX,
    318,
    19,
    COLORS.tealDark,
    900,
    'center'
  );

  /*
   * Wine ribbon
   */
  drawWineRibbon(
    ctx,
    centerX,
    325
  );

  /*
   * Divider
   */
  line(
    ctx,
    70,
    414,
    CARD_WIDTH - 70,
    414,
    'rgba(14,76,67,0.25)',
    2
  );
}

/* ================================================== */
/* WINE RIBBON                                        */
/* ================================================== */

function drawWineRibbon(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number
) {
  const ribbonW = 340;
  const ribbonH = 62;

  const x =
    centerX - ribbonW / 2;

  /*
   * Ribbon body
   */
  ctx.fillStyle =
    COLORS.coral;

  ctx.beginPath();

  ctx.moveTo(
    x + 25,
    y
  );

  ctx.lineTo(
    x + ribbonW - 25,
    y
  );

  ctx.lineTo(
    x + ribbonW - 45,
    y + ribbonH
  );

  ctx.lineTo(
    x + 45,
    y + ribbonH
  );

  ctx.closePath();

  ctx.fill();

  /*
   * Left rolled end
   */
  ctx.fillStyle =
    '#D94459';

  ctx.beginPath();

  ctx.ellipse(
    x + 28,
    y + 8,
    18,
    12,
    -0.25,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle =
    COLORS.coral;

  ctx.fillRect(
    x + 13,
    y + 5,
    30,
    ribbonH - 5
  );

  /*
   * Right rolled end
   */
  ctx.fillStyle =
    '#D94459';

  ctx.beginPath();

  ctx.ellipse(
    x + ribbonW - 28,
    y + 8,
    18,
    12,
    0.25,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle =
    COLORS.coral;

  ctx.fillRect(
    x + ribbonW - 43,
    y + 5,
    30,
    ribbonH - 5
  );

  /*
   * Ribbon outline
   */
  ctx.strokeStyle =
    '#9E3040';

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(
    x + 25,
    y
  );

  ctx.lineTo(
    x + ribbonW - 25,
    y
  );

  ctx.lineTo(
    x + ribbonW - 45,
    y + ribbonH
  );

  ctx.lineTo(
    x + 45,
    y + ribbonH
  );

  ctx.closePath();

  ctx.stroke();

  text(
    ctx,
    'WINE',
    centerX,
    y + 41,
    28,
    COLORS.white,
    900,
    'center'
  );
}

/* ================================================== */
/* PHOTO FRAME                                        */
/* ================================================== */

function drawPhotoFrame(
  ctx: CanvasRenderingContext2D,
  photo: ImageBitmap | HTMLImageElement | null,
  cx: number,
  cy: number,
  r: number
) {
  /*
   * Outer soft coral ring
   */
  ctx.save();

  ctx.strokeStyle =
    'rgba(255,90,110,0.18)';

  ctx.lineWidth = 18;

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    r + 24,
    0,
    Math.PI * 2
  );

  ctx.stroke();

  ctx.restore();

  /*
   * Dashed coral ring
   */
  ctx.save();

  ctx.strokeStyle =
    COLORS.coral;

  ctx.lineWidth = 7;

  ctx.setLineDash([
    16,
    11
  ]);

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    r + 21,
    0,
    Math.PI * 2
  );

  ctx.stroke();

  ctx.restore();

  /*
   * Gold ring
   */
  ctx.strokeStyle =
    COLORS.mango;

  ctx.lineWidth = 9;

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    r + 9,
    0,
    Math.PI * 2
  );

  ctx.stroke();

  /*
   * Photo circle
   */
  ctx.save();

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    r,
    0,
    Math.PI * 2
  );

  ctx.clip();

  if (photo) {
    const iw =
      photo.width;

    const ih =
      photo.height;

    const scale =
      Math.max(
        (r * 2) / iw,
        (r * 2) / ih
      );

    const dw =
      iw * scale;

    const dh =
      ih * scale;

    ctx.drawImage(
      photo,
      cx - dw / 2,
      cy - dh / 2,
      dw,
      dh
    );
  } else {
    ctx.fillStyle =
      COLORS.creamDark;

    ctx.fillRect(
      cx - r,
      cy - r,
      r * 2,
      r * 2
    );

    text(
      ctx,
      'UPLOAD',
      cx,
      cy - 5,
      23,
      COLORS.tealDark,
      900,
      'center'
    );

    text(
      ctx,
      'YOUR PHOTO',
      cx,
      cy + 35,
      17,
      COLORS.muted,
      800,
      'center'
    );
  }

  ctx.restore();

  /*
   * Inner dark teal outline
   */
  ctx.strokeStyle =
    COLORS.tealDark;

  ctx.lineWidth = 6;

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    r,
    0,
    Math.PI * 2
  );

  ctx.stroke();
}

/* ================================================== */
/* TAGS                                               */
/* ================================================== */

function drawTag(
  ctx: CanvasRenderingContext2D,
  label: string,
  icon: string,
  x: number,
  y: number,
  color: string
) {
  const w = 190;
  const h = 56;

  const left =
    x - w / 2;

  const top =
    y - h / 2;

  ctx.save();

  /*
   * Cream background
   */
  ctx.fillStyle =
    'rgba(251,243,225,0.94)';

  roundRect(
    ctx,
    left,
    top,
    w,
    h,
    28
  );

  ctx.fill();

  /*
   * Colored border
   */
  ctx.strokeStyle =
    color;

  ctx.lineWidth = 3;

  roundRect(
    ctx,
    left,
    top,
    w,
    h,
    28
  );

  ctx.stroke();

  /*
   * Icon
   */
  text(
    ctx,
    icon,
    left + 38,
    top + 36,
    21,
    color,
    900,
    'center'
  );

  /*
   * Label
   */
  text(
    ctx,
    label,
    left + 112,
    top + 36,
    17,
    COLORS.tealDark,
    900,
    'center'
  );

  ctx.restore();
}

function drawTaglinesAndIcons(
  ctx: CanvasRenderingContext2D
) {
  drawTag(
    ctx,
    '#CODER',
    '</>',
    155,
    555,
    COLORS.tealDark
  );

  drawTag(
    ctx,
    '#TESTER',
    '✓',
    155,
    720,
    COLORS.coral
  );

  drawTag(
    ctx,
    '#BUILDER',
    '⚡',
    CARD_WIDTH - 155,
    555,
    COLORS.tealDark
  );

  drawTag(
    ctx,
    '#CREATOR',
    '✦',
    CARD_WIDTH - 155,
    720,
    COLORS.coral
  );
}

/* ================================================== */
/* IDENTITY                                           */
/* ================================================== */

function drawIdentity(
  ctx: CanvasRenderingContext2D,
  data: CardData,
  photoBottomY: number
) {
  const centerX =
    CARD_WIDTH / 2;

  /*
   * Name starts directly below photo.
   */
  const nameY =
    photoBottomY + 38;

  const name =
    (
      data.name ||
      'YOUR NAME'
    ).toUpperCase();

  let nameSize = 70;

  ctx.font =
    `900 ${nameSize}px "Poppins", Arial, sans-serif`;

  while (
    ctx.measureText(name).width >
      600 &&
    nameSize > 42
  ) {
    nameSize -= 2;

    ctx.font =
      `900 ${nameSize}px "Poppins", Arial, sans-serif`;
  }

  const nameWidth =
    Math.min(
      ctx.measureText(name).width + 75,
      680
    );

  const nameHeight = 84;

  const nameX =
    centerX -
    nameWidth / 2;

  /*
   * Name frame
   */
  ctx.fillStyle =
    COLORS.tealDark;

  roundRect(
    ctx,
    nameX,
    nameY,
    nameWidth,
    nameHeight,
    24
  );

  ctx.fill();

  text(
    ctx,
    name,
    centerX,
    nameY + 58,
    nameSize,
    COLORS.white,
    900,
    'center'
  );

  /*
   * Builder role
   */
  const role =
    (
      data.role ||
      'BUILDER'
    ).toUpperCase();

  const roleY =
    nameY +
    nameHeight +
    42;

  ctx.font =
    '900 22px "Poppins", Arial, sans-serif';

  const roleWidth =
    Math.max(
      145,
      ctx.measureText(role).width + 55
    );

  /*
   * Small gold pill
   */
  ctx.fillStyle =
    COLORS.mango;

  roundRect(
    ctx,
    centerX - roleWidth / 2,
    roleY - 27,
    roleWidth,
    48,
    24
  );

  ctx.fill();

  text(
    ctx,
    role,
    centerX,
    roleY + 5,
    21,
    COLORS.ink,
    900,
    'center'
  );

  /*
   * Small decorative lines
   */
  line(
    ctx,
    centerX - 210,
    roleY - 3,
    centerX - roleWidth / 2 - 18,
    roleY - 3,
    COLORS.tealDark,
    2
  );

  line(
    ctx,
    centerX + roleWidth / 2 + 18,
    roleY - 3,
    centerX + 210,
    roleY - 3,
    COLORS.tealDark,
    2
  );

  return roleY + 26;
}

/* ================================================== */
/* BUILDER CLASS                                      */
/* ================================================== */

function drawBuilderClass(
  ctx: CanvasRenderingContext2D,
  data: CardData,
  y: number
) {
  const centerX =
    CARD_WIDTH / 2;

  /*
   * Smaller frame
   */
  const w = 430;
  const h = 135;

  const x =
    centerX - w / 2;

  /*
   * Main frame
   */
  ctx.fillStyle =
    COLORS.tealDark;

  roundRect(
    ctx,
    x,
    y,
    w,
    h,
    24
  );

  ctx.fill();

  /*
   * Pink strip removed.
   */

  /*
   * Builder class label
   */
  text(
    ctx,
    'BUILDER CLASS',
    centerX,
    y + 30,
    13,
    COLORS.mango,
    900,
    'center'
  );

  /*
   * Builder title
   */
  const title =
    (
      data.builderTitle ||
      'THE BUILDER'
    ).toUpperCase();

  let size = 40;

  ctx.font =
    `900 ${size}px "Poppins", Arial, sans-serif`;

  while (
    ctx.measureText(title).width >
      w - 65 &&
    size > 25
  ) {
    size -= 1;

    ctx.font =
      `900 ${size}px "Poppins", Arial, sans-serif`;
  }

  text(
    ctx,
    title,
    centerX,
    y + 74,
    size,
    COLORS.white,
    900,
    'center'
  );

  /*
   * Bottom pills
   */
  const tags = [
    {
      label: 'BUILD',
      color: COLORS.aqua,
    },
    {
      label: 'SHIP',
      color: COLORS.coral,
    },
    {
      label: 'CREATE',
      color: '#54B6A5',
    },
  ];

  const pillW = 95;
  const pillH = 30;
  const gap = 15;

  const totalW =
    pillW * 3 +
    gap * 2;

  let tx =
    centerX -
    totalW / 2;

  tags.forEach((tag) => {
    ctx.fillStyle =
      tag.color;

    roundRect(
      ctx,
      tx,
      y + 92,
      pillW,
      pillH,
      15
    );

    ctx.fill();

    text(
      ctx,
      tag.label,
      tx + pillW / 2,
      y + 113,
      12,
      COLORS.white,
      900,
      'center'
    );

    tx +=
      pillW + gap;
  });

  return y + h;
}

/* ================================================== */
/* BARCODE                                            */
/* ================================================== */

function drawBarcode(
  ctx: CanvasRenderingContext2D,
  seed: string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  let s = 0;

  for (
    let i = 0;
    i < seed.length;
    i++
  ) {
    s =
      (
        s * 31 +
        seed.charCodeAt(i)
      ) >>> 0;
  }

  const rand = () => {
    s =
      (
        s * 1664525 +
        1013904223
      ) >>> 0;

    return s / 0xffffffff;
  };

  ctx.fillStyle =
    COLORS.white;

  let currentX = x;

  while (
    currentX <
    x + w
  ) {
    const barWidth =
      2 +
      Math.floor(
        rand() * 4
      );

    if (
      rand() > 0.3
    ) {
      ctx.fillRect(
        currentX,
        y,
        barWidth,
        h
      );
    }

    currentX +=
      barWidth + 3;
  }
}

/* ================================================== */
/* FOOTER                                             */
/* ================================================== */

async function drawFooter(
  ctx: CanvasRenderingContext2D,
  builderId: string,
  hackerHouse: LoadedImage | null,
  pm247: LoadedImage | null
) {
  /*
   * Footer
   * Completely inside card.
   */
  const footerH = 225;
  const footerY =
    CARD_HEIGHT - footerH;

  /*
   * Dark teal footer background
   */
  ctx.save();

  ctx.fillStyle =
    COLORS.tealDark;

  ctx.beginPath();

  ctx.moveTo(
    0,
    footerY + 38
  );

  for (
    let x = 0;
    x <= CARD_WIDTH;
    x += 30
  ) {
    const wave =
      Math.sin(x / 55) * 16;

    ctx.lineTo(
      x,
      footerY + 38 + wave
    );
  }

  ctx.lineTo(
    CARD_WIDTH,
    CARD_HEIGHT
  );

  ctx.lineTo(
    0,
    CARD_HEIGHT
  );

  ctx.closePath();

  ctx.fill();

  ctx.restore();

  /*
   * Left section
   */
  if (hackerHouse) {
    drawImageContain(
      ctx,
      hackerHouse,
      45,
      footerY + 48,
      245,
      72
    );
  } else {
    text(
      ctx,
      'HACKER HOUSE',
      55,
      footerY + 92,
      28,
      COLORS.white,
      900
    );
  }

  text(
    ctx,
    '#FrameInGoa',
    58,
    footerY + 140,
    15,
    COLORS.mango,
    800
  );

  text(
    ctx,
    'hhgoa.com',
    58,
    footerY + 168,
    13,
    COLORS.white,
    600
  );

  /*
   * Left separator
   */
  line(
    ctx,
    330,
    footerY + 48,
    330,
    CARD_HEIGHT - 28,
    'rgba(255,255,255,0.35)',
    2
  );

  /*
   * Center QR code
   */
  try {
    const qrDataUrl =
      await QRCode.toDataURL(
        'https://hhgoa.com',
        {
          margin: 0,
          color: {
            dark: COLORS.tealDark,
            light: '#FBF3E100',
          },
          width: 300,
        }
      );

    const qrImg =
      await loadImage(qrDataUrl);

    const qrSize = 135;

    const qrX =
      CARD_WIDTH / 2 -
      qrSize / 2;

    const qrY =
      footerY + 55;

    /*
     * White QR card
     */
    ctx.fillStyle =
      COLORS.white;

    roundRect(
      ctx,
      qrX - 12,
      qrY - 12,
      qrSize + 24,
      qrSize + 24,
      18
    );

    ctx.fill();

    /*
     * Gold QR border
     */
    ctx.strokeStyle =
      COLORS.mango;

    ctx.lineWidth = 4;

    roundRect(
      ctx,
      qrX - 12,
      qrY - 12,
      qrSize + 24,
      qrSize + 24,
      18
    );

    ctx.stroke();

    /*
     * QR
     */
    ctx.drawImage(
      qrImg,
      qrX,
      qrY,
      qrSize,
      qrSize
    );
  } catch {
    // Ignore QR generation errors
  }

  /*
   * Right separator
   */
  line(
    ctx,
    750,
    footerY + 48,
    750,
    CARD_HEIGHT - 28,
    'rgba(255,255,255,0.35)',
    2
  );

  /*
   * Right section
   */
  const rightX = 800;

  /*
   * Hosted by
   */
  text(
    ctx,
    'HOSTED BY',
    rightX,
    footerY + 62,
    12,
    COLORS.white,
    800,
    'left'
  );

  /*
   * 2:47 PM STUDIO
   */
  if (pm247) {
    drawImageContain(
      ctx,
      pm247,
      rightX - 5,
      footerY + 68,
      165,
      58
    );
  } else {
    text(
      ctx,
      '2:47',
      rightX,
      footerY + 105,
      34,
      COLORS.mango,
      900
    );

    text(
      ctx,
      'PM',
      rightX + 88,
      footerY + 104,
      13,
      COLORS.mango,
      900
    );

    text(
      ctx,
      'STUDIO',
      rightX,
      footerY + 133,
      18,
      COLORS.mango,
      900
    );
  }

  /*
   * Builder ID
   */
  text(
    ctx,
    'BUILDER ID',
    rightX,
    footerY + 158,
    11,
    'rgba(255,255,255,0.75)',
    800
  );

  text(
    ctx,
    builderId,
    rightX,
    footerY + 180,
    18,
    COLORS.white,
    900
  );

  /*
   * Barcode
   */
  drawBarcode(
    ctx,
    builderId,
    rightX,
    footerY + 188,
    175,
    14
  );

  /*
   * Safety line
   */
  line(
    ctx,
    45,
    CARD_HEIGHT - 22,
    CARD_WIDTH - 45,
    CARD_HEIGHT - 22,
    'rgba(255,255,255,0.10)',
    2
  );
}

/* ================================================== */
/* VIGNETTE                                           */
/* ================================================== */

function drawVignette(
  ctx: CanvasRenderingContext2D
) {
  const gradient =
    ctx.createRadialGradient(
      CARD_WIDTH / 2,
      CARD_HEIGHT / 2 - 60,
      360,
      CARD_WIDTH / 2,
      CARD_HEIGHT / 2 - 60,
      920
    );

  gradient.addColorStop(
    0,
    'rgba(6,53,47,0)'
  );

  gradient.addColorStop(
    1,
    'rgba(6,53,47,0.08)'
  );

  ctx.save();

  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    0,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  ctx.restore();
}

/* ================================================== */
/* FONT LOADER                                        */
/* ================================================== */

export async function ensureFontsReady() {
  if (
    typeof document ===
    'undefined'
  ) {
    return;
  }

  try {
    await Promise.all([
      document.fonts.load(
        '900 80px "Poppins"'
      ),

      document.fonts.load(
        '900 110px "Anton"'
      ),

      document.fonts.load(
        '900 90px "Baloo Bhai 2"'
      ),
    ]);
  } catch {
    // fallback fonts
  }

  try {
    await document.fonts.ready;
  } catch {
    // ignore
  }
}

/* ================================================== */
/* MAIN CARD DRAW                                     */
/* ================================================== */

export async function drawBuilderCard(
  canvas: HTMLCanvasElement,
  data: CardData
) {
  canvas.width =
    CARD_WIDTH;

  canvas.height =
    CARD_HEIGHT;

  const ctx =
    canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  await ensureFontsReady();

  const assets =
    await loadCardAssets();

  ctx.clearRect(
    0,
    0,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  /*
   * 1. BACKGROUND
   */
  drawBackground(
    ctx,
    assets.background
  );

  /*
   * 2. HEADER
   */
  drawHeader(
    ctx,
    assets.hackerHouse,
    assets.goaLogo
  );

  /*
   * 3. PHOTO
   */
  const photoCy = 640;
  const photoR = 215;

  drawPhotoFrame(
    ctx,
    data.photo,
    CARD_WIDTH / 2,
    photoCy,
    photoR
  );

  /*
   * 4. TAGS
   */
  drawTaglinesAndIcons(ctx);

  /*
   * 5. NAME + ROLE
   */
  const identityBottom =
    drawIdentity(
      ctx,
      data,
      photoCy + photoR
    );

  /*
   * 6. BUILDER CLASS
   */
  drawBuilderClass(
    ctx,
    data,
    identityBottom + 18
  );

  /*
   * GOA STRIP REMOVED
   */

  /*
   * 7. FOOTER
   */
  await drawFooter(
    ctx,
    data.builderId,
    assets.hackerHouse,
    assets.pm247
  );

  /*
   * 8. VIGNETTE
   */
  drawVignette(ctx);

  /*
   * 9. FINAL BORDER
   * CHANGED TO GOLDEN
   */
  /*
 * 9. FINAL GOLDEN BORDER
 */
ctx.save();

ctx.shadowColor = 'rgba(255,194,60,0.60)';
ctx.shadowBlur = 30;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;

ctx.strokeStyle =
  COLORS.mango;

ctx.lineWidth = 14;

roundRect(
  ctx,
  18,
  18,
  CARD_WIDTH - 36,
  CARD_HEIGHT - 36,
  38
);

ctx.stroke();

ctx.restore();
}