import CountryCard from "@/components/country-card";

export type Country = {
  name: {
    common: string;
  };

  translations: {
    por: {
      common: string;
    };
  };

  flags: {
    svg: string;
    alt: string;
  };

  capital: string;
  region: string;
  subregion: string;
  population: number;
  languages: string[];

  borders?: string[];
  cca3: string;
};

async function getCountries(): Promise<Country[]> {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,translations,flags,capital,region,subregion,population,languages,borders,cca3"
  );

  const data = await response.json();

  // Se o retorno não for um array, houve erro
  if (!Array.isArray(data)) {
    console.error("Erro ao buscar países:", data);
    return [];
  }

  return data;
}

export default async function Home() {
  const countries = await getCountries();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full container gap-2 mt-16">
      {countries.map((country) => (
        <CountryCard
          name={country.name.common}
          ptName={country.translations.por.common}
          flag={country.flags.svg}
          flagAlt={country.flags.alt}
          key={country.name.common}
        />
      ))}
    </section>
  );
}
