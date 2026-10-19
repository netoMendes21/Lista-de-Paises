import Icon from "@/components/icon";
import CountryCard from "@/components/country-card";
import { getCountries } from "@/lib/countries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CountryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  let decodedName: string;
  try {
    decodedName = decodeURIComponent(name);
  } catch {
    notFound();
  }
  const countries = await getCountries();
  const country = countries.find((item) => item.name === decodedName);
  if (!country) notFound();
  const borderCodes = new Set(country.borders);
  const borderCountries = countries.filter((item) => borderCodes.has(item.code));

  return (
    <section>
      <Link href="/" className="back-link">
        <Icon name="arrow-left" />
        <span>Voltar para todos os países</span>
      </Link>
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
      <h2 className="borders-heading">
        Países que fazem fronteira <span className="count-badge">{borderCountries.length}</span>
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
