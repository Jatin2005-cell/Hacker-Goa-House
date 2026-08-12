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

/* -------------------------------------------------- */
/* BASIC HELPERS                                      */
/* -------------------------------------------------- */

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

/* -------------------------------------------------- */
/* IMAGE LOADER                                       */
/* -------------------------------------------------- */

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
    indiaGate: null as LoadedImage | null,
    hackerHouse: null as LoadedImage | null,
    goaLogo: null as LoadedImage | null,
    pm247: null as LoadedImage | null,
  };

  const results = await Promise.allSettled([
    loadImage('/card-assets/background.png'),
    loadImage('/card-assets/india-gate.webp'),
    loadImage('/card-assets/hacker-house.png'),
    loadImage('/card-assets/goa_hindi.svg'),
    loadImage('/card-assets/2-47.svg'),
  ]);

  if (results[0].status === 'fulfilled') {
    assets.background = results[0].value;
  }

  if (results[1].status === 'fulfilled') {
    assets.indiaGate = results[1].value;
  }

  if (results[2].status === 'fulfilled') {
    assets.hackerHouse = results[2].value;
  }

  if (results[3].status === 'fulfilled') {
    assets.goaLogo = results[3].value;
  }

  if (results[4].status === 'fulfilled') {
    assets.pm247 = results[4].value;
  }

  return assets;
}

/* -------------------------------------------------- */
/* IMAGE HELPERS                                      */
/* -------------------------------------------------- */

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

/* -------------------------------------------------- */
/* BACKGROUND                                         */
/* -------------------------------------------------- */

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

    ctx.globalAlpha = 0.62;

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

    const darkOverlay =
      ctx.createLinearGradient(
        0,
        0,
        0,
        CARD_HEIGHT
      );

    darkOverlay.addColorStop(
      0,
      'rgba(6,53,47,0.24)'
    );

    darkOverlay.addColorStop(
      0.35,
      'rgba(6,53,47,0.16)'
    );

    darkOverlay.addColorStop(
      0.65,
      'rgba(6,53,47,0.12)'
    );

    darkOverlay.addColorStop(
      1,
      'rgba(6,53,47,0.28)'
    );

    ctx.fillStyle = darkOverlay;

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
      'rgba(251,243,225,0.08)'
    );

    readability.addColorStop(
      0.45,
      'rgba(251,243,225,0.02)'
    );

    readability.addColorStop(
      0.75,
      'rgba(251,243,225,0.04)'
    );

    readability.addColorStop(
      1,
      'rgba(251,243,225,0.10)'
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

  ctx.fillStyle =
    'rgba(14,76,67,0.055)';

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
        1.3,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  }

  ctx.save();

  ctx.strokeStyle =
    'rgba(14,76,67,0.045)';

  ctx.lineWidth = 2;

  for (
    let i = -CARD_HEIGHT;
    i < CARD_WIDTH;
    i += 45
  ) {
    ctx.beginPath();

    ctx.moveTo(
      i,
      0
    );

    ctx.lineTo(
      i + CARD_HEIGHT,
      CARD_HEIGHT
    );

    ctx.stroke();
  }

  ctx.restore();

  ctx.save();

  ctx.strokeStyle =
    'rgba(53,176,160,0.10)';

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
        500 +
        i * 28 +
        Math.sin(x / 90 + i) * 18;

      if (x === 60) {
        ctx.moveTo(
          x,
          y
        );
      } else {
        ctx.lineTo(
          x,
          y
        );
      }
    }

    ctx.stroke();
  }

  ctx.restore();

  ctx.strokeStyle =
    COLORS.teal;

  ctx.lineWidth = 7;

  roundRect(
    ctx,
    18,
    18,
    CARD_WIDTH - 36,
    CARD_HEIGHT - 36,
    38
  );

  ctx.stroke();

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

/* -------------------------------------------------- */
/* DECORATIVE SHAPES                                 */
/* -------------------------------------------------- */

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

function drawSun(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale = 1
) {
  ctx.save();

  ctx.translate(x, y);

  ctx.scale(
    scale,
    scale
  );

  ctx.strokeStyle =
    COLORS.mango;

  ctx.lineWidth = 5;

  for (
    let i = 0;
    i < 12;
    i++
  ) {
    const a =
      (Math.PI * 2 * i) / 12;

    ctx.beginPath();

    ctx.moveTo(
      Math.cos(a) * 40,
      Math.sin(a) * 40
    );

    ctx.lineTo(
      Math.cos(a) * 56,
      Math.sin(a) * 56
    );

    ctx.stroke();
  }

  ctx.fillStyle =
    COLORS.mango;

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    30,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();
}

/* -------------------------------------------------- */
/* FLIGHT PATH                                       */
/* -------------------------------------------------- */

function drawFlightPath(
  ctx: CanvasRenderingContext2D
) {
  ctx.save();

  ctx.strokeStyle =
    COLORS.coral;

  ctx.globalAlpha = 0.4;

  ctx.lineWidth = 2.5;

  ctx.setLineDash([
    3,
    9
  ]);

  ctx.beginPath();

  ctx.moveTo(
    150,
    155
  );

  ctx.quadraticCurveTo(
    CARD_WIDTH / 2,
    40,
    CARD_WIDTH - 150,
    155
  );

  ctx.stroke();

  ctx.setLineDash([]);

  ctx.restore();

  ctx.save();

  ctx.font =
    '30px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  ctx.textAlign =
    'center';

  ctx.textBaseline =
    'middle';

  ctx.translate(
    CARD_WIDTH / 2,
    70
  );

  ctx.rotate(0.25);

  ctx.fillText(
    '✈️',
    0,
    0
  );

  ctx.restore();
}

/* -------------------------------------------------- */
/* HEADER                                             */
/* -------------------------------------------------- */

function drawHeader(
  ctx: CanvasRenderingContext2D,
  hackerHouse: LoadedImage | null,
  goaLogo: LoadedImage | null
) {
  const centerX =
    CARD_WIDTH / 2;

  text(
    ctx,
    'HH / GOA / 26',
    80,
    94,
    17,
    COLORS.teal,
    900
  );

  text(
    ctx,
    'OCT 28 — 31',
    CARD_WIDTH - 80,
    94,
    17,
    COLORS.teal,
    900,
    'right'
  );

  if (hackerHouse) {
    drawImageContain(
      ctx,
      hackerHouse,
      centerX - 320,
      115,
      640,
      145
    );
  } else {
    text(
      ctx,
      'HACKER HOUSE',
      centerX,
      220,
      82,
      COLORS.teal,
      900,
      'center'
    );
  }

  if (goaLogo) {
    drawImageContain(
      ctx,
      goaLogo,
      centerX - 38,
      158,
      115,
      70
    );
  }

  drawStar(
    ctx,
    centerX - 360,
    205,
    14,
    6,
    COLORS.mango,
    -10
  );

  drawStar(
    ctx,
    centerX + 360,
    205,
    14,
    6,
    COLORS.coral,
    12
  );

  ctx.strokeStyle =
    COLORS.mango;

  ctx.lineWidth = 7;

  ctx.lineCap =
    'round';

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

  text(
    ctx,
    'A BUILDER ID FOR THE PEOPLE WHO SHIP',
    centerX,
    318,
    18,
    COLORS.ink,
    900,
    'center'
  );

  ctx.fillStyle =
    COLORS.coral;

  roundRect(
    ctx,
    centerX - 125,
    335,
    250,
    58,
    29
  );

  ctx.fill();

  text(
    ctx,
    'GOA · 2026',
    centerX,
    373,
    20,
    COLORS.white,
    900,
    'center'
  );

  line(
    ctx,
    70,
    414,
    CARD_WIDTH - 70,
    414,
    'rgba(14,76,67,0.30)',
    2
  );
}

/* -------------------------------------------------- */
/* PHOTO FRAME                                       */
/* -------------------------------------------------- */

function drawPhotoFrame(
  ctx: CanvasRenderingContext2D,
  photo: ImageBitmap | HTMLImageElement | null,
  cx: number,
  cy: number,
  r: number
) {
  ctx.save();

  ctx.strokeStyle =
    'rgba(255,90,110,0.20)';

  ctx.lineWidth = 20;

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    r + 25,
    0,
    Math.PI * 2
  );

  ctx.stroke();

  ctx.restore();

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
    r + 22,
    0,
    Math.PI * 2
  );

  ctx.stroke();

  ctx.restore();

  ctx.strokeStyle =
    COLORS.mango;

  ctx.lineWidth = 9;

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    r + 10,
    0,
    Math.PI * 2
  );

  ctx.stroke();

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
      cy - 4,
      18,
      COLORS.teal,
      900,
      'center'
    );

    text(
      ctx,
      'YOUR PHOTO',
      cx,
      cy + 30,
      14,
      COLORS.muted,
      800,
      'center'
    );
  }

  ctx.restore();

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

  const badgeW = 170;
  const badgeH = 58;

  const bx =
    cx + r - 15;

  const by =
    cy - r + 20;

  ctx.fillStyle =
    COLORS.tealDark;

  roundRect(
    ctx,
    bx,
    by,
    badgeW,
    badgeH,
    14
  );

  ctx.fill();

  text(
    ctx,
    'ACCESS',
    bx + badgeW / 2,
    by + 24,
    12,
    COLORS.mango,
    900,
    'center'
  );

  text(
    ctx,
    'GRANTED ✓',
    bx + badgeW / 2,
    by + 45,
    13,
    COLORS.white,
    900,
    'center'
  );

  const badge2W = 170;
  const badge2H = 58;

  const bx2 =
    cx - r - badge2W + 15;

  const by2 =
    cy + r - 45;

  ctx.fillStyle =
    COLORS.coral;

  roundRect(
    ctx,
    bx2,
    by2,
    badge2W,
    badge2H,
    14
  );

  ctx.fill();

  text(
    ctx,
    'STATUS',
    bx2 + badge2W / 2,
    by2 + 24,
    12,
    COLORS.mango,
    900,
    'center'
  );

  text(
    ctx,
    'VERIFIED ✓',
    bx2 + badge2W / 2,
    by2 + 45,
    13,
    COLORS.white,
    900,
    'center'
  );
}

/* -------------------------------------------------- */
/* SMALL TAGLINES + BUILDER ICONS                     */
/* -------------------------------------------------- */

function drawTaglinesAndIcons(
  ctx: CanvasRenderingContext2D
) {
  const tags = [
    {
      label: '#CODER',
      icon: '</>',
      x: 105,
      y: 535,
      color: COLORS.tealDark,
    },
    {
      label: '#TESTER',
      icon: '✓',
      x: 105,
      y: 655,
      color: COLORS.coral,
    },
    {
      label: '#BUILDER',
      icon: '⚡',
      x: 975,
      y: 535,
      color: COLORS.tealDark,
    },
    {
      label: '#CREATOR',
      icon: '✦',
      x: 975,
      y: 655,
      color: COLORS.coral,
    },
  ];

  tags.forEach((tag) => {
    ctx.save();

    /*
     * Larger rounded tag frame
     */
    const tagW = 155;
    const tagH = 48;

    const tagX =
      tag.x - tagW / 2;

    const tagY =
      tag.y - tagH / 2;

    /*
     * Soft background
     */
    ctx.fillStyle =
      'rgba(251,243,225,0.94)';

    roundRect(
      ctx,
      tagX,
      tagY,
      tagW,
      tagH,
      24
    );

    ctx.fill();

    /*
     * Strong frame
     */
    ctx.strokeStyle =
      tag.color;

    ctx.lineWidth = 3;

    roundRect(
      ctx,
      tagX,
      tagY,
      tagW,
      tagH,
      24
    );

    ctx.stroke();

    /*
     * Icon
     */
    text(
      ctx,
      tag.icon,
      tagX + 27,
      tagY + 32,
      18,
      tag.color,
      900,
      'center'
    );

    /*
     * Tagline
     */
    text(
      ctx,
      tag.label,
      tagX + 88,
      tagY + 31,
      14,
      COLORS.tealDark,
      900,
      'center'
    );

    ctx.restore();
  });
}

/* -------------------------------------------------- */
/* IDENTITY                                           */
/* -------------------------------------------------- */

function drawIdentity(
  ctx: CanvasRenderingContext2D,
  data: CardData,
  photoBottomY: number
) {
  const centerX =
    CARD_WIDTH / 2;

  /*
   * BUILDER label removed.
   * Name starts directly below photo.
   */
  const y =
    photoBottomY + 42;

  const name =
    (
      data.name ||
      'YOUR NAME'
    ).toUpperCase();

  let nameSize = 82;

  ctx.font =
    `900 ${nameSize}px "Poppins", Arial, sans-serif`;

  while (
    ctx.measureText(name).width >
      720 &&
    nameSize > 44
  ) {
    nameSize -= 2;

    ctx.font =
      `900 ${nameSize}px "Poppins", Arial, sans-serif`;
  }

  const nameWidth =
    Math.min(
      ctx.measureText(name).width + 100,
      820
    );

  const nameHeight = 96;

  const nameX =
    centerX -
    nameWidth / 2;

  const nameY =
    y;

  ctx.fillStyle =
    COLORS.tealDark;

  roundRect(
    ctx,
    nameX,
    nameY,
    nameWidth,
    nameHeight,
    28
  );

  ctx.fill();

  ctx.fillStyle =
    COLORS.coral;

  roundRect(
    ctx,
    nameX + 22,
    nameY - 7,
    100,
    10,
    5
  );

  ctx.fill();

  text(
    ctx,
    name,
    centerX,
    nameY + 67,
    nameSize,
    COLORS.white,
    900,
    'center'
  );

  const roleY =
    nameY +
    nameHeight +
    48;

  const role =
    (
      data.role ||
      'BUILDER'
    ).toUpperCase();

  ctx.font =
    '800 26px "Poppins", Arial, sans-serif';

  const roleWidth =
    ctx.measureText(role).width +
    72;

  ctx.fillStyle =
    COLORS.mango;

  roundRect(
    ctx,
    centerX -
      roleWidth / 2,
    roleY - 34,
    roleWidth,
    52,
    26
  );

  ctx.fill();

  text(
    ctx,
    role,
    centerX,
    roleY,
    25,
    COLORS.ink,
    900,
    'center'
  );

  return roleY + 30;
}

/* -------------------------------------------------- */
/* BUILDER CLASS                                      */
/* -------------------------------------------------- */

function drawBuilderClass(
  ctx: CanvasRenderingContext2D,
  data: CardData,
  y: number
) {
  const centerX =
    CARD_WIDTH / 2;

  const x = 250;
  const w = CARD_WIDTH - 500;
  const h = 145;

  ctx.fillStyle =
    COLORS.tealDark;

  roundRect(
    ctx,
    x,
    y,
    w,
    h,
    26
  );

  ctx.fill();

  ctx.fillStyle =
    COLORS.coral;

  roundRect(
    ctx,
    x + 20,
    y + 20,
    8,
    105,
    4
  );

  ctx.fill();

  ctx.fillStyle =
    COLORS.mango;

  roundRect(
    ctx,
    centerX - 65,
    y,
    130,
    8,
    4
  );

  ctx.fill();

  text(
    ctx,
    'BUILDER CLASS',
    centerX,
    y + 38,
    16,
    COLORS.mango,
    900,
    'center'
  );

  const title =
    (
      data.builderTitle ||
      'THE BUILDER'
    ).toUpperCase();

  let size = 48;

  ctx.font =
    `900 ${size}px "Poppins", Arial, sans-serif`;

  while (
    ctx.measureText(title).width >
      w - 90 &&
    size > 26
  ) {
    size -= 2;

    ctx.font =
      `900 ${size}px "Poppins", Arial, sans-serif`;
  }

  text(
    ctx,
    title,
    centerX,
    y + 88,
    size,
    COLORS.white,
    900,
    'center'
  );

  const tags = [
    {
      label: 'BUILD',
      color: COLORS.teal,
    },
    {
      label: 'SHIP',
      color: COLORS.coral,
    },
    {
      label: 'CREATE',
      color: COLORS.aqua,
    },
  ];

  ctx.font =
    '800 12px "Poppins", Arial, sans-serif';

  const tagWidths =
    tags.map(
      (tag) =>
        ctx.measureText(
          tag.label
        ).width + 28
    );

  const tagsTotalWidth =
    tagWidths.reduce(
      (a, b) => a + b,
      0
    ) + 20;

  let tx =
    centerX -
    tagsTotalWidth / 2;

  tags.forEach(
    (tag, i) => {
      const tw =
        tagWidths[i];

      ctx.fillStyle =
        tag.color;

      roundRect(
        ctx,
        tx,
        y + 108,
        tw,
        27,
        13
      );

      ctx.fill();

      text(
        ctx,
        tag.label,
        tx + tw / 2,
        y + 127,
        12,
        COLORS.white,
        900,
        'center'
      );

      tx +=
        tw + 10;
    }
  );

  return y + h;
}

/* -------------------------------------------------- */
/* DECORATIVE BUILDER ICONS                           */
/* -------------------------------------------------- */

function drawBuilderBackgroundIcons(
  ctx: CanvasRenderingContext2D,
  y: number
) {
  ctx.save();

  ctx.globalAlpha =
    0.14;

  const icons = [
    {
      icon: '</>',
      x: 125,
      y: y + 45,
      size: 52,
      rotation: -0.10,
    },
    {
      icon: '{}',
      x: 190,
      y: y + 105,
      size: 34,
      rotation: -0.08,
    },
    {
      icon: '⚡',
      x: 925,
      y: y + 45,
      size: 54,
      rotation: 0.08,
    },
    {
      icon: '01',
      x: 975,
      y: y + 105,
      size: 32,
      rotation: 0,
    },
    {
      icon: '↗',
      x: 135,
      y: y + 165,
      size: 42,
      rotation: -0.08,
    },
    {
      icon: '⌘',
      x: 940,
      y: y + 175,
      size: 44,
      rotation: 0.08,
    },
  ];

  icons.forEach(
    (item) => {
      ctx.save();

      ctx.translate(
        item.x,
        item.y
      );

      ctx.rotate(
        item.rotation
      );

      ctx.font =
        `900 ${item.size}px "Poppins", Arial, sans-serif`;

      ctx.textAlign =
        'center';

      ctx.textBaseline =
        'middle';

      ctx.fillStyle =
        COLORS.teal;

      ctx.fillText(
        item.icon,
        0,
        0
      );

      ctx.restore();
    }
  );

  ctx.restore();
}

/* -------------------------------------------------- */
/* INDIA GATE                                         */
/* -------------------------------------------------- */

function drawIndiaGateBackground(
  ctx: CanvasRenderingContext2D,
  image: LoadedImage | null,
  y: number
) {
  if (!image) return;

  const centerX =
    CARD_WIDTH / 2;

  ctx.save();

  ctx.globalAlpha = 0.30;

  ctx.filter =
    'blur(0.5px)';

  drawImageContain(
    ctx,
    image,
    centerX - 235,
    y - 15,
    470,
    190
  );

  ctx.restore();

  ctx.save();

  const fade =
    ctx.createLinearGradient(
      0,
      y - 15,
      0,
      y + 175
    );

  fade.addColorStop(
    0,
    'rgba(251,243,225,0.25)'
  );

  fade.addColorStop(
    0.5,
    'rgba(251,243,225,0)'
  );

  fade.addColorStop(
    1,
    'rgba(251,243,225,0.30)'
  );

  ctx.fillStyle =
    fade;

  ctx.fillRect(
    centerX - 245,
    y - 20,
    490,
    210
  );

  ctx.restore();
}

/* -------------------------------------------------- */
/* GOA STRIP                                          */
/* -------------------------------------------------- */

function drawGoaStrip(
  ctx: CanvasRenderingContext2D,
  y: number
) {
  line(
    ctx,
    250,
    y,
    CARD_WIDTH - 250,
    y,
    'rgba(14,76,67,0.25)',
    2
  );

  drawSun(
    ctx,
    300,
    y + 48,
    0.4
  );

  text(
    ctx,
    'GOA',
    300,
    y + 88,
    14,
    COLORS.tealDark,
    900,
    'center'
  );

  text(
    ctx,
    'BUILD · SHIP · REPEAT',
    540,
    y + 70,
    16,
    COLORS.teal,
    900,
    'center'
  );

  text(
    ctx,
    '28—31 OCT 2026',
    780,
    y + 70,
    15,
    COLORS.tealDark,
    900,
    'center'
  );

  return y + 105;
}

/* -------------------------------------------------- */
/* BARCODE                                            */
/* -------------------------------------------------- */

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

    return s /
      0xffffffff;
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

/* -------------------------------------------------- */
/* FOOTER                                             */
/* -------------------------------------------------- */

async function drawFooter(
  ctx: CanvasRenderingContext2D,
  builderId: string,
  hackerHouse: LoadedImage | null,
  pm247: LoadedImage | null
) {
  const footerY =
    CARD_HEIGHT - 190;

  ctx.fillStyle =
    COLORS.tealDark;

  ctx.beginPath();

  ctx.moveTo(
    0,
    footerY + 35
  );

  for (
    let x = 0;
    x <= CARD_WIDTH;
    x += 35
  ) {
    const wave =
      Math.sin(x / 55) * 18;

    ctx.lineTo(
      x,
      footerY +
        35 +
        wave
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

  if (hackerHouse) {
    drawImageContain(
      ctx,
      hackerHouse,
      55,
      footerY + 52,
      235,
      72
    );
  } else {
    text(
      ctx,
      'HACKER HOUSE GOA',
      70,
      footerY + 76,
      17,
      COLORS.white,
      900
    );
  }

  text(
    ctx,
    '#FrameInGoa',
    70,
    footerY + 135,
    14,
    COLORS.mango,
    800
  );

  text(
    ctx,
    'hhgoa.com',
    70,
    footerY + 160,
    12,
    'rgba(255,255,255,0.70)',
    600
  );

  if (pm247) {
    drawImageContain(
      ctx,
      pm247,
      360,
      footerY + 50,
      190,
      105
    );
  } else {
    text(
      ctx,
      '2:47 PM',
      400,
      footerY + 104,
      15,
      COLORS.white,
      800
    );

    text(
      ctx,
      'STUDIO',
      400,
      footerY + 130,
      13,
      'rgba(255,255,255,0.72)',
      700
    );
  }

  text(
    ctx,
    '28–31 OCTOBER',
    570,
    footerY + 76,
    15,
    COLORS.mango,
    900
  );

  text(
    ctx,
    'BUILDER ID',
    570,
    footerY + 104,
    12,
    'rgba(255,255,255,0.65)',
    800
  );

  text(
    ctx,
    builderId,
    570,
    footerY + 128,
    18,
    COLORS.white,
    900
  );

  drawBarcode(
    ctx,
    builderId,
    570,
    footerY + 140,
    170,
    20
  );

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
          width: 220,
        }
      );

    const qrImg =
      await loadImage(
        qrDataUrl
      );

    const size = 95;

    const qx =
      CARD_WIDTH -
      80 -
      size;

    const qy =
      footerY + 62;

    ctx.fillStyle =
      COLORS.white;

    roundRect(
      ctx,
      qx - 8,
      qy - 8,
      size + 16,
      size + 16,
      10
    );

    ctx.fill();

    ctx.drawImage(
      qrImg,
      qx,
      qy,
      size,
      size
    );
  } catch {
    // ignored
  }
}

/* -------------------------------------------------- */
/* VIGNETTE                                           */
/* -------------------------------------------------- */

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
    'rgba(6,53,47,0.10)'
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

/* -------------------------------------------------- */
/* FONT LOADER                                        */
/* -------------------------------------------------- */

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

/* -------------------------------------------------- */
/* MAIN CARD DRAW                                     */
/* -------------------------------------------------- */

export async function drawBuilderCard(
  canvas: HTMLCanvasElement,
  data: CardData
) {
  canvas.width =
    CARD_WIDTH;

  canvas.height =
    CARD_HEIGHT;

  const ctx =
    canvas.getContext(
      '2d'
    );

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
   * 2. FLIGHT PATH
   */

  drawFlightPath(ctx);

  /*
   * 3. HEADER
   */

  drawHeader(
    ctx,
    assets.hackerHouse,
    assets.goaLogo
  );

  /*
   * 4. PHOTO
   */

  const photoCy = 625;
  const photoR = 215;

  drawPhotoFrame(
    ctx,
    data.photo,
    CARD_WIDTH / 2,
    photoCy,
    photoR
  );

  /*
   * 4.5 TAGLINES
   */

  drawTaglinesAndIcons(ctx);

  /*
   * 5. IDENTITY
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

  const classBottom =
    drawBuilderClass(
      ctx,
      data,
      identityBottom + 18
    );

  /*
   * 7. DECORATIVE ICONS
   */

  drawBuilderBackgroundIcons(
    ctx,
    classBottom + 5
  );

  /*
   * 8. INDIA GATE
   */

  drawIndiaGateBackground(
    ctx,
    assets.indiaGate,
    classBottom + 22
  );

  /*
   * 9. GOA STRIP
   */

  drawGoaStrip(
    ctx,
    classBottom + 205
  );

  /*
   * 10. FOOTER
   */

  await drawFooter(
    ctx,
    data.builderId,
    assets.hackerHouse,
    assets.pm247
  );

  /*
   * 11. VIGNETTE
   */

  drawVignette(ctx);

  /*
   * 12. FINAL BORDER
   */

  ctx.strokeStyle =
    COLORS.teal;

  ctx.lineWidth = 7;

  roundRect(
    ctx,
    18,
    18,
    CARD_WIDTH - 36,
    CARD_HEIGHT - 36,
    38
  );

  ctx.stroke();
}