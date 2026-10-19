import { cache } from "react";

type ApiLanguage = {
  name: string;
  iso639_1?: string;
  iso639_2?: string;
};

type ApiCountry = {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  translations?: { pt?: string };
  capital?: string;
  region: string;
  subregion?: string;
  population: number;
  languages?: ApiLanguage[];
  borders?: string[];
};

export type Country = {
  name: string;
  ptName: string;
  code: string;
  flag: string;
  flagAlt: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  languages: string[];
  borders: string[];
};

const languageNames = new Intl.DisplayNames("pt-BR", {
  type: "language",
  fallback: "none",
});

// Idiomas da API ainda ausentes dos dados de localização do Intl.
const additionalLanguageNames: Record<string, string> = {
  kun: "kunama",
  nrb: "nara",
  hif: "hindi fijiano",
  rtm: "rotumano",
};

const regionNames: Record<string, string> = {
  Africa: "África",
  Americas: "Américas",
  Asia: "Ásia",
  Europe: "Europa",
  Oceania: "Oceania",
  Antarctic: "Antártida",
  "Antarctic Ocean": "Oceano Antártico",
  Polar: "Região polar",
  "": "Outras regiões",
};
const subregionNames: Record<string, string> = {
  "Central Europe": "Europa Central",
  "North America": "América do Norte",
  Antarctic: "Antártida",
  Antarctica: "Antártida",
  "South Antarctic Ocean": "Oceano Antártico Meridional",
  "Northern Africa": "África do Norte",
  "Western Africa": "África Ocidental",
  "Middle Africa": "África Central",
  "Eastern Africa": "África Oriental",
  "Southern Africa": "África Austral",
  "Northern America": "América do Norte",
  "Central America": "América Central",
  "South America": "América do Sul",
  Caribbean: "Caribe",
  "Central Asia": "Ásia Central",
  "Eastern Asia": "Ásia Oriental",
  "Western Asia": "Ásia Ocidental",
  "Southern Asia": "Ásia Meridional",
  "South-Eastern Asia": "Sudeste Asiático",
  "Northern Europe": "Europa Setentrional",
  "Southern Europe": "Europa Meridional",
  "Eastern Europe": "Europa Oriental",
  "Western Europe": "Europa Ocidental",
  "Australia and New Zealand": "Austrália e Nova Zelândia",
  Melanesia: "Melanésia",
  Micronesia: "Micronésia",
  Polynesia: "Polinésia",
};

function getLanguageName(language: ApiLanguage): string {
  for (const code of [language.iso639_1, language.iso639_2]) {
    if (!code || !/^[a-z]{2,3}$/i.test(code)) continue;
    const normalizedCode = code.toLowerCase();
    const name = additionalLanguageNames[normalizedCode] ?? languageNames.of(normalizedCode);
    if (name) return name;
  }
  return language.name;
}
function isApiCountry(value: unknown): value is ApiCountry {
  if (!value || typeof value !== "object") return false;
  const country = value as Record<string, unknown>;
  return (
    typeof country.name === "string" &&
    country.name.length > 0 &&
    typeof country.alpha2Code === "string" &&
    /^[a-z]{2}$/i.test(country.alpha2Code) &&
    typeof country.alpha3Code === "string" &&
    /^[a-z]{3}$/i.test(country.alpha3Code) &&
    typeof country.region === "string" &&
    typeof country.population === "number" &&
    Number.isFinite(country.population) &&
    country.population >= 0 &&
    (country.capital === undefined || typeof country.capital === "string") &&
    (country.subregion === undefined || typeof country.subregion === "string") &&
    (country.translations === undefined ||
      (country.translations !== null &&
        typeof country.translations === "object" &&
        (!("pt" in country.translations) || typeof country.translations.pt === "string"))) &&
    (country.languages === undefined ||
      (Array.isArray(country.languages) &&
        country.languages.every(
          (language: unknown) =>
            language !== null &&
            typeof language === "object" &&
            "name" in language &&
            typeof language.name === "string" &&
            (!("iso639_1" in language) ||
              language.iso639_1 === undefined ||
              typeof language.iso639_1 === "string") &&
            (!("iso639_2" in language) ||
              language.iso639_2 === undefined ||
              typeof language.iso639_2 === "string"),
        ))) &&
    (country.borders === undefined ||
      (Array.isArray(country.borders) &&
        country.borders.every((border: unknown) => typeof border === "string")))
  );
}

// Compartilha a consulta entre a página de detalhes e a lista de fronteiras.
export const getCountries = cache(async (): Promise<Country[]> => {
  const response = await fetch("https://countries.dev/countries", {
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error("Não foi possível consultar os países (HTTP " + response.status + ").");
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || data.length === 0 || !data.every(isApiCountry)) {
    throw new Error("A API retornou dados de países em um formato inesperado.");
  }

  return data
    .map((country) => {
      const ptName = country.translations?.pt || country.name;
      return {
        name: country.name,
        ptName,
        code: country.alpha3Code,
        flag: "https://flagcdn.com/" + country.alpha2Code.toLowerCase() + ".svg",
        flagAlt: "Bandeira de " + ptName,
        capital: country.capital || "",
        region: regionNames[country.region] ?? country.region,
        subregion: subregionNames[country.subregion || ""] ?? country.subregion ?? "",
        population: country.population,
        languages: country.languages?.map(getLanguageName) ?? [],
        borders: country.borders ?? [],
      };
    })
    .sort((a, b) => a.ptName.localeCompare(b.ptName, "pt-BR"));
});
