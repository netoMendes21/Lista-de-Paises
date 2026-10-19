import Image from "next/image";
import GlobeIcon from "@/components/globe-icon";

export default function ExplorerHero({ countryCount }: { countryCount: number }) {
  return (
    <section className="hero" aria-labelledby="explore-title">
      <div className="hero-copy">
        <span className="eyebrow">
          <span className="status-dot" /> SEU PRÓXIMO DESTINO COMEÇA AQUI
        </span>
        <h1 id="explore-title">
          Tantos lugares.
          <br />
          <span>Um mundo de descobertas.</span>
        </h1>
        <p>
          Conheça países, descubra culturas e encontre novas perspectivas.
          <br className="desktop-break" /> A sua próxima descoberta está a uma busca de distância.
        </p>
        <div className="hero-meta">
          <GlobeIcon className="mini-globe" />
          {countryCount} países e territórios
          <span className="meta-divider" /> Infinitas possibilidades
        </div>
      </div>
      <div className="globe-art" aria-hidden="true">
        <div className="earth-sphere">
          <Image
            src="/earth.webp"
            alt=""
            width={512}
            height={512}
            sizes="240px"
            className="earth-image"
          />
        </div>
      </div>
    </section>
  );
}
