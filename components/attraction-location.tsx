import { formatList, getMapUrl } from "@/lib/attraction-details";
import type { AttractionDetails } from "@/lib/attraction-details";

type AttractionLocationProps = {
  details: AttractionDetails;
  attractionName: string;
  countryName: string;
};
const coordinateFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 4 });

export default function AttractionLocation({
  details,
  attractionName,
  countryName,
}: AttractionLocationProps) {
  const { coordinates, locations } = details;
  return (
    <section className="place-location" aria-labelledby="place-location-heading">
      <h2 id="place-location-heading">Localização</h2>
      <p>{locations.length ? formatList(locations) : countryName}</p>
      {coordinates ? (
        <>
          <iframe
            title={`Mapa de localização de ${attractionName}`}
            src={getMapUrl(coordinates)}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <p className="place-coordinates">
            Ponto de referência: {coordinateFormatter.format(coordinates.latitude)},{" "}
            {coordinateFormatter.format(coordinates.longitude)}.
          </p>
        </>
      ) : (
        <p className="place-limited-info">
          As coordenadas deste local ainda não estão disponíveis.
        </p>
      )}
    </section>
  );
}
