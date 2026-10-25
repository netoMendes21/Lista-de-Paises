import { cache } from "react";
import { notFound } from "next/navigation";
import { getAttractions } from "@/lib/attractions";
import { getCountries } from "@/lib/countries";

/** Compartilha a resolução dos destinos entre as páginas e os metadados. */
export const getCountryPageData = cache(async (name: string) => {
  const countries = await getCountries();
  const country = countries.find((item) => item.name === name);
  if (!country) notFound();
  return { country, countries, attractions: getAttractions(country.code) };
});

export const getAttractionPageData = cache(async (name: string, id: string) => {
  const { country, attractions } = await getCountryPageData(name);
  const attraction = attractions.find((item) => item.id === id);
  if (!attraction) notFound();
  return { country, attraction, attractions };
});
