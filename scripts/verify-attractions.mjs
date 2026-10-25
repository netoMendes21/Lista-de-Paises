import assert from "node:assert/strict";
import fs from "node:fs/promises";

const catalog = JSON.parse(
  await fs.readFile(new URL("../lib/data/attractions.json", import.meta.url), "utf8"),
);
const metadata = JSON.parse(
  await fs.readFile(new URL("../lib/data/attractions-meta.json", import.meta.url), "utf8"),
);
let entries = 0;
let photos = 0;
for (const [code, attractions] of Object.entries(catalog)) {
  assert.match(code, /^[A-Z]{3}$/, "Código de país inválido");
  const ids = new Set();
  for (const attraction of attractions) {
    assert.ok(!ids.has(attraction.id), `Atração repetida em ${code}: ${attraction.id}`);
    ids.add(attraction.id);
    assert.ok(attraction.name.trim() && attraction.description.trim());
    const source = new URL(attraction.sourceUrl);
    assert.equal(source.protocol, "https:");
    assert.ok(["pt.wikipedia.org", "whc.unesco.org"].includes(source.hostname));
    if (attraction.image) {
      const { image } = attraction;
      assert.ok(image.author.trim() && image.license.trim());
      assert.ok(
        ["upload.wikimedia.org", "thumb.wikimedia.org"].includes(new URL(image.url).hostname),
      );
      assert.equal(new URL(image.url).protocol, "https:");
      assert.equal(new URL(image.sourceUrl).hostname, "commons.wikimedia.org");
      assert.ok(
        ["creativecommons.org", "www.gnu.org"].includes(new URL(image.licenseUrl).hostname),
      );
      photos++;
    }
    entries++;
  }
}
assert.equal(entries, metadata.entries);
assert.equal(photos, metadata.entriesWithImage);
assert.equal(Object.keys(catalog).length, metadata.countries);
assert.ok(
  catalog.BRA.some((item) => item.id === "Q155174"),
  "O estádio do Maracanã deve estar corretamente identificado",
);
assert.ok(
  !catalog.BRA.some((item) =>
    ["Q18473928", "Q18473933", "Q2712903", "Q10366852"].includes(item.id),
  ),
);
assert.ok(catalog.NCL.some((item) => item.sourceUrl === "https://whc.unesco.org/en/list/1115/"));
console.log(
  `Catálogo validado: ${entries} atrações, ${photos} fotos e ${metadata.countries} destinos.`,
);

const details = JSON.parse(
  await fs.readFile(new URL("../lib/data/attraction-details.json", import.meta.url), "utf8"),
);
const allIds = new Set(
  Object.values(catalog)
    .flat()
    .map((item) => item.id),
);
for (const [id, detail] of Object.entries(details)) {
  assert.ok(allIds.has(id), "Detalhe sem atração correspondente: " + id);
  for (const field of [
    "types",
    "locations",
    "architects",
    "creators",
    "styles",
    "materials",
    "heritage",
  ]) {
    assert.ok(
      Array.isArray(detail[field]) &&
        detail[field].every((value) => typeof value === "string" && value.trim()),
    );
  }
  for (const field of ["inceptionYear", "openingYear"]) {
    if (detail[field] !== undefined)
      assert.ok(Number.isInteger(detail[field]) && detail[field] !== 0 && detail[field] <= 2026);
  }
  if (detail.coordinates) {
    assert.ok(
      Number.isFinite(detail.coordinates.latitude) && Math.abs(detail.coordinates.latitude) <= 90,
    );
    assert.ok(
      Number.isFinite(detail.coordinates.longitude) &&
        Math.abs(detail.coordinates.longitude) <= 180,
    );
  }
}
for (const id of allIds) assert.ok(Object.hasOwn(details, id), "Página sem dados de apoio: " + id);
assert.equal(details.Q79961.openingYear, 1931);
assert.ok(details.Q79961.coordinates.latitude < -22 && details.Q79961.coordinates.latitude > -23);
const stories = JSON.parse(
  await fs.readFile(new URL("../lib/data/attraction-stories.json", import.meta.url), "utf8"),
);
for (const [id, sections] of Object.entries(stories)) {
  assert.ok(allIds.has(id));
  assert.ok(sections.every((section) => section.title.trim() && section.text.trim()));
}
console.log("Detalhes das páginas validados: " + Object.keys(details).length + " locais únicos.");
