import assert from "node:assert/strict";
import { test } from "node:test";
import { countryPath, attractionPath } from "../lib/routes.ts";
import { normalizeSearchText } from "../lib/text.ts";

test("caminhos preservam nomes com espaços, acentos e caracteres reservados", () => {
  for (const country of [
    "Brazil",
    "New Caledonia",
    "Côte d'Ivoire",
    "São Tomé & Príncipe",
    "Destino/#?%",
  ]) {
    const url = new URL(attractionPath(country, "Q752218"), "https://example.test");
    assert.equal(decodeURIComponent(url.pathname.split("/")[2]), country);
    assert.equal(url.hash, "");
    assert.equal(url.search, "");
    assert.equal(url.pathname, countryPath(country) + "/atracao/Q752218");
  }
});

test("pesquisa aceita acentos, maiúsculas e espaços sem perder as palavras", () => {
  assert.equal(normalizeSearchText("  SÃO TOMÉ  "), "sao tome");
  assert.ok(
    normalizeSearchText("Cristo Redentor — Rio de Janeiro").includes(normalizeSearchText(" RÍO ")),
  );
  assert.equal(normalizeSearchText(""), "");
});
