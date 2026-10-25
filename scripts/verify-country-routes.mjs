import assert from "node:assert/strict";
import { test } from "node:test";
import { countryPath, attractionPath } from "../lib/routes.ts";

const baseUrl = process.env.APP_URL ?? "http://127.0.0.1:3001";

for (const [name, heading] of [
  ["Brazil", "Brasil"],
  ["United States of America", "Estados Unidos"],
  ["New Caledonia", "Nova Caledónia"],
]) {
  test(`página de ${name} aceita o caminho codificado`, async () => {
    const response = await fetch(new URL(countryPath(name), baseUrl));
    assert.equal(response.status, 200, `${name} deve abrir sem resposta 404`);
    const html = await response.text();
    assert.ok(html.includes(`<h1>${heading}</h1>`), "O destino correto deve ser exibido");
  });
}

test("atração de país com espaços no nome também abre", async () => {
  const response = await fetch(
    new URL(attractionPath("United States of America", "Q9202"), baseUrl),
  );
  assert.equal(response.status, 200);
  assert.ok((await response.text()).includes("Estátua da Liberdade"));
});
