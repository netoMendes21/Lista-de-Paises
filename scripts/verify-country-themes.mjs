import assert from "node:assert/strict";
import fs from "node:fs/promises";

const themes = JSON.parse(
  await fs.readFile(new URL("../lib/data/country-themes.json", import.meta.url), "utf8"),
);
const css = await fs.readFile(new URL("../app/country-themes.css", import.meta.url), "utf8");
function luminance(hex) {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((channel) => {
      const value = parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a, b) {
  const first = luminance(a),
    second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
assert.equal(Object.keys(themes).length, 250);
for (const [code, theme] of Object.entries(themes)) {
  assert.match(code, /^[A-Z]{3}$/);
  assert.ok(css.includes(`[data-country-theme="${code}"]`), `Paleta sem CSS: ${code}`);
  assert.match(theme.flagUrl, /^https:\/\/flagcdn\.com\/[a-z]{2}\.svg$/);
  for (const mode of ["light", "dark"]) {
    for (const key of [
      "bg",
      "surface",
      "surface-alt",
      "soft",
      "text",
      "muted",
      "accent",
      "accent-soft",
      "border",
      "stripe-primary",
      "stripe-secondary",
    ])
      assert.match(theme[mode][key], /^#[0-9a-f]{6}$/i);
    for (const foreground of ["text", "muted", "accent"]) {
      for (const background of ["bg", "surface", "surface-alt", "soft", "accent-soft"]) {
        const ratio = contrast(theme[mode][foreground], theme[mode][background]);
        assert.ok(
          ratio >= 4.5,
          `${code}/${mode}: ${foreground} sobre ${background} tem contraste ${ratio.toFixed(2)}`,
        );
      }
    }
  }
}
assert.equal(themes.ESP.dark.bg, "#241519", "Preservar a Espanha aprovada");
assert.equal(themes.ESP.dark.accent, "#ffca55");
assert.notEqual(themes.BRA.dark.bg, themes.ESP.dark.bg);
assert.notEqual(themes.JPN.dark.bg, themes.BRA.dark.bg);
assert.equal(
  themes.CHE.secondary,
  "#ffffff",
  "Usar o branco da bandeira suíça, não bordas rosadas de suavização",
);
assert.equal(
  themes.SAU.secondary,
  "#ffffff",
  "Usar o branco da bandeira saudita, não um segundo tom de verde",
);
console.log(
  `Validadas ${Object.keys(themes).length} paletas nos dois temas: contraste mínimo 4,5:1 nos textos e botões.`,
);
