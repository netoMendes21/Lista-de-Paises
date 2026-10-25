import Link from "next/link";
import type { Metadata } from "next";
import { countryPath } from "@/lib/routes";
import {
  getAttractionDetails,
  getAttractionFacts,
  getCategory,
  getAttractionStory,
} from "@/lib/attraction-details";
import { getAttractionPageData } from "@/app/pais/_lib/page-data";
import AttractionCredit from "@/components/attraction-credit";
import AttractionLocation from "@/components/attraction-location";
import AttractionPhoto from "@/components/attraction-photo";
import AttractionsGallery from "@/components/attractions-gallery";
import BackLink from "@/components/back-link";

type PageProps = { params: Promise<{ name: string; id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name, id } = await params;
  const { country, attraction } = await getAttractionPageData(name, id);
  return {
    title: `${attraction.name} · ${country.ptName} | Lista de países`,
    description: attraction.description,
  };
}

export default async function AttractionPage({ params }: PageProps) {
  const { name, id } = await params;
  const { country, attraction, attractions } = await getAttractionPageData(name, id);
  const details = getAttractionDetails(attraction.id);
  const category = getCategory(details);
  const history = getAttractionStory(attraction.id, details);
  const countryUrl = countryPath(country.name);
  const related = attractions.filter((item) => item.id !== attraction.id).slice(0, 4);
  const facts = getAttractionFacts(details, country.ptName);

  return (
    <article className="place-page" data-country-theme={country.code}>
      <BackLink href={`${countryUrl}#attractions-heading`} />
      <nav className="place-breadcrumb" aria-label="Caminho de navegação">
        <ol>
          <li>
            <Link className="navigation-button navigation-button--small" href="/">
              Países
            </Link>
          </li>
          <li>
            <Link className="navigation-button navigation-button--small" href={countryUrl}>
              {country.ptName}
            </Link>
          </li>
          <li aria-current="page">{attraction.name}</li>
        </ol>
      </nav>
      <header className="place-heading">
        <p className="eyebrow">CADA LUGAR TEM UMA HISTÓRIA</p>
        <h1>{attraction.name}</h1>
        <p className="place-intro">{attraction.description}</p>
        <div className="place-tags">
          <span>{country.ptName}</span>
          <span>{category}</span>
        </div>
      </header>
      <div className="place-overview">
        <figure className="place-figure">
          <AttractionPhoto attraction={attraction} hero />
          {attraction.image ? (
            <figcaption>
              <AttractionCredit image={attraction.image} />
            </figcaption>
          ) : null}
        </figure>
        <aside className="place-facts" aria-labelledby="place-facts-heading">
          <p className="eyebrow">UM OLHAR MAIS DE PERTO</p>
          <h2 id="place-facts-heading">Conheça este lugar</h2>
          <dl>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <Link className="place-country-link navigation-button" href={countryUrl}>
            Explorar {country.ptName}
          </Link>
        </aside>
      </div>
      <div className="place-story-layout">
        <section className="place-story" aria-labelledby="place-story-heading">
          <p className="eyebrow">POR TRÁS DA PAISAGEM</p>
          <h2 id="place-story-heading">História e características</h2>
          {history.length ? (
            history.map((section) => (
              <div className="place-story-section" key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </div>
            ))
          ) : (
            <p className="place-limited-info">
              Ainda não há informações históricas detalhadas disponíveis para este lugar. A
              descrição e a localização reúnem os dados confirmados no catálogo.
            </p>
          )}
        </section>
        <AttractionLocation
          details={details}
          attractionName={attraction.name}
          countryName={country.ptName}
        />
      </div>
      {related.length ? (
        <section className="place-related" aria-labelledby="place-related-heading">
          <div className="place-related-heading">
            <h2 id="place-related-heading">Continue explorando {country.ptName}</h2>
          </div>
          <AttractionsGallery countryName={country.name} attractions={related} />
        </section>
      ) : null}
    </article>
  );
}
