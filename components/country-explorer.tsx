"use client";

import Icon from "@/components/icon";

import { useMemo, useRef, useState } from "react";
import CountryCard from "@/components/country-card";
import CountrySearch from "@/components/country-search";
import ExplorerHero from "@/components/explorer-hero";
import type { Country } from "@/lib/countries";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

/** Coordena os filtros; busca, apresentação e cards possuem componentes próprios. */
export default function CountryExplorer({ countries }: { countries: Country[] }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchIndex = useMemo(
    () =>
      countries.map((country) => ({
        country,
        search: normalize(country.ptName),
      })),
    [countries],
  );
  const normalizedQuery = normalize(query);
  const matches = searchIndex
    .filter((item) => item.search.includes(normalizedQuery))
    .map((item) => item.country);
  const results = region ? matches.filter((country) => country.region === region) : matches;
  const regions = [...new Set(countries.map((country) => country.region).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "pt-BR"),
  );

  function clearFilters() {
    setQuery("");
    setRegion("");
    inputRef.current?.focus();
  }

  return (
    <>
      <ExplorerHero countryCount={countries.length} />
      <section className="explorer" aria-label="Explorar países">
        <div className="toolbar">
          <CountrySearch
            query={query}
            onQueryChange={setQuery}
            suggestions={matches.slice(0, 6)}
            inputRef={inputRef}
          />
          <label className="region-filter">
            <Icon name="filter" />
            <span className="sr-only">Filtrar por região</span>
            <select value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="">Todas as regiões</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="results-heading">
          <h2>
            {query.trim() || region ? "Suas descobertas" : "Explore o mundo"}
            <span className="count-badge">{results.length}</span>
          </h2>
          <p role="status" aria-live="polite">
            {results.length === countries.length
              ? "Todos os países, novas possibilidades"
              : `${results.length} ${results.length === 1 ? "país encontrado" : "países encontrados"}`}
          </p>
        </div>
        {results.length ? (
          <div key={`${normalizedQuery}-${region}`} className="country-grid results-enter">
            {results.map((country) => (
              <CountryCard key={country.code} {...country} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">⌕</span>
            <h3>Nenhum país encontrado</h3>
            <p>Tente outro nome ou escolha uma região diferente.</p>
            <button className="primary-button" onClick={clearFilters}>
              Limpar filtros
            </button>
          </div>
        )}
      </section>
    </>
  );
}
