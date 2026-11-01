/**
 * Skapar utskriftsfärdiga A4-affischer med QR-kod i public/qr/, samt en
 * QR-kod som SVG för förhandsvisningen på /qr. Filerna checkas in, så sajten
 * behöver inget av detta vid körning. Kör om med `npm run qr` om adressen,
 * telefonnumret eller logotypen ändras (kräver Node 22.18 eller senare).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import fontkit from "@pdf-lib/fontkit";
import {
  PDFDocument,
  concatTransformationMatrix,
  popGraphicsState,
  pushGraphicsState,
  rgb,
  setCharacterSpacing,
} from "pdf-lib";
import QRCode from "qrcode";
import { business } from "../src/data/business.ts";

const posters = [
  {
    file: "silverkammen-hemsida",
    url: "https://www.silverkammen.se/",
    displayUrl: "www.silverkammen.se",
    title: "Besök vår hemsida",
    intro: "Skanna koden för priser, öppettider och bilder på vårt arbete.",
  },
  {
    file: "silverkammen-boka-tid",
    url: "https://www.silverkammen.se/boka",
    displayUrl: "www.silverkammen.se/boka",
    title: "Boka din nästa tid",
    intro: "Skanna koden och välj en tid som passar dig.",
  },
];

/** Samma färger som i src/app/globals.css. */
const hex = (value) =>
  rgb(...[1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16) / 255));
const colors = {
  paper: hex("#fbf9f6"),
  sand: hex("#f2eee8"),
  sandDeep: hex("#e6e0d7"),
  ink: hex("#1d1b19"),
  stone: hex("#6b645c"),
  bronze: hex("#94744a"),
  white: hex("#ffffff"),
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const CENTER = PAGE_WIDTH / 2;

/** Samma typsnitt som sajten, licensierade under SIL Open Font License. */
const fontFile = (name) => readFile(`scripts/fonts/${name}.ttf`);

const fontFiles = {
  logo: await fontFile("SourceSans3-SemiBold"),
  regular: await fontFile("Inter-Regular"),
  medium: await fontFile("Inter-Medium"),
  semibold: await fontFile("Inter-SemiBold"),
};

const logoSvg = await readFile("public/logo-mark.svg", "utf8");
const logoPaths = [...logoSvg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1].replace(/\s+/g, " "));

/** Ritar logotypen som vektor. Filens koordinater har y-axeln uppåt, se dess viewBox och transform. */
function drawLogo(page, { size, top }) {
  const unit = size / 1174;
  const left = CENTER - size / 2;
  page.pushOperators(
    pushGraphicsState(),
    concatTransformationMatrix(1, 0, 0, -1, 0, top - 1121 * unit),
  );
  for (const path of logoPaths) {
    page.drawSvgPath(path, { x: left - 92 * unit, y: 0, scale: 0.1 * unit, color: colors.ink });
  }
  page.pushOperators(popGraphicsState());
}

/** Centrerad text med valfritt teckenavstånd i em, som `label` på sajten. */
function drawCentered(page, text, { y, font, size, color, tracking = 0 }) {
  const spacing = tracking * size;
  const width = font.widthOfTextAtSize(text, size) + spacing * (text.length - 1);
  page.pushOperators(pushGraphicsState(), setCharacterSpacing(spacing));
  page.drawText(text, { x: CENTER - width / 2, y, font, size, color });
  page.pushOperators(popGraphicsState());
}

/** Rundad rektangel som SVG-sökväg, med origo i övre vänstra hörnet. */
function roundedRectPath(size, r) {
  const side = size - 2 * r;
  return `M ${r} 0 h ${side} a ${r} ${r} 0 0 1 ${r} ${r} v ${side} a ${r} ${r} 0 0 1 ${-r} ${r} h ${-side} a ${r} ${r} 0 0 1 ${-r} ${-r} v ${-side} a ${r} ${r} 0 0 1 ${r} ${-r} z`;
}

/** Alla moduler i en enda sökväg, så att det inte blir tunna glapp mellan dem vid utskrift. */
function qrPath(url) {
  const { modules } = QRCode.create(url, { errorCorrectionLevel: "Q" });
  let path = "";
  for (let row = 0; row < modules.size; row++) {
    for (let col = 0; col < modules.size; col++) {
      if (modules.get(row, col)) path += `M ${col} ${row} h 1 v 1 h -1 z `;
    }
  }
  return { path, size: modules.size };
}

async function createPoster({ url, displayUrl, title, intro }) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(`${business.name} – ${title}`);
  pdf.setAuthor(business.name);
  pdf.setSubject(url);
  pdf.setLanguage("sv-SE");

  const [logo, regular, medium, semibold] = await Promise.all(
    [fontFiles.logo, fontFiles.regular, fontFiles.medium, fontFiles.semibold].map((file) =>
      // Utan calt byter Inter bindestrecket i "070-026" mot en bredare variant.
      pdf.embedFont(file, { features: { calt: false } }),
    ),
  );

  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: colors.paper });

  drawLogo(page, { size: 92, top: PAGE_HEIGHT - 52 });
  drawCentered(page, "Silver Kammen", {
    y: 656,
    font: logo,
    size: 32,
    color: colors.ink,
  });
  drawCentered(page, "BARBERSHOP · SÖDERKÖPING", {
    y: 632,
    font: medium,
    size: 9.5,
    color: colors.bronze,
    tracking: 0.16,
  });

  drawCentered(page, title, {
    y: 574,
    font: semibold,
    size: 36,
    color: colors.ink,
    tracking: -0.025,
  });
  drawCentered(page, intro, { y: 546, font: regular, size: 13, color: colors.stone });

  const card = 330;
  const cardTop = 522;
  const cardLeft = CENTER - card / 2;
  page.drawSvgPath(roundedRectPath(card, 18), {
    x: cardLeft,
    y: cardTop,
    color: colors.white,
    borderColor: colors.sandDeep,
    borderWidth: 1,
  });

  const qr = qrPath(url);
  const inset = 24;
  page.drawSvgPath(qr.path, {
    x: cardLeft + inset,
    y: cardTop - inset,
    scale: (card - 2 * inset) / qr.size,
    color: colors.ink,
  });

  drawCentered(page, displayUrl, { y: 158, font: medium, size: 15, color: colors.ink });

  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: 104, color: colors.sand });
  page.drawLine({
    start: { x: 0, y: 104 },
    end: { x: PAGE_WIDTH, y: 104 },
    thickness: 0.75,
    color: colors.sandDeep,
  });
  const { street, postalCode, city } = business.address;
  drawCentered(page, `${street}, ${postalCode} ${city}`, {
    y: 58,
    font: regular,
    size: 11,
    color: colors.stone,
  });
  drawCentered(page, business.phone.display, { y: 40, font: regular, size: 11, color: colors.stone });

  return pdf.save();
}

await mkdir("public/qr", { recursive: true });
for (const poster of posters) {
  await writeFile(`public/qr/${poster.file}.pdf`, await createPoster(poster));
  await writeFile(
    `public/qr/${poster.file}.svg`,
    await QRCode.toString(poster.url, {
      type: "svg",
      errorCorrectionLevel: "Q",
      margin: 0,
      color: { dark: "#1d1b19", light: "#ffffff" },
    }),
  );
  console.log(`public/qr/${poster.file}.pdf → ${poster.url}`);
}
