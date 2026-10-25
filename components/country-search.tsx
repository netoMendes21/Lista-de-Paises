"use client";

import { useId, useState, type KeyboardEvent, type RefObject } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";
import { countryPath } from "@/lib/routes";
import GlobeIcon from "@/components/globe-icon";
import Icon from "@/components/icon";
import type { Country } from "@/lib/countries";

type CountrySearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
  suggestions: Country[];
  inputRef: RefObject<HTMLInputElement | null>;
};

export default function CountrySearch({
  query,
  onQueryChange,
  suggestions,
  inputRef,
}: CountrySearchProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const router = useRouter();
  const expanded = open && query.trim().length > 0;
  const activeIndex = active >= 0 && active < suggestions.length ? active : -1;

  function visit(country: Country) {
    setOpen(false);
    router.push(countryPath(country.name));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActive((previous) => {
        if (!suggestions.length) return -1;
        if (previous < 0) return event.key === "ArrowDown" ? 0 : suggestions.length - 1;
        const direction = event.key === "ArrowDown" ? 1 : -1;
        return (previous + direction + suggestions.length) % suggestions.length;
      });
    } else if (event.key === "Enter" && expanded && activeIndex >= 0) {
      event.preventDefault();
      visit(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <div
      className="search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setActive(-1);
        }
      }}
    >
      <label htmlFor="country-search" className="sr-only">
        Buscar país pelo nome
      </label>
      <Icon name="search" className="search-icon" />
      <input
        id="country-search"
        ref={inputRef}
        type="text"
        role="combobox"
        autoComplete="off"
        placeholder="Qual país você quer conhecer?"
        value={query}
        aria-expanded={expanded}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          expanded && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
        }
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onQueryChange(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={handleKeyDown}
      />
      {query ? (
        <button
          className="clear-search"
          type="button"
          aria-label="Limpar pesquisa"
          onClick={() => {
            onQueryChange("");
            setActive(-1);
            inputRef.current?.focus();
          }}
        >
          ×
        </button>
      ) : (
        <span className="search-hint" aria-hidden="true">
          Buscar
        </span>
      )}
      <div
        id={listId}
        role="listbox"
        aria-label="Sugestões de países"
        className="suggestions"
        hidden={!expanded}
      >
        {suggestions.length ? (
          suggestions.map((country, index) => (
            <div
              id={`${listId}-${index}`}
              key={country.code}
              role="option"
              aria-selected={activeIndex === index}
              className="suggestion"
              onPointerMove={() => setActive(index)}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => visit(country)}
            >
              <Image src={country.flag} alt="" width={36} height={24} />
              <span>{country.ptName}</span>
              <span className="suggestion-access" aria-hidden="true">
                <GlobeIcon />
              </span>
            </div>
          ))
        ) : (
          <p className="no-suggestions">Nenhum país encontrado.</p>
        )}
      </div>
    </div>
  );
}
