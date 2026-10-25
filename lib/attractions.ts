import catalog from "@/lib/data/attractions.json";

export type Attraction = {
  id: string;
  name: string;
  description: string;
  sourceUrl: string;
  sourceName: string;
  dataUrl?: string;
  image?: {
    url: string;
    author: string;
    license: string;
    licenseUrl: string;
    sourceUrl: string;
  };
};

const attractionsByCountry: Readonly<Partial<Record<string, readonly Attraction[]>>> = catalog;

export function getAttractions(countryCode: string): readonly Attraction[] {
  return attractionsByCountry[countryCode.toUpperCase()] ?? [];
}
