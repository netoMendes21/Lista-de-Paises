import details from "@/lib/data/attraction-details.json";
import stories from "@/lib/data/attraction-stories.json";

export type AttractionDetails = {
  wikidataId?: string;
  types: readonly string[];
  locations: readonly string[];
  architects: readonly string[];
  creators: readonly string[];
  styles: readonly string[];
  materials: readonly string[];
  heritage: readonly string[];
  inceptionYear?: number;
  openingYear?: number;
  coordinates?: { latitude: number; longitude: number };
};

const detailsById: Readonly<Partial<Record<string, AttractionDetails>>> = details;
const emptyDetails: AttractionDetails = {
  types: [],
  locations: [],
  architects: [],
  creators: [],
  styles: [],
  materials: [],
  heritage: [],
};

export function getAttractionDetails(id: string): AttractionDetails {
  return Object.hasOwn(detailsById, id) ? (detailsById[id] ?? emptyDetails) : emptyDetails;
}

export function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} a.C.` : String(year);
}

const listFormatter = new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" });
export function formatList(items: readonly string[]): string {
  return listFormatter.format(items);
}

export function getCategory(details: AttractionDetails): string {
  return (
    details.types.find((type) =>
      /museu|castelo|parque|praia|monumento|estátua|queda de água|sítio arqueológico|catedral|palácio|ponte|jardim|templo|estádio|montanha|arranha-céu/i.test(
        type,
      ),
    ) ?? "Lugar para descobrir"
  );
}

export function getHistory(details: AttractionDetails): { title: string; text: string }[] {
  const sections = [];
  if (details.openingYear !== undefined) {
    sections.push({
      title: "Um marco no tempo",
      text: `A inauguração aconteceu em ${formatYear(details.openingYear)}.`,
    });
  } else if (details.inceptionYear !== undefined) {
    sections.push({
      title: "Origens",
      text: `A história deste lugar remonta a ${formatYear(details.inceptionYear)}.`,
    });
  }
  const people = [...new Set([...details.architects, ...details.creators])];
  if (people.length) {
    sections.push({
      title: "As pessoas por trás do lugar",
      text: `Entre os profissionais associados à criação e ao projeto estão ${formatList(people)}.`,
    });
  }
  const design = [];
  if (details.styles.length)
    design.push(`A arquitetura apresenta referências de ${formatList(details.styles)}.`);
  if (details.materials.length)
    design.push(
      `Entre os materiais utilizados estão ${formatList(details.materials.map((material) => (material === "betão armado" ? "concreto armado" : material === "esteatito" ? "pedra-sabão (esteatito)" : material)))}.`,
    );
  if (design.length) sections.push({ title: "Formas e materiais", text: design.join(" ") });
  if (details.heritage.length)
    sections.push({
      title: "Reconhecimento patrimonial",
      text: `O local reúne registros de reconhecimento como ${formatList(details.heritage)}.`,
    });
  return sections;
}

export function getMapUrl(coordinates: { latitude: number; longitude: number }): string {
  const { latitude, longitude } = coordinates;
  const bounds = [
    Math.max(-180, longitude - 0.015),
    Math.max(-90, latitude - 0.01),
    Math.min(180, longitude + 0.015),
    Math.min(90, latitude + 0.01),
  ];
  const parameters = new URLSearchParams({
    bbox: bounds.join(","),
    layer: "mapnik",
    marker: `${latitude},${longitude}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${parameters}`;
}

const storiesById: Readonly<Partial<Record<string, readonly { title: string; text: string }[]>>> =
  stories;

export function getAttractionStory(
  id: string,
  details: AttractionDetails,
): readonly { title: string; text: string }[] {
  return [
    ...(Object.hasOwn(storiesById, id) ? (storiesById[id] ?? []) : []),
    ...getHistory(details),
  ];
}

export function getAttractionFacts(details: AttractionDetails, countryName: string) {
  const year = details.openingYear ?? details.inceptionYear;
  return [
    { label: "Destino", value: countryName },
    { label: "Localização", value: formatList(details.locations) },
    { label: "Tipo de lugar", value: getCategory(details) },
    {
      label: details.openingYear !== undefined ? "Inauguração" : "Origem",
      value: year !== undefined ? formatYear(year) : "",
    },
    { label: "Estilo", value: formatList(details.styles) },
  ].filter((fact) => fact.value);
}
