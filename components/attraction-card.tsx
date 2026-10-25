import Link from "next/link";
import { attractionPath } from "@/lib/routes";
import AttractionCredit from "@/components/attraction-credit";
import AttractionPhoto from "@/components/attraction-photo";
import type { Attraction } from "@/lib/attractions";

type AttractionCardProps = { attraction: Attraction; countryName: string };

export default function AttractionCard({ attraction, countryName }: AttractionCardProps) {
  return (
    <article className="attraction-card">
      <Link
        className="attraction-main-link"
        href={attractionPath(countryName, attraction.id)}
        aria-label={`Conhecer ${attraction.name}`}
      >
        <AttractionPhoto attraction={attraction} />
        <div className="attraction-content">
          <h3>{attraction.name}</h3>
          <p>{attraction.description}</p>
          <span className="navigation-button attraction-action">Explorar atração</span>
        </div>
      </Link>
      {attraction.image ? (
        <p className="attraction-credit">
          <AttractionCredit image={attraction.image} />
        </p>
      ) : null}
    </article>
  );
}
