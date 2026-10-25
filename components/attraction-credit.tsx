import type { Attraction } from "@/lib/attractions";

export default function AttractionCredit({ image }: { image: NonNullable<Attraction["image"]> }) {
  return (
    <>
      Foto:{" "}
      <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">
        {image.author}
      </a>
      {" · "}
      <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer">
        {image.license}
      </a>
    </>
  );
}
