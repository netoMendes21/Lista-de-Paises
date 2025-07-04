import type { Country } from "@/app/page";
import CountryCard from "@/components/country-card";
import Image from "next/image";
import Link from "next/link";

type BorderCountry = {
  name: string;
  ptName: string;
  flag: string;
  flagAlt: string;
};

async function getCountryByName(name: string): Promise<Country> {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,translations,flags,capital,region,subregion,population,languages,borders,cca3"
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar países");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    console.error("Resposta inesperada da API:", data);
    throw new Error("A resposta da API não é um array.");
  }

  const country = data.find((country: Country) => country.name.common === name);

  if (!country) {
    throw new Error(`País "${name}" não encontrado.`);
  }

  return country;
}

async function getCountryBordersByName(
  name: string
): Promise<BorderCountry[] | undefined> {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,translations,flags,capital,region,subregion,population,languages,borders,cca3"
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar países");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    console.error("Resposta inesperada da API:", data);
    throw new Error("A resposta da API não é um array.");
  }

  const country = data.find((country: Country) => country.name.common === name);

  if (!country) {
    throw new Error(`País "${name}" não encontrado.`);
  }

  return country.borders
    ?.map((border: string) => {
      const borderCountry = data.find((c) => c.cca3 === border);
      if (!borderCountry) return null;
      return {
        name: borderCountry.name.common,
        ptName:
          borderCountry.translations.por?.common ?? borderCountry.name.common,
        flag: borderCountry.flags.svg,
        flagAlt: borderCountry.flags.alt,
      };
    })
    .filter((b): b is BorderCountry => b !== null);
}

export default async function CountryPage({
  params: { name },
}: {
  params: { name: string };
}) {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });

  const country = await getCountryByName(decodeURI(name));

  const borderCountries = await getCountryBordersByName(decodeURI(name));

  return (
    <section className="flex flex-col container">
      <h1 className="text-5xl text-center font-bold text-gray-800 my-16">
        {country.translations.por.common}
      </h1>
      <Link href="/" className="flex items-center py-2">
        <Image
          src="/arrow-back.svg"
          alt="seta de voltar"
          width={24}
          height={24}
        />
        Voltar
      </Link>
      <article className="flex md:flex-row flex-col justify-between min-w-full p-10 bg-white rounded-xl">
        <section className="flex flex-col gap-5">
          {country.capital && (
            <h2 className="text-xl text-gray-800">
              <b>🏙️ Capital:</b> {country.capital}
            </h2>
          )}
          <h2 className="text-xl text-gray-800">
            <b>🗺️ Continente:</b> {country.region}
            {country.subregion && ` - ${country.subregion}`}
          </h2>
          <h2 className="text-xl text-gray-800">
            <b>👨‍👩‍👧‍👦 População:</b> {formatter.format(country.population)}
          </h2>
          {country.languages && (
            <h2 className="text-xl text-gray-800">
              <b className="flex flex-wrap">🗣️Línguas faladas:</b>
              {Object.values(country.languages).map((language) => (
                <span
                  key={language}
                  className="inline-block mt-4 px-2 bg-indigo-700 mr-2 text-white text-sm rounded-full"
                >
                  {language}
                </span>
              ))}
            </h2>
          )}
        </section>
        <div className="relative h-48 my-2 mr-10 md:h-48 w-96 shadow-md md:order-last order-first">
          <Image
            src={country.flags.svg}
            alt={country.flags.alt}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </article>
      <section>
        <h3 className="mt-12 text-2xl font-semibold text-gray-800">
          Países que fazem fronteira
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full container gap-2">
          {borderCountries?.map((border: BorderCountry) => (
            <CountryCard key={border.name} {...border} />
          ))}
        </div>
      </section>
    </section>
  );
}
