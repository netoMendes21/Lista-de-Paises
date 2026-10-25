import Image from "next/image";
import Link from "next/link";
import { countryPath } from "@/lib/routes";
import GlobeIcon from "@/components/globe-icon";
import RegionBadge from "@/components/region-badge";
import type { Country } from "@/lib/countries";

type CountryCardProps = Pick<Country, "name" | "ptName" | "flag" | "flagAlt"> & { region?: string };

export default function CountryCard({ name, ptName, flag, flagAlt, region }: CountryCardProps) {
  return (
    <Link href={countryPath(name)} className="country-card" aria-label={`Conhecer ${ptName}`}>
      <article>
        <div className="flag-frame">
          <Image
            src={flag}
            alt={flagAlt}
            fill
            sizes="(max-width: 479px) 130px, 180px"
            className="flag-image"
          />
        </div>
        <div className="card-info">
          <h3>{ptName}</h3>
          <div className="card-footer">
            {region ? <RegionBadge region={region} /> : <span />}
            <span className="card-access" title="Ver detalhes" aria-hidden="true">
              <GlobeIcon />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
