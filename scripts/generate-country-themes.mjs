import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { format, resolveConfig } from "prettier";

const root = fileURLToPath(new URL("../", import.meta.url));
const cache = path.join(root, ".cache/country-theme-flags");
await fs.mkdir(cache, { recursive: true });
const rgb = (hex) =>
  hex
    .replace("#", "")
    .match(/../g)
    .map((channel) => parseInt(channel, 16));
const hex = (channels) =>
  "#" +
  channels
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
const mix = (first, second, amount) =>
  hex(rgb(first).map((channel, index) => channel * (1 - amount) + rgb(second)[index] * amount));
const saturation = (color) => {
  const channels = rgb(color).map((channel) => channel / 255);
  const min = Math.min(...channels),
    max = Math.max(...channels);
  return max === min ? 0 : (max - min) / (1 - Math.abs(max + min - 1));
};
const lightness = (color) => (Math.max(...rgb(color)) + Math.min(...rgb(color))) / 510;
const hue = (color) => {
  const [r, g, b] = rgb(color).map((channel) => channel / 255);
  const min = Math.min(r, g, b),
    max = Math.max(r, g, b),
    delta = max - min;
  if (!delta) return 0;
  return (
    ((max === r ? (g - b) / delta : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4) * 60 +
      360) %
    360
  );
};
const hueDistance = (a, b) => {
  const difference = Math.abs(hue(a) - hue(b));
  return Math.min(difference, 360 - difference);
};
const distance = (first, second) =>
  Math.hypot(...rgb(first).map((channel, index) => (channel - rgb(second)[index]) / 255));
function luminance(color) {
  const channels = rgb(color).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(first, second) {
  const a = luminance(first),
    b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
function readable(color, backgrounds, mode) {
  for (let step = 0; step <= 100; step++) {
    const candidate = mix(color, mode === "light" ? "#101115" : "#fffdf7", step / 100);
    if (backgrounds.every((background) => contrast(candidate, background) >= 4.5)) return candidate;
  }
  throw new Error("Não foi possível gerar contraste suficiente");
}
function createPalette(primary, secondary, mode) {
  const dark = mode === "dark";
  const tint = (base, amount) => {
    let color = mix(primary, base, amount);
    while (dark && luminance(color) > 0.09 && amount < 1) {
      amount = Math.min(1, amount + 0.02);
      color = mix(primary, base, amount);
    }
    return color;
  };
  const bg = tint(dark ? "#121418" : "#ffffff", dark ? 0.84 : 0.965);
  const surface = tint(dark ? "#202127" : "#ffffff", dark ? 0.75 : 0.99);
  const surfaceAlt = tint(dark ? "#24252b" : "#ffffff", dark ? 0.68 : 0.95);
  const soft = tint(dark ? "#2d2d33" : "#ffffff", dark ? 0.6 : 0.89);
  const accentSoft = tint(dark ? "#24232a" : "#ffffff", dark ? 0.62 : 0.9);
  const backgrounds = [bg, surface, surfaceAlt, soft, accentSoft];
  const accentSeed = dark && saturation(secondary) > 0.25 ? secondary : primary;
  return {
    bg,
    surface,
    "surface-alt": surfaceAlt,
    soft,
    text: readable(mix(primary, dark ? "#fffaf1" : "#18191e", 0.9), backgrounds, mode),
    muted: readable(mix(primary, dark ? "#ddd8dc" : "#45434a", 0.8), backgrounds, mode),
    accent: readable(accentSeed, backgrounds, mode),
    "accent-soft": accentSoft,
    border: mix(primary, dark ? "#665c64" : "#ffffff", dark ? 0.62 : 0.76),
    shadow: dark
      ? "inset 0 1px 0 #ffffff08, 0 4px 16px #080a1038"
      : `inset 0 1px 0 #ffffff90, 0 4px 16px ${primary}12`,
    "hover-shadow": dark
      ? "inset 0 1px 0 #ffffff08, 0 9px 24px #080a1055"
      : `0 9px 24px ${primary}24`,
    glow: primary + "18",
    "glow-secondary": secondary + "12",
    "stripe-primary": primary,
    "stripe-secondary": secondary,
  };
}

// Preserve the Spain palette approved in the interface review.
const spain = {
  light: {
    bg: "#fff8eb",
    surface: "#fffdf7",
    "surface-alt": "#fff3da",
    soft: "#f7e6cf",
    text: "#41252a",
    muted: "#785b54",
    accent: "#9f2037",
    "accent-soft": "#fbe3d5",
    border: "#e6c6a8",
    shadow: "inset 0 1px 0 #ffffff90, 0 4px 16px #651d1d12",
    "hover-shadow": "0 9px 24px #651d1d24",
    glow: "#f4c04422",
    "glow-secondary": "#bb263415",
    "stripe-primary": "#aa2038",
    "stripe-secondary": "#d89d19",
  },
  dark: {
    bg: "#241519",
    surface: "#362023",
    "surface-alt": "#40272b",
    soft: "#4a3030",
    text: "#fff5e5",
    muted: "#d9beb7",
    accent: "#ffca55",
    "accent-soft": "#543120",
    border: "#704148",
    shadow: "inset 0 1px 0 #ffe6bb08, 0 4px 16px #10060935",
    "hover-shadow": "inset 0 1px 0 #ffe6bb08, 0 9px 24px #10060955",
    glow: "#c53b3b16",
    "glow-secondary": "#e3ad3210",
    "stripe-primary": "#d04b58",
    "stripe-secondary": "#ffca55",
  },
};

async function getFlag(alpha2) {
  const file = path.join(cache, alpha2.toLowerCase() + ".svg");
  try {
    return await fs.readFile(file);
  } catch {}
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`https://flagcdn.com/${alpha2.toLowerCase()}.svg`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) continue;
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(file, buffer);
    return buffer;
  }
  throw new Error("Bandeira indisponível: " + alpha2);
}
async function extractColors(buffer) {
  const { data, info } = await sharp(buffer)
    .resize(120, 80, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buckets = new Map();
  for (let index = 0; index < data.length; index += info.channels) {
    const alpha = data[index + 3] / 255;
    if (alpha < 0.5) continue;
    const channels = [0, 1, 2].map((channel) =>
      Math.min(255, Math.round(data[index + channel] / 16) * 16),
    );
    // Group nearly white edge pixels with the flag's white details.
    const color =
      Math.min(...channels) >= 224 && Math.max(...channels) - Math.min(...channels) <= 32
        ? "#ffffff"
        : hex(channels);
    buckets.set(color, (buckets.get(color) ?? 0) + alpha);
  }
  const groups = [];
  for (const [color, weight] of [...buckets].sort((a, b) => b[1] - a[1])) {
    const group = groups.find((group) => distance(group.color, color) < 0.16);
    if (group) group.weight += weight;
    else groups.push({ color, weight });
  }
  groups.sort((a, b) => b.weight - a.weight);
  const saturated = groups.filter(
    (group) =>
      saturation(group.color) > 0.25 &&
      lightness(group.color) > 0.06 &&
      lightness(group.color) < 0.88 &&
      group.weight > 35,
  );
  const primaryGroup =
    saturated[0] ?? groups.find((group) => lightness(group.color) < 0.65) ?? groups[0];
  const primary = primaryGroup.color;
  const secondary =
    saturated.find(
      (group) =>
        hueDistance(primary, group.color) >= 25 &&
        distance(primary, group.color) > 0.5 &&
        group.weight >= Math.max(160, primaryGroup.weight * 0.07),
    )?.color ??
    groups.find(
      (group) =>
        saturation(group.color) < 0.18 &&
        distance(primary, group.color) > 0.65 &&
        group.weight >= 35,
    )?.color ??
    primary;
  return { primary, secondary };
}

const response = await fetch("https://countries.dev/countries", {
  signal: AbortSignal.timeout(20000),
});
if (!response.ok) throw new Error("API de países indisponível");
const countries = await response.json();
if (
  !Array.isArray(countries) ||
  countries.length < 200 ||
  countries.some(
    (country) => !/^[A-Z]{3}$/.test(country.alpha3Code) || !/^[A-Z]{2}$/.test(country.alpha2Code),
  )
)
  throw new Error("Formato inesperado da lista de países");
const themes = {};
let next = 0;
async function worker() {
  while (next < countries.length) {
    const index = next++;
    const country = countries[index];
    const colors = await extractColors(await getFlag(country.alpha2Code));
    themes[country.alpha3Code] = {
      name: country.translations?.pt ?? country.name,
      flagUrl: `https://flagcdn.com/${country.alpha2Code.toLowerCase()}.svg`,
      ...colors,
      light:
        country.alpha3Code === "ESP"
          ? spain.light
          : createPalette(colors.primary, colors.secondary, "light"),
      dark:
        country.alpha3Code === "ESP"
          ? spain.dark
          : createPalette(colors.primary, colors.secondary, "dark"),
    };
    if ((index + 1) % 25 === 0) console.log(`Paletas: ${index + 1}/${countries.length}`);
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
const sorted = Object.fromEntries(Object.entries(themes).sort(([a], [b]) => a.localeCompare(b)));
const keys = Object.keys(spain.light);
let css = "/* Gerado por scripts/generate-country-themes.mjs a partir das bandeiras. */\n";
for (const [code, theme] of Object.entries(sorted)) {
  css += `html:root:has([data-country-theme="${code}"]) {\n`;
  for (const mode of ["light", "dark"])
    for (const key of keys) css += `  --country-${mode}-${key}: ${theme[mode][key]};\n`;
  css += "}\n";
}
function aliases(mode) {
  return keys
    .map(
      (key) =>
        `  --${key === "stripe-primary" ? "destination-primary" : key === "stripe-secondary" ? "destination-secondary" : key}: var(--country-${mode}-${key});`,
    )
    .join("\n");
}
css += `\nhtml:root:has([data-country-theme]) {\n${aliases("light")}\n}\n`;
css += `html:root[data-theme="dark"]:has([data-country-theme]) {\n${aliases("dark")}\n}\n`;
css += `@media (prefers-color-scheme: dark) {\n  html:root:not([data-theme="light"]):has([data-country-theme]) {\n${aliases("dark")}\n  }\n}\n`;
css += `
html:has([data-country-theme]) .site-header {
  background: linear-gradient(115deg, var(--surface), var(--surface-alt));
  border-bottom: 1px solid var(--border);
  box-shadow: inset 0 3px 0 var(--destination-primary), inset 0 5px 0 var(--destination-secondary);
}
[data-country-theme] .detail-heading,
[data-country-theme] .place-heading {
  position: relative;
  padding-left: 20px;
  border-left: 4px solid var(--destination-primary);
}
[data-country-theme] .detail-heading::before,
[data-country-theme] .place-heading::before {
  content: "";
  position: absolute;
  width: 4px;
  height: 35%;
  top: 32.5%;
  left: -4px;
  background: var(--destination-secondary);
}
[data-country-theme] .detail-panel,
[data-country-theme] .place-facts { border-top: 2px solid var(--destination-secondary); }
`;
const formatting = await resolveConfig(path.join(root, ".prettierrc.json"));
await fs.writeFile(
  path.join(root, "app/country-themes.css"),
  await format(css, { ...formatting, parser: "css" }),
);
await fs.writeFile(
  path.join(root, "lib/data/country-themes.json"),
  JSON.stringify(sorted, null, 2) + "\n",
);
console.log(`Concluído: ${Object.keys(sorted).length} destinos com paletas claras e escuras.`);
