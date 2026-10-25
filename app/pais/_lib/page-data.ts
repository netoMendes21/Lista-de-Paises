import { cache } from "react";
import { notFound } from "next/navigation";
import { getAttractions } from "@/lib/attractions";
import { getCountries } from "@/lib/countries";

/** Converte parâmetros codificados da URL e trata sequências inválidas como 404. */
function decodeParameter(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    notFound();
  }
}

/** Compartilha a resolução dos destinos entre as páginas e os metadados. */
export const getCountryPageData = cache(async (name: string) => {
  const decodedName = decodeParameter(name);
  const countries = await getCountries();
  const country = countries.find((item) => item.name === decodedName);
  if (!country) notFound();
  return { country, countries, attractions: getAttractions(country.code) };
});

export const getAttractionPageData = cache(async (name: string, id: string) => {
  const decodedId = decodeParameter(id);
  const { country, attractions } = await getCountryPageData(name);
  const attraction = attractions.find((item) => item.id === decodedId);
  if (!attraction) notFound();
  return { country, attraction, attractions };
});
