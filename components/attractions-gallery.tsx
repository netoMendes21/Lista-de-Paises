"use client";

import { useId, useMemo, useState } from "react";
import { normalizeSearchText } from "@/lib/text";
import AttractionCard from "@/components/attraction-card";
import type { Attraction } from "@/lib/attractions";

const PAGE_SIZE = 12;

type AttractionsGalleryProps = { attractions: readonly Attraction[]; countryName: string };

export default function AttractionsGallery({ attractions, countryName }: AttractionsGalleryProps) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const listId = useId();
  const searchId = useId();
  const searchIndex = useMemo(
    () =>
      attractions.map((attraction) => ({
        attraction,
        text: normalizeSearchText(`${attraction.name} ${attraction.description}`),
      })),
    [attractions],
  );
  const filtered = useMemo(() => {
    const term = normalizeSearchText(query);
    return term
      ? searchIndex.filter((item) => item.text.includes(term)).map((item) => item.attraction)
      : attractions;
  }, [attractions, query, searchIndex]);
  const visible = filtered.slice(0, visibleCount);

  return (
    <>
      <p className="section-description">
        Explore atrações culturais, históricas e naturais. Clique em um card para saber mais.
      </p>
      {attractions.length > PAGE_SIZE ? (
        <div className="attractions-controls">
          <label htmlFor={searchId}>Buscar nesta lista</label>
          <input
            id={searchId}
            type="search"
            placeholder="Nome ou descrição da atração"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
          />
        </div>
      ) : null}
      <p className="attractions-count" role="status">
        {filtered.length
          ? `Exibindo ${visible.length} de ${filtered.length} atrações`
          : "Nenhuma atração encontrada para esta busca."}
      </p>
      <ul id={listId} className="attractions-grid">
        {visible.map((attraction) => (
          <li key={attraction.id}>
            <AttractionCard attraction={attraction} countryName={countryName} />
          </li>
        ))}
      </ul>
      {visible.length < filtered.length ? (
        <button
          className="attractions-more"
          aria-controls={listId}
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
        >
          Mostrar mais {Math.min(PAGE_SIZE, filtered.length - visible.length)} atrações
        </button>
      ) : null}
      <p className="attractions-note">
        A lista reúne registros disponíveis nas fontes consultadas e pode não abranger todas as
        atrações do destino.
      </p>
    </>
  );
}
