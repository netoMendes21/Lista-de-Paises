"use client";

import { useState } from "react";
import Image from "next/image";
import type { Attraction } from "@/lib/attractions";

export default function AttractionPhoto({
  attraction,
  hero = false,
}: {
  attraction: Attraction;
  hero?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`attraction-photo${hero ? " attraction-photo--hero" : ""}`}>
      {attraction.image && !failed ? (
        <Image
          src={attraction.image.url}
          alt={attraction.name}
          fill
          sizes={
            hero
              ? "(max-width: 800px) 92vw, 760px"
              : "(max-width: 560px) 90vw, (max-width: 900px) 45vw, 380px"
          }
          unoptimized
          priority={hero}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="attraction-photo-empty">Imagem não disponível</span>
      )}
    </div>
  );
}
