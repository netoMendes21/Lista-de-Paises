import Image from "next/image";
import { getCountries } from "@/lib/countries";
import { getCountryPageData } from "@/app/pais/_lib/page-data";
import AttractionsGallery from "@/components/attractions-gallery";
import BackLink from "@/components/back-link";
import CountryCard from "@/components/country-card";

// Entrega as páginas prontas e permite o prefetch completo dos links visíveis.
export const revalidate = 86400;

export async function generateStaticParams() {
  const countries = await getCountries();
  return countries.map((country) => ({ name: country.name }));
}

export default async function CountryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const { country, countries, attractions } = await getCountryPageData(name);
  const borderCodes = new Set(country.borders);
  const borderCountries = countries.filter((item) => borderCodes.has(item.code));

  return (
    <section data-country-theme={country.code}>
      <BackLink href="/" />
      <div className="detail-heading">
        <p className="eyebrow">CADA LUGAR, UMA NOVA DESCOBERTA</p>
        <h1>{country.ptName}</h1>
        <p>
          {country.region}
          {country.subregion && ` · ${country.subregion}`}
        </p>
      </div>
      <article className="detail-panel">
        <div className="detail-flag">
          <Image
            src={country.flag}
            alt={country.flagAlt}
            fill
            sizes="(max-width: 560px) 90vw, 480px"
            priority
          />
        </div>
        <dl className="detail-data">
          <div>
            <dt>Capital</dt>
            <dd>{country.capital || "Não informada"}</dd>
          </div>
          <div>
            <dt>Região</dt>
            <dd>
              {country.region}
              {country.subregion && ` · ${country.subregion}`}
            </dd>
          </div>
          <div>
            <dt>População</dt>
            <dd>{Intl.NumberFormat("pt-BR").format(country.population)} habitantes</dd>
          </div>
          <div>
            <dt>Línguas faladas</dt>
            <dd>
              {country.languages.length
                ? country.languages.map((language) => (
                    <span key={language} className="language-chip">
                      {language}
                    </span>
                  ))
                : "Não informadas"}
            </dd>
          </div>
        </dl>
      </article>
      <section className="attractions-section" aria-labelledby="attractions-heading">
        <h2 id="attractions-heading" className="section-heading">
          Principais pontos turísticos
        </h2>
        {attractions.length ? (
          <AttractionsGallery
            key={country.code}
            countryName={country.name}
            attractions={attractions}
          />
        ) : (
          <p className="attractions-empty">
            Ainda não há informações verificadas sobre pontos turísticos cadastradas para este
            destino.
          </p>
        )}
      </section>
      <h2 className="borders-heading">
        {borderCountries.length === 1 ? "País que faz fronteira" : "Países que fazem fronteira"}{" "}
        <span className="count-badge">{borderCountries.length}</span>
      </h2>
      {borderCountries.length ? (
        <div className="country-grid results-enter">
          {borderCountries.map((border) => (
            <CountryCard key={border.code} {...border} />
          ))}
        </div>
      ) : (
        <p className="muted">Este país não possui fronteiras terrestres.</p>
      )}
    </section>
  );
}
